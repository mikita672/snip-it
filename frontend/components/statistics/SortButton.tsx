"use client";

type SortDir = "desc" | "asc";

interface SortButtonProps {
    label: string;
    sortDir: SortDir;
    onToggle: () => void;
}

export default function SortButton({ label, sortDir, onToggle }: SortButtonProps) {
    return (
        <button
            onClick={onToggle}
            className="border rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted transition-colors whitespace-nowrap"
        >
            {label} {sortDir === "desc" ? "↓" : "↑"}
        </button>
    );
}
