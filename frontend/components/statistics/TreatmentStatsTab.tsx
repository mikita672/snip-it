"use client";

import { useState, useEffect, useMemo } from "react";
import { TreatmentStats } from "@/types/statistics/Statistics";
import MonthlyBarChart from "@/components/statistics/MonthlyBarChart";
import ChartModeToggle from "@/components/statistics/ChartModeToggle";
import YearSelector from "@/components/statistics/YearSelector";
import SortButton from "@/components/statistics/SortButton";

type ChartMode = "appointments" | "income";
type SortDir = "desc" | "asc";

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
    const [sortDir, setSortDir] = useState<SortDir>("desc");
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

    const sorted = useMemo(() => {
        return [...treatments].sort((a, b) => {
            if (sortDir === "desc") {
                return b.totalAppointments - a.totalAppointments;
            }
            return a.totalAppointments - b.totalAppointments;
        });
    }, [treatments, sortDir]);

    const selectedTreatment = useMemo(() => {
        if (selectedId === null) {
            return null;
        }
        return treatments.find((t) => t.treatmentId === selectedId) || null;
    }, [treatments, selectedId]);

    const toggleSort = () => {
        setSortDir((d) => {
            if (d === "desc") {
                return "asc";
            }
            return "desc";
        });
    };

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
                    <YearSelector
                        year={year}
                        availableYears={availableYears}
                        onYearChange={onYearChange}
                    />
                    <SortButton
                        label="Popularity"
                        sortDir={sortDir}
                        onToggle={toggleSort}
                    />
                </div>
            </div>

            {sorted.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">
                    No completed treatments in {year}.
                </p>
            ) : (
                <div className="flex flex-col gap-2 border rounded-xl p-2">
                    {sorted.map((treatment, index) => {
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
                        <ChartModeToggle mode={chartMode} onModeChange={setChartMode} />
                    </div>
                    <MonthlyBarChart
                        monthlyStats={selectedTreatment.monthlyStats}
                        mode={chartMode}
                        height={300}
                    />
                </div>
            )}
        </div>
    );
}
