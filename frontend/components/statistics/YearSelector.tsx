"use client";

interface YearSelectorProps {
    year: number;
    availableYears: number[];
    onYearChange: (year: number) => void;
}

export default function YearSelector({ year, availableYears, onYearChange }: YearSelectorProps) {
    return (
        <select
            value={year}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="border rounded-lg px-3 py-1.5 text-sm bg-background"
        >
            {availableYears.map((y) => (
                <option key={y} value={y}>{y}</option>
            ))}
        </select>
    );
}
