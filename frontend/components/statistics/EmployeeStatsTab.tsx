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
import { EmployeeStats } from "@/types/statistics/Statistics";
import { Input } from "@/components/ui/input";

const MONTH_LABELS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

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

    const chartData = useMemo(() => {
        if (!selectedEmployee) {
            return [];
        }
        return selectedEmployee.monthlyStats.map((s) => ({
            name: MONTH_LABELS[s.month - 1],
            value: chartMode === "appointments" ? s.appointments : s.income,
        }));
    }, [selectedEmployee, chartMode]);

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

            <div className="flex items-center gap-3">
                <Input
                    placeholder="Search employees..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
                <button
                    onClick={() =>
                        setSortDir((d) => {
                            if (d === "desc") {
                                return "asc";
                            }
                            return "desc";
                        })
                    }
                    className="border rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors whitespace-nowrap"
                >
                    Avg. income {sortDir === "desc" ? "↓" : "↑"}
                </button>
            </div>

            {filtered.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">
                    No employees with completed appointments in {year}.
                </p>
            ) : (
                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto border rounded-xl p-2">
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
                        <div className="flex rounded-lg border overflow-hidden">
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
                                    fill="var(--chart-2)"
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
