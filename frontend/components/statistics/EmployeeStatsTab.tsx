"use client";

import { useState, useEffect, useMemo } from "react";
import { EmployeeStats } from "@/types/statistics/Statistics";
import { Input } from "@/components/ui/input";
import MonthlyBarChart from "@/components/statistics/MonthlyBarChart";
import ChartModeToggle from "@/components/statistics/ChartModeToggle";
import YearSelector from "@/components/statistics/YearSelector";
import SortButton from "@/components/statistics/SortButton";

type ChartMode = "appointments" | "income";
type SortDir = "desc" | "asc";

export default function EmployeeStatsTab({
    year,
    availableYears,
    onYearChange,
}: {
    year: number;
    availableYears: number[];
    onYearChange: (y: number) => void;
}) {
    const [employees, setEmployees] = useState<EmployeeStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortDir, setSortDir] = useState<SortDir>("desc");
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [chartMode, setChartMode] = useState<ChartMode>("income");

    useEffect(() => {
        setLoading(true);
        fetch(`/api/statistics/employees?year=${year}`)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                return null;
            })
            .then((data) => {
                if (data) {
                    setEmployees(data);
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [year]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        let list = employees.filter((e) =>
            e.employeeName.toLowerCase().includes(q)
        );

        list = [...list].sort((a, b) => {
            if (sortDir === "desc") {
                return b.averageMonthlyIncome - a.averageMonthlyIncome;
            }
            return a.averageMonthlyIncome - b.averageMonthlyIncome;
        });

        return list;
    }, [employees, search, sortDir]);

    const selectedEmployee = useMemo(() => {
        if (selectedId === null) {
            return null;
        }
        return employees.find((e) => e.employeeId === selectedId) || null;
    }, [employees, selectedId]);

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
                Loading employee statistics...
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                <h3 className="text-lg font-semibold">Employee Performance</h3>
                <YearSelector
                    year={year}
                    availableYears={availableYears}
                    onYearChange={onYearChange}
                />
            </div>

            <div className="flex items-center gap-3 w-full justify-between">
                <Input
                    placeholder="Search employees..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 border border-border"
                />
                <SortButton
                    label="Avg. income"
                    sortDir={sortDir}
                    onToggle={toggleSort}
                />
            </div>

            {filtered.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">
                    No employees with completed appointments in {year}.
                </p>
            ) : (
                <div className="flex flex-col gap-2 border rounded-xl p-2">
                    {filtered.map((emp) => {
                        const isSelected = selectedId === emp.employeeId;
                        return (
                            <button
                                key={emp.employeeId}
                                onClick={() => {
                                    if (isSelected) {
                                        setSelectedId(null);
                                    } else {
                                        setSelectedId(emp.employeeId);
                                    }
                                }}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                                    isSelected
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted"
                                }`}
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">
                                        {emp.employeeName}
                                    </span>
                                    <span
                                        className={`text-xs ${
                                            isSelected
                                                ? "text-primary-foreground/70"
                                                : "text-muted-foreground"
                                        }`}
                                    >
                                        {emp.totalAppointments} appointments
                                    </span>
                                </div>
                                <span className="font-semibold text-sm">
                                    ${emp.averageMonthlyIncome.toFixed(2)}/mo
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}

            {selectedEmployee && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium">
                            {selectedEmployee.employeeName}
                        </h4>
                        <ChartModeToggle mode={chartMode} onModeChange={setChartMode} />
                    </div>
                    <MonthlyBarChart
                        monthlyStats={selectedEmployee.monthlyStats}
                        mode={chartMode}
                        height={300}
                    />
                </div>
            )}
        </div>
    );
}
