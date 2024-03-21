"use client";

import type { Trend } from "../../types";

import React from "react";
import { useMediaQuery } from "@/hooks";
import { curveMonotoneX } from "@visx/curve";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleLinear, scaleTime } from "@visx/scale";
import { AreaClosed } from "@visx/shape";
import { motion } from "framer-motion";

interface ChartProps {
  width: number;
  data: Trend[];
}

const Chart: React.FC<ChartProps> = ({ width, data }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [height, setHeight] = React.useState(30);
  const [margin, setMargin] = React.useState({
    top: 5,
    right: -2,
    bottom: -2,
    left: -2,
  });

  const innerWidth = Math.max(width - margin.left - margin.right, 0);
  const innerHeight = Math.max(height - margin.top - margin.bottom, 0);

  const xScale = React.useMemo(() => {
    const min = Math.min(...data.map((h) => h.timestamp));
    const max = Math.max(...data.map((h) => h.timestamp));

    return scaleTime<number>({
      domain: [min, max],
    });
  }, [data]);

  const yScale = React.useMemo(() => {
    const min = Math.min(...data.map((h) => h.amount));
    const max = Math.max(...data.map((h) => h.amount));

    return scaleLinear<number>({
      domain: [min, max],
    });
  }, [data]);

  xScale.range([0, innerWidth]);
  yScale.range([innerHeight, 0]);

  React.useEffect(() => {
    setHeight(isMobile ? 30 : 50);
    setMargin((prev) => ({
      ...prev,
      top: isMobile ? 5 : 10,
    }));
  }, [isMobile]);

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <defs>
        <linearGradient id="trend-area-gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#16a34a" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="trend-line-gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#16a34a" stopOpacity={1} />
          <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
        </linearGradient>
      </defs>
      <Group left={margin.left} top={margin.top}>
        <AreaClosed
          curve={curveMonotoneX}
          data={data}
          x={(d) => xScale(d.timestamp)}
          y={(d) => yScale(d.amount)}
          yScale={yScale}
          strokeWidth={2}
          stroke="url(#trend-line-gradient)"
          fill="url(#trend-area-gradient)"
        />
      </Group>
    </motion.svg>
  );
};

export interface MetricTrendProps extends Omit<ChartProps, "width"> {}

const MetricTrend: React.FC<MetricTrendProps> = ({ ...props }) => {
  return (
    <ParentSize
      debounceTime={10}
      className="pointer-events-none absolute bottom-0 left-0 flex items-end overflow-hidden rounded-[inherit]"
    >
      {({ width }) => <Chart width={width} {...props} />}
    </ParentSize>
  );
};

export { MetricTrend };
