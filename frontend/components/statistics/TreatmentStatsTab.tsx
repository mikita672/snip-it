"use client";

import { useState, useEffect, useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { TreatmentStats } from "@/types/statistics/Statistics";

const MONTH_LABELS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

type ChartMode = "appointments" | "income";

export default function TreatmentStatsTab({
    year,
    availableYears,
    onYearChange,
}: {
    year: number;
    availableYears: number[];
    onYearChange: (y: number) => void;
}) {
    const [treatments, setTreatments] = useState<TreatmentStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [chartMode, setChartMode] = useState<ChartMode>("appointments");

    useEffect(() => {
        setLoading(true);
        fetch(`/api/statistics/treatments?year=${year}`)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                return null;
            })
            .then((data) => {
                if (data) {
                    setTreatments(data);
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [year]);

    const selectedTreatment = useMemo(() => {
        if (selectedId === null) {
            return null;
        }
        return treatments.find((t) => t.treatmentId === selectedId) || null;
    }, [treatments, selectedId]);

    const chartData = useMemo(() => {
        if (!selectedTreatment) {
            return [];
        }
        return selectedTreatment.monthlyStats.map((s) => ({
            name: MONTH_LABELS[s.month - 1],
            value: chartMode === "appointments" ? s.appointments : s.income,
        }));
    }, [selectedTreatment, chartMode]);

    if (loading) {
        return (
            <p className="text-center text-muted-foreground py-10">
                Loading treatment statistics...
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                <h3 className="text-lg font-semibold">Popular Treatments</h3>
                <div className="flex items-center gap-3">
                    <select
                        value={year}
                        onChange={(e) => onYearChange(Number(e.target.value))}
                        className="border rounded-lg px-3 py-1.5 text-sm bg-background"
                    >
                        {availableYears.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </div>

            {treatments.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">
                    No completed treatments in {year}.
                </p>
            ) : (
                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto border rounded-xl p-2">
                    {treatments.map((treatment, index) => {
                        const isSelected = selectedId === treatment.treatmentId;
                        return (
                            <button
                                key={treatment.treatmentId}
                                onClick={() => {
                                    if (isSelected) {
                                        setSelectedId(null);
                                    } else {
                                        setSelectedId(treatment.treatmentId);
                                    }
                                }}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                                    isSelected
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                                            isSelected
                                                ? "bg-primary-foreground/20 text-primary-foreground"
                                                : "bg-muted text-muted-foreground"
                                        }`}
                                    >
                                        {index + 1}
                                    </span>
                                    <span className="font-medium text-sm">
                                        {treatment.treatmentName}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="font-semibold text-sm">
                                        {treatment.totalAppointments} appt.
                                    </span>
                                    <span
                                        className={`text-xs ${
                                            isSelected
                                                ? "text-primary-foreground/70"
                                                : "text-muted-foreground"
                                        }`}
                                    >
                                        ${treatment.totalIncome.toFixed(2)}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {selectedTreatment && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium">
                            {selectedTreatment.treatmentName}
                        </h4>
                        <div className="flex rounded-lg border overflow-hidden">
                            <button
                                onClick={() => setChartMode("appointments")}
                                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                                    chartMode === "appointments"
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted text-muted-foreground"
                                }`}
                            >
                                Appointments
                            </button>
                            <button
                                onClick={() => setChartMode("income")}
                                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                                    chartMode === "income"
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted text-muted-foreground"
                                }`}
                            >
                                Income
                            </button>
                        </div>
                    </div>

                    <div className="w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="var(--border)"
                                />
                                <XAxis
                                    dataKey="name"
                                    tick={{
                                        fontSize: 12,
                                        fill: "var(--muted-foreground)",
                                    }}
                                />
                                <YAxis
                                    tick={{
                                        fontSize: 12,
                                        fill: "var(--muted-foreground)",
                                    }}
                                    allowDecimals={chartMode === "income"}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "var(--popover)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "8px",
                                        color: "var(--foreground)",
                                    }}
                                    formatter={(value) => {
                                        if (chartMode === "income") {
                                            return [
                                                `$${Number(value).toFixed(2)}`,
                                                "Income",
                                            ];
                                        }
                                        return [String(value), "Appointments"];
                                    }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill="var(--chart-3)"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}
