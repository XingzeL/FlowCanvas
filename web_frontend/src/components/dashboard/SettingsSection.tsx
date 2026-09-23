import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { clearLearnedKeywords, fetchLearnedKeywordCount } from "../../api";
import type { Granularity, ReportMeta } from "../../types";

type Props = {
  granularity: Granularity;
  pureSpending: boolean;
  largeThreshold: number;
  classifier?: ReportMeta["classifier"];
};

const GRANULARITY_LABELS: Record<Granularity, string> = {
  month: "月",
  week: "周",
  "3day": "3 天",
  day: "日",
};

const MODE_LABELS: Record<string, string> = {
  keyword: "仅关键词",
  learn: "学习模式",
  llm: "大模型",
  llm_with_fallback: "大模型（失败回退）",
  fallback: "大模型（失败回退）",
};

export function SettingsSection({
  granularity,
  pureSpending,
  largeThreshold,
  classifier,
}: Props) {
  const [learnedCount, setLearnedCount] = useState<number | null>(null);
  const [clearing, setClearing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const refreshLearnedCount = useCallback(async () => {
    try {
      const count = await fetchLearnedKeywordCount();
      setLearnedCount(count);
    } catch {
      setLearnedCount(null);
    }
  }, []);

  useEffect(() => {
    refreshLearnedCount();
  }, [refreshLearnedCount, classifier?.learned_added]);

  const onClearLearned = async () => {
    if (learnedCount === 0) return;
    const ok = window.confirm(
      `确定清除 ${learnedCount ?? 0} 条 LLM 学到的关键词？\n手工维护的规则不会被删除。`,
    );
    if (!ok) return;

    setClearing(true);
    setMessage(null);
    try {
      const removed = await clearLearnedKeywords();
      setLearnedCount(0);
      setMessage(removed > 0 ? `已清除 ${removed} 条已学关键词` : "没有可清除的已学关键词");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "清除失败");
    } finally {
      setClearing(false);
    }
  };

  return (
    <section className="section-block" id="settings">
      <h2 className="section-title">设置</h2>
      <div className="dash-card settings-card">
        <p className="settings-note">
          文件仅在内存中处理，分析完成后即释放，不会上传云端。
        </p>
        <dl className="settings-list">
          <div>
            <dt>默认小区间粒度</dt>
            <dd>{GRANULARITY_LABELS[granularity]}</dd>
          </div>
          <div>
            <dt>纯花销模式</dt>
            <dd>{pureSpending ? "开启" : "关闭"}</dd>
          </div>
          <div>
            <dt>大额阈值</dt>
            <dd>¥{largeThreshold.toLocaleString("zh-CN")}</dd>
          </div>
          {classifier && (
            <>
              <div>
                <dt>分类模式</dt>
                <dd>{MODE_LABELS[classifier.mode] ?? classifier.mode}</dd>
              </div>
              <div>
                <dt>上次新学关键词</dt>
                <dd>{classifier.learned_added} 条</dd>
              </div>
            </>
          )}
          <div>
            <dt>已学关键词累计</dt>
            <dd>{learnedCount == null ? "—" : `${learnedCount} 条`}</dd>
          </div>
        </dl>

        <div className="settings-actions">
          <button
            type="button"
            className="btn-secondary"
            disabled={clearing || learnedCount === 0}
            onClick={onClearLearned}
          >
            <Trash2 size={15} />
            {clearing ? "清除中…" : "一键清除已学关键词"}
          </button>
        </div>
        {message && <p className="settings-message">{message}</p>}

        <p className="settings-hint muted">
          以上参数会自动保存到本机浏览器，下次打开时自动填充。已学关键词保存在本机
          expense_config.json，清除后下次分析会重新调用 LLM 学习。
        </p>
      </div>
    </section>
  );
}
