# FlowCanvas

四源流水（支付宝 / 微信 / 招行 / 中行）合并去重、纯花销过滤、分类分析与 Canvas 报表。

## 组件

| 目录 | 说明 |
|------|------|
| `expense_core/` | 解析、去重、统计、报表核心库 |
| `web_api/` | FastAPI 服务（网页上传 + Bot 路径 API） |
| `web_frontend/` | React 分析界面 |
| `build_expense_report.py` | 命令行生成 Canvas / Markdown |
| `docs/API.md` | HTTP API 文档 |

## 启动

```bash
# API（8765）
.venv/bin/uvicorn web_api.main:app --reload --port 8765

# 前端（5173，代理到 API）
cd web_frontend && npm run dev
```

Bot API 与鉴权说明见 [`web_api/README.md`](web_api/README.md)、[`docs/API.md`](docs/API.md)。
