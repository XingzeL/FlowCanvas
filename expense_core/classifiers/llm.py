from __future__ import annotations

import json
import os
import re
import urllib.error
import urllib.request
from collections.abc import Callable
from typing import Any

from expense_core.classifiers.base import normalize_category, txn_display_name
from expense_core.models import Txn
from expense_core.categories import CATEGORY_NAMES

ApiCaller = Callable[[str, str, list[dict[str, Any]]], str]


def build_system_prompt(categories: list[str] | None = None) -> str:
    cats = categories or CATEGORY_NAMES
    cat_list = "、".join(cats)
    return (
        "你是个人消费账单分类助手。"
        f"将每笔交易归入以下类别之一（只能使用下列名称，不得发明新类别）：{cat_list}。\n"
        "分类参考：游戏动漫含游戏充值、手办模型(GSC/Good Smile/figma)、谷子、动漫/IP周边(如蔚蓝档案/碧蓝档案)；"
        "购物消费含日用品、服饰数码、礼物与定制工艺品(含定制唱片/黑胶/刻录)；"
        "餐饮食品含外卖、餐厅、咖啡、零食；交通出行含出行、住宿、门票；"
        "会员订阅含软件/视频/云盘/加速器会员；其余按字面含义选择最接近的类别。\n"
        "用户会提供 JSON 数组，每项包含 id、name（商户/摘要名称）、amount（金额，元）。\n"
        "请只返回 JSON 数组，每项为 {\"id\": <数字>, \"category\": \"<类别名>\"}，"
        "不要 markdown、不要解释。"
    )


def _extract_json_array(text: str) -> list[dict[str, Any]]:
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    start = text.find("[")
    end = text.rfind("]")
    if start < 0 or end < 0:
        raise ValueError("LLM 响应中未找到 JSON 数组")
    return json.loads(text[start : end + 1])


def default_api_call(api_base: str, api_key: str, model: str, body: dict) -> str:
    url = f"{api_base.rstrip('/')}/chat/completions"
    timeout = float(body.pop("_timeout", 60))
    payload = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"LLM API HTTP {e.code}: {detail[:300]}") from e
    except urllib.error.URLError as e:
        raise RuntimeError(f"LLM API 连接失败: {e.reason}") from e

    try:
        return data["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError) as e:
        raise RuntimeError(f"LLM API 响应格式异常: {data!r}") from e


class LLMClassifier:
    """调用 OpenAI 兼容 Chat Completions API 进行批量分类。"""

    def __init__(
        self,
        *,
        api_key: str,
        api_base: str = "https://api.openai.com/v1",
        model: str = "gpt-4o-mini",
        batch_size: int = 30,
        timeout_seconds: float = 60,
        system_prompt: str | None = None,
        api_caller: ApiCaller | None = None,
    ) -> None:
        if not api_key:
            raise ValueError("LLM API key 未配置")
        self._api_key = api_key
        self._api_base = api_base
        self._model = model
        self._batch_size = max(1, batch_size)
        self._timeout = timeout_seconds
        self._system_prompt = system_prompt or build_system_prompt()
        self._api_caller = api_caller

    def classify(self, txn: Txn) -> str:
        return self.classify_many([txn])[0]

    def classify_many(self, txns: list[Txn]) -> list[str]:
        if not txns:
            return []
        out: list[str] = []
        for i in range(0, len(txns), self._batch_size):
            batch = txns[i : i + self._batch_size]
            out.extend(self._classify_batch(batch, offset=i))
        return out

    def _classify_batch(self, batch: list[Txn], offset: int) -> list[str]:
        items = [
            {
                "id": offset + idx,
                "name": txn_display_name(t),
                "amount": round(t.amount, 2),
            }
            for idx, t in enumerate(batch)
        ]
        user_content = json.dumps(items, ensure_ascii=False)
        body = {
            "model": self._model,
            "temperature": 0,
            "messages": [
                {"role": "system", "content": self._system_prompt},
                {"role": "user", "content": user_content},
            ],
            "_timeout": self._timeout,
        }
        if self._api_caller:
            content = self._api_caller(self._api_base, self._api_key, body)
        else:
            content = default_api_call(
                self._api_base, self._api_key, self._model, body
            )

        parsed = _extract_json_array(content)
        by_id: dict[int, str] = {}
        for row in parsed:
            if not isinstance(row, dict):
                continue
            rid = row.get("id")
            cat = row.get("category")
            if isinstance(rid, int) and isinstance(cat, str):
                by_id[rid] = normalize_category(cat)

        if len(by_id) < len(batch):
            raise RuntimeError(
                f"LLM 返回条目不足: 期望 {len(batch)}，解析到 {len(by_id)}"
            )

        return [by_id[offset + idx] for idx in range(len(batch))]
