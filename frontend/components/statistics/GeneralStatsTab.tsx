"use client";

import { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { GeneralStats } from "@/types/statistics/Statistics";

const MONTH_LABELS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

type ChartMode = "appointments" | "income";

export default function GeneralStatsTab() {
    const [stats, setStats] = useState<GeneralStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [mode, setMode] = useState<ChartMode>("appointments");

    useEffect(() => {
        setLoading(true);
        fetch(`/api/statistics/general?year=${year}`)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                return null;
            })
            .then((data) => {
                if (data) {
                    setStats(data);
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [year]);

    if (loading) {
        return (
            <p className="text-center text-muted-foreground py-10">
                Loading statistics...
            </p>
        );
    }

    if (!stats) {
        return (
            <p className="text-center text-destructive font-medium py-10">
                Failed to load statistics.
            </p>
        );
    }

    const chartData = stats.monthlyStats.map((s) => ({
        name: MONTH_LABELS[s.month - 1],
        value: mode === "appointments" ? s.appointments : s.income,
    }));

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                <h3 className="text-lg font-semibold">General Overview</h3>
                <div className="flex items-center gap-3">
                    <select
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="border rounded-lg px-3 py-1.5 text-sm bg-background"
                    >
                        {stats.availableYears.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                    <div className="flex rounded-lg border overflow-hidden">
                        <button
                            onClick={() => setMode("appointments")}
                            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                                mode === "appointments"
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted text-muted-foreground"
                            }`}
                        >
                            Appointments
                        </button>
                        <button
                            onClick={() => setMode("income")}
                            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                                mode === "income"
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted text-muted-foreground"
                            }`}
                        >
                            Income
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                        />
                        <YAxis
                            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                            allowDecimals={mode === "income"}
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                        Average monthly income
                    </span>
                    <span className="text-xl font-semibold">
                        ${stats.averageMonthlyIncome.toFixed(2)}
                    </span>
                </div>
                <div className="border rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                        Total income ({year})
                    </span>
                    <span className="text-xl font-semibold">
                        ${stats.totalIncome.toFixed(2)}
                    </span>
                </div>
                <div className="border rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                        Total appointments ({year})
                    </span>
                    <span className="text-xl font-semibold">
                        {stats.totalAppointments}
                    </span>
                </div>
            </div>
        </div>
    );
}
