from __future__ import annotations

import json
from pathlib import Path

DEFAULT_CONFIG: dict = {
    "pure_spending": {
        "enabled": True,
        "exclude_transfer_keywords": ["橘宝", "橘)", "七秒", "代存", "七.秒"],
        "exclude_merchant_keywords": ["贝壳租房", "信富住房", "住房租赁"],
        "exclude_non_spending_keywords": [
            "ATM取款", "本行ATM", "现金取款", "取现",
            "养老金", "公积金",
            "小金库", "肯特瑞",
            "理财产品", "结构性存款",
            "华鑫信托", "金条华鑫信托",
        ],
        "exclude_wechat_transfer": True,
    },
    "classifier": {
        "mode": "keyword",
        "api_key_env": "EXPENSE_LLM_API_KEY",
        "api_base": "https://api.openai.com/v1",
        "model": "gpt-4o-mini",
        "batch_size": 30,
        "timeout_seconds": 15,
    },
    "category_rules": {},
    "detail_show_all_categories": ["会员订阅", "通讯话费", "生活缴费", "其他"],
    "file_patterns": {
        "alipay": "支付宝交易明细*.csv",
        "wechat": "微信支付账单流水文件*.xlsx",
        "cmb": "招商银行交易流水*.pdf",
        "boc": "交易流水明细*.pdf",
    },
}


def load_config(path: Path | None) -> dict:
    cfg = json.loads(json.dumps(DEFAULT_CONFIG))
    if path and path.exists():
        user = json.loads(path.read_text(encoding="utf-8"))
        for k, v in user.items():
            if isinstance(v, dict) and isinstance(cfg.get(k), dict):
                cfg[k].update(v)
            else:
                cfg[k] = v
    return cfg


def default_config_path() -> Path:
    return Path(__file__).resolve().parent.parent / "expense_config.json"


def save_config(path: Path, cfg: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(cfg, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    tmp.replace(path)


def count_learned_keywords(cfg: dict) -> int:
    learned = cfg.get("_learned_keywords") or {}
    return sum(len(v) for v in learned.values() if isinstance(v, list))


def clear_learned_keywords(path: Path) -> int:
    """从 category_rules 移除 LLM 学到的关键词，不影响手工规则。"""
    from expense_core.categories import CATEGORY_NAMES

    cfg = load_config(path if path.exists() else None)
    learned: dict = cfg.get("_learned_keywords") or {}
    rules: dict[str, list[str]] = cfg.setdefault("category_rules", {})
    removed = 0
    for cat, kws in learned.items():
        if not isinstance(kws, list) or cat not in rules:
            continue
        bucket = rules[cat]
        for kw in kws:
            while kw in bucket:
                bucket.remove(kw)
                removed += 1
    cfg["category_rules"] = {k: list(rules.get(k, [])) for k in CATEGORY_NAMES}
    cfg["_learned_keywords"] = {k: [] for k in CATEGORY_NAMES}
    save_config(path, cfg)
    return removed
