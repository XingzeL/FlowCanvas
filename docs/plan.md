# FlowCanvas 分析增强功能开发计划

> 对应规格：`docs/spec.md`  
> 模式：Plan Mode → Build in Parallel  
> 策略：六个功能按依赖关系分组并行，共享代码最后合并

---

## 并行分组策略

| 组 | 功能 | 并行理由 | 预计改动文件 |
|----|------|----------|--------------|
| **Group A** | F4 平台占比 + F3 剔除明细 | 同为 P0，改动最小，可快速验证架构 | `stats.py`、`pipeline.py`、`insights/exclusions.py`、前端 2 组件 |
| **Group B** | F1 分类堆叠 + F2 消费日历 | 同为 P1，纯 stats 扩展，无 pipeline 改动 | `stats.py`、前端 2 组件 |
| **Group C** | F5 订阅识别 | P2，独立算法模块，不依赖其他组 | `insights/recurring.py`、前端 1 组件 |
| **Group D** | F6 跨期对比（一期纯前端） | P3，纯前端，零后端依赖 | 前端 1 组件 |

**执行顺序**：A、B、C、D 四组并行启动；A/B 先完成（改动小），C/D 后完成。

---

## Group A：平台占比 + 剔除明细（P0）

### A1 平台占比

**后端**
- `expense_core/stats.py` 新增：
  ```python
  def platform_breakdown(txns: list[Txn]) -> list[dict]:
      # 按 Txn.platform 分组，返回 [{platform, amount, count, pct}]
  ```

**前端**
- `components/charts/DonutChart.tsx`：Recharts PieChart，中心显示总额
- `components/insights/PlatformShareSection.tsx`：与 `meta.sources` 联动

**集成**
- `report.py` 的 `build_full_report` 返回 `"platformShare": platform_breakdown(kept)`

**测试**
- `test_stats_extensions.py`：断言分组正确、百分比和为 100

---

### A2 剔除项明细

**后端**
1. `pipeline.py` 修改 `apply_pure_filter`：
   - 返回 `(kept, excluded_with_reason)` 
   - `excluded` 每项附加 `reason: str`（`transfer` / `rent` / `non_spending` / `wechat_transfer`）
2. 新建 `expense_core/insights/exclusions.py`：
   ```python
   def build_excluded_detail(excluded: list[Txn]) -> dict:
       # 按 reason 分组，返回 {summary, groups}
   ```

**前端**
- `components/insights/ExcludedDetailSection.tsx`：汇总卡片 + 可展开分组表格

**集成**
- `report.py` 返回 `"excludedDetail": build_excluded_detail(excluded)`

**测试**
- `test_insights_exclusions.py`：断言 reason 分类正确、分组金额准确

---

## Group B：分类堆叠 + 消费日历（P1）

### B1 分类月度堆叠图

**后端**
- `stats.py` 新增：
  ```python
  def category_trend(period_payloads: list[dict]) -> dict:
      # 从 periods[].categories 转置为 {keys, series}
  ```

**前端**
- `components/charts/StackedBarChart.tsx`：Recharts BarChart + stackId
- `components/insights/CategoryStackSection.tsx`：绝对值/100% 切换

**集成**
- `report.py` 返回 `"categoryTrend": category_trend(period_payloads)`

---

### B2 消费日历热力图

**后端**
- `stats.py` 新增：
  ```python
  def daily_spending_map(txns: list[Txn]) -> dict:
      # 按 Txn.dt 聚合 {date: {amount, count}}，返回 {days, maxAmount}
  ```

**前端**
- `components/charts/HeatmapCalendar.tsx`：按月分块，CSS 色阶
- `components/insights/SpendingCalendarSection.tsx`：悬停 tooltip

**集成**
- `report.py` 返回 `"spendingCalendar": daily_spending_map(kept)`

---

## Group C：固定/订阅识别（P2）

**后端**
- 新建 `expense_core/insights/recurring.py`：
  ```python
  def detect_recurring(kept: list[Txn], label_map: dict, cfg: dict) -> list[dict]:
      # catalog_group_key 分组 → 检测 28-35 天间隔 + 金额波动 <10%
      # 返回 [{label, category, amount, cadence, annualEst, confidence, lastDate}]
  ```

**前端**
- `components/insights/RecurringSection.tsx`：表格 + 置信度标签 + 年化估算

**集成**
- `report.py` 返回 `"recurring": detect_recurring(kept, label_map, cfg)`

**测试**
- `test_insights_recurring.py`：同摘要、同金额、隔月等用例

---

## Group D：跨期对比（P3，一期纯前端）

**前端**
- `components/insights/PeriodCompareSection.tsx`：
  - 两个下拉选择器选区间 A/B
  - 用现有 `periods` 数据前端计算 diff
  - 对比表：指标 | 区间 A | 区间 B | 差额 | 变化率

**二期扩展**（可选）
- 后端 `insights/compare.py`：`compare_periods(a, b) -> dict`

---

## 共享代码合并点

所有组完成后，合并以下共享文件：

| 文件 | 合并内容 |
|------|----------|
| `report.py` | 六个新字段的组装 |
| `stats.py` | platform_breakdown + category_trend + daily_spending_map |
| `types.ts` | 六个新字段的 TypeScript 类型 |
| `App.tsx` | 六个 Section 的渲染 |
| `Sidebar.tsx` | 导航锚点 |

---

## 验证清单

每组完成后：
- [ ] `pytest expense_core/test_*.py` 通过
- [ ] `cd web_frontend && npm run build` 通过
- [ ] 前端手动验证对应区块渲染正常

合并后：
- [ ] 全部测试通过
- [ ] 前端构建无警告
- [ ] 手动上传流水验证六个区块同时正常

---

## 风险与回退

| 风险 | 应对 |
|------|------|
| pipeline.py 改动影响现有纯花销逻辑 | Group A 先单独验证，保留原 note 字段兼容 |
| 前端类型冲突 | 最后统一合并 types.ts |
| 订阅识别误报 | 置信度分级，用户可忽略 medium |

---

## 时间估算

| 组 | 预计耗时 |
|----|----------|
| Group A | 30 分钟 |
| Group B | 30 分钟 |
| Group C | 45 分钟 |
| Group D | 20 分钟 |
| 合并验证 | 15 分钟 |
| **总计** | **约 2 小时**（并行后实际约 45 分钟） |
