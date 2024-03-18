"use client";

import type { Category, Expense } from "../../types";

import React from "react";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { BarStack } from "@visx/shape";
import { Text } from "@visx/text";

const query = "(max-width: 768px)";

const numberFormatter = new Intl.NumberFormat("ro-MD", {
  notation: "compact",
});

const dateFormatter = new Intl.DateTimeFormat("ro-MD", {
  month: "narrow",
});

const colors = {
  household: "#fd003a",
  transport: "#68d391",
  food: "#fe9923",
  utilities: "#1689fc",
  other: "#9f7aea",
};

interface VisualizationProps {
  width: number;
  data: Expense[];
}

const Visualization: React.FC<VisualizationProps> = ({ width, data }) => {
  const [height, setHeight] = React.useState(320);
  const [margin, setMargin] = React.useState({
    top: 15,
    right: 0,
    bottom: 25,
    left: 40,
  });

  const innerWidth = Math.max(width - margin.left - margin.right, 0);
  const innerHeight = Math.max(height - margin.top - margin.bottom, 0);

  const xScale = React.useMemo(() => {
    return scaleBand<number>({
      domain: data.map((d) => d.timestamp),
      padding: 0.2,
    });
  }, [data]);

  const yScale = React.useMemo(() => {
    return scaleLinear<number>({
      domain: [0, Math.max(...data.map((d) => d.total))],
      nice: true,
    });
  }, [data]);

  xScale.range([0, innerWidth]);
  yScale.range([innerHeight, 0]);

  const colorScale = React.useMemo(() => {
    return scaleOrdinal<Category, string>({
      domain: ["household", "transport", "food", "utilities", "other"],
      range: ["#f56565", "#68d391", "#ecc94b", "#4299e1", "#9f7aea"],
    });
  }, []);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    const onResize = () => {
      setHeight(media.matches ? 320 : 384);
      setMargin((prev) => ({
        ...prev,
        left: media.matches ? 40 : 45,
      }));
    };

    media.addEventListener("change", onResize);
    onResize();

    return () => {
      media.removeEventListener("change", onResize);
    };
  }, []);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Group left={margin.left} top={margin.top}>
        <Group className="bars">
          <BarStack<Expense, Category>
            data={data}
            keys={["household", "transport", "food", "utilities", "other"]}
            x={(d) => d.timestamp}
            xScale={xScale}
            yScale={yScale}
            color={colorScale}
          >
            {(barStacks) =>
              barStacks.map((barStack) =>
                barStack.bars.map((bar) => (
                  <rect
                    key={`bar-stack-${barStack.index}-${bar.index}`}
                    x={bar.x}
                    y={bar.y + 2}
                    height={Math.max(0, bar.height - 2)}
                    width={bar.width}
                    fill={colors[barStack.key]}
                    rx={2}
                    ry={2}
                  />
                ))
              )
            }
          </BarStack>
        </Group>

        <Group className="axes">
          <AxisBottom
            scale={xScale}
            top={innerHeight}
            axisLineClassName="stroke-muted-foreground"
            tickLineProps={{ className: "stroke-muted-foreground" }}
            tickFormat={(value) => dateFormatter.format(value.valueOf())}
            tickComponent={({ formattedValue, ...rest }) => (
              <Text
                {...rest}
                className="fill-muted-foreground font-sans text-xs font-medium md:text-sm"
              >
                {formattedValue}
              </Text>
            )}
          />
          <AxisLeft
            scale={yScale}
            axisLineClassName="stroke-muted-foreground"
            tickLineProps={{ className: "stroke-muted-foreground" }}
            tickFormat={(value) => numberFormatter.format(value.valueOf())}
            tickComponent={({ formattedValue, ...rest }) => (
              <Text
                {...rest}
                className="fill-muted-foreground font-sans text-xs font-medium md:text-sm"
              >
                {formattedValue}
              </Text>
            )}
          />
        </Group>
      </Group>
    </svg>
  );
};

export interface ExpensesChartProps extends Omit<VisualizationProps, "width"> {}

const ExpensesChart: React.FC<ExpensesChartProps> = (props) => {
  return (
    <ParentSize debounceTime={10}>
      {({ width }) => <Visualization width={width} {...props} />}
    </ParentSize>
  );
};

export { ExpensesChart };
