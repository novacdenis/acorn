import type { Trend } from "../../types";

import { cn, formatNumber } from "@/utils";

import { MetricTrend } from "./metric-trend";
import styles from "./metric.module.css";

export interface MetricProps {
  title: string;
  value: number;
  delta: number;
  deltaSign: "negative" | "positive";
  trend: Trend[];
}

export const Metric: React.FC<MetricProps> = ({ title, value, delta, deltaSign, trend }) => {
  return (
    <div
      className={cn(
        "relative grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-1 rounded-2xl border bg-white dark:bg-black",
        "border-primary/10 px-4 py-4 pb-7 shadow-sm md:gap-y-2 md:px-5 md:py-5 md:pb-12",
        styles.area
      )}
    >
      <h3
        className="text-sm font-medium text-primary/90 md:text-base"
        style={{ gridArea: "title" }}
      >
        {title}
      </h3>
      <h4 className="text-xl font-bold text-primary md:text-2xl" style={{ gridArea: "value" }}>
        {formatNumber(value, { decimals: 0 })} MDL
      </h4>
      <p
        className={cn(
          "inline-flex h-6 items-center justify-self-start rounded-full px-1.5 md:h-8 md:px-2.5",
          {
            "bg-green-600/20 text-green-600": deltaSign === "positive",
            "bg-orange-600/20 text-orange-600": deltaSign === "negative",
          }
        )}
        style={{ gridArea: "delta" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-hidden="true"
          focusable="false"
          className={cn("size-3.5 md:size-4", {
            "rotate-180": deltaSign === "negative",
          })}
          viewBox="0 0 384 512"
        >
          <path
            fill="currentColor"
            d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
          />
        </svg>
        <span className="ml-1 text-sm font-semibold md:text-base">
          {formatNumber(delta, { decimals: 2 })} %
        </span>
      </p>
      <MetricTrend data={trend} />
    </div>
  );
};
