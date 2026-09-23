# FlowCanvas API — Bot 端点

本机 FastAPI 服务，供脚本 / Cursor Agent 通过路径分析流水并导出报告。

## 环境变量

| 变量 | 说明 |
|------|------|
| `EXPENSE_API_KEY` | 明文共享密钥；非空时 `/api/bot/v1/*` 要求请求头 `X-API-Key` |
| `EXPENSE_ALLOWED_ROOTS` | 逗号分隔的允许访问目录（默认项目根） |
| `EXPENSE_DEFAULT_CONFIG` | 默认 `expense_config.json` 路径 |

## 启动

```bash
EXPENSE_API_KEY=your-secret \
EXPENSE_ALLOWED_ROOTS="/Users/you/WorkSpace/记账" \
.venv/bin/uvicorn web_api.main:app --host 127.0.0.1 --port 8765
```

OpenAPI：`http://127.0.0.1:8765/docs`

完整 API 文档见 [`docs/API.md`](../docs/API.md)。

## Bot 端点

- `GET /api/bot/v1/health` — 健康检查
- `GET /api/bot/v1/files/discover?dir=...` — 发现目录内四源流水
- `POST /api/bot/v1/analyze` — 路径分析，返回 FullReport JSON
- `POST /api/bot/v1/export` — 分析并导出 JSON / Markdown / Canvas / 分类目录

前端上传分析仍使用 `POST /api/analyze`（无需 API Key）。
