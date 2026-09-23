# FlowCanvas API 文档

FlowCanvas API 提供两类接口：

- **Bot API**（`/api/bot/v1/*`）：供脚本、Cursor Agent 等自动化调用，通过**本机路径**读取流水、分析并导出报告。
- **Legacy API**（`/api/*`）：供 React 网页前端使用，通过 **multipart 上传**流水文件。

默认服务地址：`http://127.0.0.1:8765`

交互式 OpenAPI：`http://127.0.0.1:8765/docs`

---

## 目录

1. [快速开始](#快速开始)
2. [鉴权与安全](#鉴权与安全)
3. [错误码](#错误码)
4. [Bot API](#bot-api)
5. [Legacy API（网页）](#legacy-api网页)
6. [FullReport 数据结构](#fullreport-数据结构)
7. [调用示例](#调用示例)

---

## 快速开始

### 启动服务

```bash
cd /path/to/FlowCanvas

EXPENSE_API_KEY=your-secret \
EXPENSE_ALLOWED_ROOTS="/Users/you/WorkSpace/记账" \
.venv/bin/uvicorn web_api.main:app --host 127.0.0.1 --port 8765
```

### 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `EXPENSE_API_KEY` | 空 | 明文共享密钥。非空时 Bot 路由要求请求头 `X-API-Key` |
| `EXPENSE_ALLOWED_ROOTS` | 项目根目录 | 逗号分隔的绝对路径列表；Bot 请求的目录/文件/输出路径必须落在其中 |
| `EXPENSE_DEFAULT_CONFIG` | `expense_config.json` | 默认分类与过滤规则配置文件路径 |

`.env.example` 中提供了占位模板，请勿将真实 Key 提交到 git。

---

## 鉴权与安全

### Bot API 鉴权

| 条件 | 行为 |
|------|------|
| 未设置 `EXPENSE_API_KEY` | 本机开发模式，Bot 路由**不校验** Key |
| 已设置 `EXPENSE_API_KEY` | 所有 `/api/bot/v1/*` 请求必须携带请求头：`X-API-Key: <密钥>` |

Key 由管理员自行生成（例如 `openssl rand -hex 32`），服务端以**明文**保存在环境变量中，使用 `secrets.compare_digest` 比对。

Legacy 路由（`/api/analyze` 等）**不需要** API Key。

### 路径沙箱

Bot 请求中的以下字段均会校验是否落在 `EXPENSE_ALLOWED_ROOTS` 内：

- `dirs` / `extra_dirs`
- `files.*`（显式文件路径）
- `output_dir`（导出写盘目录）
- `config_path`（自定义配置）

越界返回 **403**，目录/文件不存在返回 **404**。

---

## 错误码

| HTTP 状态码 | 场景 |
|-------------|------|
| 400 | 参数无效、无法推断日期、解析后无交易、`formats` 为空等 |
| 403 | API Key 缺失/错误、路径不在允许范围内 |
| 404 | 目录或文件不存在 |
| 422 | JSON 请求体校验失败（FastAPI 默认） |
| 500 | 未预期服务端错误 |

错误响应体示例：

```json
{ "detail": "路径不在允许范围内" }
```

---

## Bot API

统一前缀：`/api/bot/v1`

除另有说明外，请求 `Content-Type: application/json`，响应 `Content-Type: application/json`。

---

### GET `/api/bot/v1/health`

健康检查，无需请求体。

**响应**

```json
{
  "status": "ok",
  "version": "1.0.0",
  "allowed_roots_count": 1,
  "api_key_required": true
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `status` | string | 固定 `"ok"` |
| `version` | string | API 版本 |
| `allowed_roots_count` | int | 已配置的路径沙箱根目录数量 |
| `api_key_required` | bool | 当前是否启用了 API Key 校验 |

---

### GET `/api/bot/v1/files/discover`

扫描指定目录，按 `expense_config.json` 中的 `file_patterns` 发现四源流水文件。

**Query 参数**

| 参数 | 必填 | 说明 |
|------|------|------|
| `dir` | 是 | 流水目录绝对路径 |
| `config_path` | 否 | 自定义配置文件绝对路径 |

**响应**

各解析器 ID 为键，值为文件信息或 `null`：

```json
{
  "alipay": {
    "id": "alipay",
    "path": "/Users/.../支付宝交易明细(20250801-20260731).csv",
    "filename": "支付宝交易明细(20250801-20260731).csv",
    "mtime": 1754035200.0
  },
  "wechat": { "...": "..." },
  "cmb": null,
  "boc": { "...": "..." }
}
```

**支持的解析器 ID**

| ID | 说明 | 默认文件名模式 |
|----|------|----------------|
| `alipay` | 支付宝 CSV | `支付宝交易明细*.csv` |
| `wechat` | 微信 XLSX | `微信支付账单流水文件*.xlsx` |
| `cmb` | 招行 PDF | `招商银行交易流水*.pdf` |
| `boc` | 中行 PDF | `交易流水明细*.pdf` |

---

### POST `/api/bot/v1/analyze`

读取本地流水目录，去重、过滤、分类后返回 **FullReport JSON**。

**请求体**

```json
{
  "dirs": ["/Users/you/WorkSpace/记账/FlowCanvas"],
  "extra_dirs": ["/Users/you/WorkSpace/记账/202608"],
  "files": {
    "wechat": "/optional/explicit/path.xlsx"
  },
  "mode": "range",
  "month": null,
  "date_start": "2025-08-01",
  "date_end": "2026-07-31",
  "granularity": "month",
  "pure_spending": true,
  "large_threshold": 500,
  "config_path": null
}
```

**字段说明**

| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `dirs` | string[] | — | 主数据目录列表（至少 1 个） |
| `extra_dirs` | string[] | `[]` | 续期/额外目录，与主目录合并去重 |
| `files` | object | `{}` | 显式覆盖某源文件路径，键为解析器 ID |
| `mode` | string | `"range"` | 分析模式，见下表 |
| `month` | string | null | `mode=month` 时必填，格式 `YYYY-MM` |
| `date_start` | string | null | 起始日 `YYYY-MM-DD` |
| `date_end` | string | null | 结束日 `YYYY-MM-DD` |
| `granularity` | string | `"month"` | 小区间粒度：`day` / `3day` / `week` / `month` |
| `pure_spending` | bool | `true` | 是否启用纯花销过滤（剔除转账/房租等） |
| `large_threshold` | number | `500` | 大额交易阈值（元） |
| `config_path` | string | null | 自定义 `expense_config.json` 路径 |

**mode 取值**

| 值 | 说明 |
|----|------|
| `month` | 单月统计，需 `month=YYYY-MM` |
| `range` | 自定义区间；若未指定日期则从文件名推断 |
| `all` | 全账单区间（类似 CLI `--all`），适合全年 Canvas 导出 |

**响应**

```json
{
  "report": { "...": "FullReport，见下文" },
  "inputs": {
    "date_start": "2025-08-01",
    "date_end": "2026-07-31",
    "label": "2025.08–2026.07",
    "sources": {
      "alipay": {
        "parsed": 820,
        "skipped": false,
        "error": null,
        "path": "/Users/.../支付宝交易明细(...).csv",
        "filename": "支付宝交易明细(...).csv"
      }
    }
  }
}
```

---

### POST `/api/bot/v1/export`

在 `analyze` 基础上，额外导出 JSON / Markdown / Canvas / 分类目录。

**请求体**

在 [analyze 请求体](#post-apibotv1analyze) 基础上增加：

```json
{
  "dirs": ["/Users/you/WorkSpace/记账/FlowCanvas"],
  "mode": "all",
  "formats": ["json", "markdown", "canvas", "catalog"],
  "canvas_mode": "year",
  "inline": true,
  "output_dir": "/Users/you/WorkSpace/记账/FlowCanvas",
  "output_names": {
    "json": "report.json",
    "markdown": "summary.md",
    "canvas": "expense-year-breakdown.canvas.tsx",
    "catalog": "category-catalog.md"
  }
}
```

**额外字段说明**

| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `formats` | string[] | `["json"]` | 导出格式：`json` / `markdown` / `canvas` / `catalog` |
| `canvas_mode` | string | `"year"` | Canvas 模板：`year`（全年）或 `month`（单月） |
| `inline` | bool | `true` | 是否在响应中内联返回文件内容 |
| `output_dir` | string | null | 写盘目录；`inline=false` 时**必填** |
| `output_names` | object | 见默认文件名 | 各格式输出文件名 |

**导出行为**

| `inline` | `output_dir` | 结果 |
|----------|--------------|------|
| `true` | 空 | 仅 `artifacts.inline` 返回文本内容 |
| `false` | 有 | 仅 `artifacts.written` 返回绝对路径 |
| `true` | 有 | 内联 + 写盘同时执行 |

**注意**：当 `mode` 不是 `all` 且导出 `canvas` 时，会自动使用单月 Canvas 模板。

**响应**

```json
{
  "summary": {
    "txn_count": 1336,
    "total": 134742.0,
    "date_range": "2025-08-01 ~ 2026-07-31",
    "label": "2025.08–2026.07"
  },
  "report": { "...": "仅当 formats 含 json 时返回 FullReport" },
  "inputs": { "...": "同 analyze" },
  "artifacts": {
    "inline": {
      "markdown": "# 2025.08–2026.07 ...",
      "canvas": "export default function ..."
    },
    "written": {
      "json": "/Users/.../report.json",
      "canvas": "/Users/.../expense-year-breakdown.canvas.tsx"
    }
  }
}
```

Canvas 文件可能较大（数 MB），生产环境建议 `inline=false` 并指定 `output_dir` 写盘。

---

## Legacy API（网页）

供 `web_frontend` 使用，**无需 API Key**。

---

### GET `/api/parsers`

返回已注册的流水解析器列表。

**响应示例**

```json
[
  {
    "id": "alipay",
    "displayName": "支付宝",
    "role": "primary",
    "filePatterns": ["支付宝交易明细*.csv"]
  }
]
```

---

### GET `/api/config/default`

返回默认 `expense_config.json` 内容（分类规则、过滤关键词、文件匹配模式等）。

---

### POST `/api/analyze`

通过 **multipart/form-data** 上传流水并分析。

**Form 字段**

| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `granularity` | string | `month` | `day` / `3day` / `week` / `month` |
| `pure_spending` | bool | `true` | 纯花销模式 |
| `large_threshold` | number | `500` | 大额阈值 |
| `date_start` | string | null | `YYYY-MM-DD` |
| `date_end` | string | null | `YYYY-MM-DD` |
| `config` | string | null | 内联 JSON 配置（覆盖默认） |
| `alipay` | file | null | 支付宝 CSV |
| `wechat` | file | null | 微信 XLSX |
| `cmb` | file | null | 招行 PDF |
| `boc` | file | null | 中行 PDF |

至少上传一个文件。响应为 **FullReport** 对象（与 Bot analyze 的 `report` 字段结构相同，但无 `inputs` 包装）。

---

## FullReport 数据结构

Bot `analyze` 的 `report` 字段与 Legacy `POST /api/analyze` 响应体结构一致。

```typescript
{
  meta: {
    dateStart: string;       // "2025-08-01"
    dateEnd: string;
    title: string;
    subtitle: string;
    dateRange: string;
    txnCount: number;
    total: number;
    periodAvg: number;
    maxPeriodTotal: number;
    maxPeriodLabel: string;
    top2Pct: number;
    top2Label: string;
    periodCount: number;
    largeTxnCount: number;
    largeTxnTotal: number;
    largeThreshold: number;
    granularity: string;
    pureSpending: boolean;   // 是否开启纯花销过滤
    trends: {
      totalPct: number | null;  // 较上一区间总支出变化 %
      countPct: number | null;  // 较上一区间笔数变化 %
      label: string | null;     // 上一区间 key
    };
    sources: Record<string, { parsed: number; skipped: boolean; error?: string }>;
  };
  periodTotals: {
    key: string;
    label: string;
    total: number;       // 纯花销金额（与 totalPure 相同）
    count: number;       // 纯花销笔数（与 countPure 相同）
    totalPure: number;
    countPure: number;
    totalAll: number;    // kept + excluded 金额
    countAll: number;
    purePct: number | null;
  }[];
  categories: { name: string; amount: number; pct: number; count: number }[];
  amountBuckets: { label: string; count: number; amount: number }[];
  amountBucketsMerged: { label: string; count: number; amount: number }[];
  bucketCategories: BucketCategory[];
  bucketCategoriesMerged: BucketCategory[];
  largeTxns: {
    date: string;
    amount: number;
    category: string;
    platform: string;
    label: string;
  }[];
  periods: PeriodPayload[];  // 按 granularity 切分的小区间的完整子报表
}

// PeriodPayload 额外字段（相对旧版）
type PeriodPayload = {
  // ...原有字段...
  grossTotal: number;      // 该段 kept + excluded 金额
  countAll: number;
  purePct: number | null;  // 纯花销占比
};
```

---

## 调用示例

### curl — 发现文件

```bash
curl -H "X-API-Key: your-secret" \
  "http://127.0.0.1:8765/api/bot/v1/files/discover?dir=/Users/you/WorkSpace/记账/FlowCanvas"
```

### curl — 路径分析

```bash
curl -X POST \
  -H "X-API-Key: your-secret" \
  -H "Content-Type: application/json" \
  -d '{
    "dirs": ["/Users/you/WorkSpace/记账/FlowCanvas"],
    "mode": "range",
    "date_start": "2025-08-01",
    "date_end": "2026-07-31",
    "granularity": "month"
  }' \
  http://127.0.0.1:8765/api/bot/v1/analyze
```

### curl — 全年导出 Canvas 到磁盘

```bash
curl -X POST \
  -H "X-API-Key: your-secret" \
  -H "Content-Type: application/json" \
  -d '{
    "dirs": ["/Users/you/WorkSpace/记账/FlowCanvas"],
    "extra_dirs": ["/Users/you/WorkSpace/记账/202608"],
    "mode": "all",
    "formats": ["json", "canvas"],
    "canvas_mode": "year",
    "inline": false,
    "output_dir": "/Users/you/WorkSpace/记账/FlowCanvas"
  }' \
  http://127.0.0.1:8765/api/bot/v1/export
```

### Python — Bot 客户端

```python
import requests

BASE = "http://127.0.0.1:8765"
HEADERS = {"X-API-Key": "your-secret", "Content-Type": "application/json"}
DATA_DIR = "/Users/you/WorkSpace/记账/FlowCanvas"

# 分析
r = requests.post(
    f"{BASE}/api/bot/v1/analyze",
    headers=HEADERS,
    json={
        "dirs": [DATA_DIR],
        "mode": "range",
        "date_start": "2025-08-01",
        "date_end": "2026-07-31",
    },
    timeout=120,
)
r.raise_for_status()
report = r.json()["report"]
print(report["meta"]["txnCount"], report["meta"]["total"])

# 导出 Markdown（内联）
r = requests.post(
    f"{BASE}/api/bot/v1/export",
    headers=HEADERS,
    json={
        "dirs": [DATA_DIR],
        "mode": "all",
        "formats": ["markdown"],
        "inline": True,
    },
    timeout=120,
)
md = r.json()["artifacts"]["inline"]["markdown"]
```

### curl — 网页上传（Legacy）

```bash
curl -X POST http://127.0.0.1:8765/api/analyze \
  -F "granularity=month" \
  -F "pure_spending=true" \
  -F "alipay=@支付宝交易明细(20250801-20260731).csv"
```

---

## 相关文件

| 路径 | 说明 |
|------|------|
| `web_api/main.py` | FastAPI 入口 |
| `web_api/routes/bot_v1.py` | Bot 路由 |
| `web_api/routes/legacy.py` | 网页路由 |
| `expense_core/runner.py` | 目录分析 / 导出核心逻辑 |
| `expense_config.json` | 分类与过滤规则 |
| `build_expense_report.py` | 命令行等价工具 |

---

## 版本

- API 版本：`1.0.0`
- 文档更新：与 Bot 对外服务 API 实现同步
