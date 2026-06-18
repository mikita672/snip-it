"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { MonthlyStat } from "@/types/statistics/Statistics";

const MONTH_LABELS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

type ChartMode = "appointments" | "income";

interface MonthlyBarChartProps {
    monthlyStats: MonthlyStat[];
    mode: ChartMode;
    height?: number;
}

export default function MonthlyBarChart({
    monthlyStats,
    mode,
    height = 350,
}: MonthlyBarChartProps) {
    const chartData = monthlyStats.map((s) => ({
        name: MONTH_LABELS[s.month - 1],
        value: mode === "appointments" ? s.appointments : s.income,
    }));

    return (
        <div className="w-full" style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                        label={{ value: "Month", position: "insideBottom", offset: -15, fontSize: 12, fill: "var(--muted-foreground)" }}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                        allowDecimals={mode === "income"}
                        label={{ value: mode === "income" ? "Income ($)" : "Appointments", angle: -90, position: "insideLeft", offset: -10, fontSize: 12, fill: "var(--muted-foreground)" }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "var(--popover)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            color: "var(--foreground)",
                        }}
                        formatter={(value) => {
                            if (mode === "income") {
                                return [`$${Number(value).toFixed(2)}`, "Income"];
                            }
                            return [String(value), "Appointments"];
                        }}
                    />
                    <Bar
                        dataKey="value"
                        fill="var(--chart-1)"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
