from __future__ import annotations

import os
from pathlib import Path

from expense_core.classifiers.base import Classifier
from expense_core.classifiers.fallback import FallbackClassifier
from expense_core.classifiers.keyword import KeywordClassifier
from expense_core.classifiers.learn import LearningClassifier
from expense_core.classifiers.llm import LLMClassifier, build_system_prompt
from expense_core.config import DEFAULT_CONFIG, default_config_path


def _resolve_env_value(value: str) -> str:
    """展开 `$VAR` / `${VAR}`，引用不存在时保留原值。"""
    if not value or not value.startswith("$"):
        return value
    ref = value[1:]
    if ref.startswith("{") and ref.endswith("}"):
        ref = ref[1:-1]
    return os.environ.get(ref, value)


def create_classifier(cfg: dict, config_path: Path | None = None) -> Classifier:
    config_path = config_path or default_config_path()
    rules = cfg.get("category_rules", DEFAULT_CONFIG["category_rules"])
    keyword = KeywordClassifier(rules)

    clf_cfg = cfg.get("classifier") or {}
    mode = os.environ.get("EXPENSE_CLASSIFIER_MODE") or clf_cfg.get(
        "mode", "keyword"
    )

    if mode == "keyword":
        return keyword

    if mode == "learn":
        llm = _build_llm_classifier(clf_cfg)
        return LearningClassifier(cfg, config_path, keyword, llm)

    llm = _build_llm_classifier(clf_cfg)
    if mode == "llm":
        return llm
    if mode in ("llm_with_fallback", "fallback"):
        return FallbackClassifier(primary=llm, fallback=keyword)

    raise ValueError(
        f"未知 classifier.mode: {mode!r}，"
        "可选 keyword / learn / llm / llm_with_fallback"
    )


def _build_llm_classifier(clf_cfg: dict) -> LLMClassifier:
    key_env = clf_cfg.get("api_key_env", "EXPENSE_LLM_API_KEY")
    raw_key = os.environ.get(key_env) or clf_cfg.get("api_key", "")
    api_key = _resolve_env_value(raw_key)
    api_base = (
        os.environ.get("EXPENSE_LLM_API_BASE")
        or clf_cfg.get("api_base")
        or "https://api.openai.com/v1"
    )
    model = os.environ.get("EXPENSE_LLM_MODEL") or clf_cfg.get(
        "model", "gpt-4o-mini"
    )
    batch_size = int(clf_cfg.get("batch_size", 30))
    timeout = float(clf_cfg.get("timeout_seconds", 60))
    system_prompt = clf_cfg.get("system_prompt") or build_system_prompt()
    return LLMClassifier(
        api_key=api_key,
        api_base=api_base,
        model=model,
        batch_size=batch_size,
        timeout_seconds=timeout,
        system_prompt=system_prompt,
    )
