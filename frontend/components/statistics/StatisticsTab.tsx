"use client";

import { useState, useEffect } from "react";
import GeneralStatsTab from "@/components/statistics/GeneralStatsTab";
import EmployeeStatsTab from "@/components/statistics/EmployeeStatsTab";
import TreatmentStatsTab from "@/components/statistics/TreatmentStatsTab";

type StatsSection = "general" | "employees" | "treatments";

export default function StatisticsTab() {
    const [selectedSection, setSelectedSection] = useState<StatsSection>("general");
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [availableYears, setAvailableYears] = useState<number[]>([]);

    useEffect(() => {
        fetch(`/api/statistics/general?year=${year}`)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                return null;
            })
            .then((data) => {
                if (data) {
                    setAvailableYears(data.availableYears);
                }
            })
            .catch(() => {});
    }, []);

    const menuItems: { id: StatsSection; label: string }[] = [
        { id: "general", label: "General" },
        { id: "employees", label: "Employees" },
        { id: "treatments", label: "Treatments" },
    ];

    return (
        <div className="flex flex-col md:flex-row gap-6 min-h-[400px] border rounded-xl p-6 bg-card">
            <aside className="w-full md:w-56 flex flex-row md:flex-col gap-2 border-b md:border-b-0 md:border-r pb-4 md:pb-0 md:pr-6 border-muted">
                {menuItems.map((item) => {
                    const isActive = selectedSection === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setSelectedSection(item.id)}
                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </aside>

            <main className="flex-1 min-w-0 py-2 md:py-0">
                {selectedSection === "general" && <GeneralStatsTab />}
                {selectedSection === "employees" && (
                    <EmployeeStatsTab
                        year={year}
                        availableYears={availableYears}
                        onYearChange={setYear}
                    />
                )}
                {selectedSection === "treatments" && (
                    <TreatmentStatsTab
                        year={year}
                        availableYears={availableYears}
                        onYearChange={setYear}
                    />
                )}
            </main>
        </div>
    );
}
