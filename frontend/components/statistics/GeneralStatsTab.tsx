"use client";

import { useState, useEffect } from "react";
import { GeneralStats } from "@/types/statistics/Statistics";
import MonthlyBarChart from "@/components/statistics/MonthlyBarChart";
import ChartModeToggle from "@/components/statistics/ChartModeToggle";
import YearSelector from "@/components/statistics/YearSelector";

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

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                <h3 className="text-lg font-semibold">General Overview</h3>
                <div className="flex items-center gap-3">
                    <YearSelector
                        year={year}
                        availableYears={stats.availableYears}
                        onYearChange={setYear}
                    />
                    <ChartModeToggle mode={mode} onModeChange={setMode} />
                </div>
            </div>

            <MonthlyBarChart monthlyStats={stats.monthlyStats} mode={mode} />

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
