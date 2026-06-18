"use client";

type ChartMode = "appointments" | "income";

interface ChartModeToggleProps {
    mode: ChartMode;
    onModeChange: (mode: ChartMode) => void;
}

export default function ChartModeToggle({ mode, onModeChange }: ChartModeToggleProps) {
    return (
        <div className="flex rounded-lg border overflow-hidden">
            <button
                onClick={() => onModeChange("appointments")}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    mode === "appointments"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground"
                }`}
            >
                Appointments
            </button>
            <button
                onClick={() => onModeChange("income")}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    mode === "income"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground"
                }`}
            >
                Income
            </button>
        </div>
    );
}
