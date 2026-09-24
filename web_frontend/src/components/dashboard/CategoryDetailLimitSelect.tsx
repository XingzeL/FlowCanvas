import {
  CATEGORY_DETAIL_LIMIT_OPTIONS,
  type CategoryDetailLimit,
} from "../../utils/categoryDetailLimit";

type Props = {
  value: CategoryDetailLimit;
  onChange: (value: CategoryDetailLimit) => void;
};

export function CategoryDetailLimitSelect({ value, onChange }: Props) {
  return (
    <label className="toolbar-field category-detail-limit">
      <span>每类显示</span>
      <select
        value={String(value)}
        onChange={(e) =>
          onChange(
            e.target.value === "all"
              ? "all"
              : (Number(e.target.value) as CategoryDetailLimit),
          )
        }
      >
        {CATEGORY_DETAIL_LIMIT_OPTIONS.map((opt) => (
          <option key={String(opt.value)} value={String(opt.value)}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
