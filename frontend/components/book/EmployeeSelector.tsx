'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeftIcon } from 'lucide-react'

export interface AvailableEmployee {
    id: number
    firstName: string
    lastName: string
    position: string
}

interface Props {
    treatmentIds: number[]
    selectedTime: string
    onSelect: (employee: AvailableEmployee) => void
    onBack: () => void
}

export default function EmployeeSelector({ treatmentIds, selectedTime, onSelect, onBack }: Props) {
    const [employees, setEmployees] = useState<AvailableEmployee[]>([])
    const [selected, setSelected] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const params = new URLSearchParams()
        treatmentIds.forEach(id => params.append('treatmentIds', String(id)))
        params.set('dateTime', selectedTime)

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/availability/employees?${params.toString()}`)
            .then(res => {
                if (!res.ok) throw new Error()
                return res.json() as Promise<AvailableEmployee[]>
            })
            .then(data => setEmployees(data))
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }, [])

    function handleSelect(employee: AvailableEmployee) {
        setSelected(employee.id)
        onSelect(employee)
    }

    return (
        <div className="flex flex-col gap-6">
            <button
                onClick={onBack}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
            >
                <ChevronLeftIcon size={16} /> Back to time selection
            </button>

            <div>
                <p className="text-sm font-medium">Select a specialist</p>
                <p className="text-xs text-muted-foreground mt-1">All shown specialists are available at your chosen time</p>
            </div>

            {loading && <p className="text-sm text-muted-foreground">Loading available specialists…</p>}
            {error && <p className="text-sm text-destructive">Failed to load specialists.</p>}
            {!loading && !error && employees.length === 0 && (
                <p className="text-sm text-muted-foreground">No specialists available at this time.</p>
            )}

            {!loading && !error && employees.length > 0 && (
                <div className="flex flex-col gap-3">
                    {employees.map(employee => (
                        <button
                            key={employee.id}
                            onClick={() => handleSelect(employee)}
                            className={cn(
                                'flex flex-col items-start gap-1 rounded-xl border px-4 py-3 text-left transition-colors',
                                selected === employee.id
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5'
                            )}
                        >
                            <p className="font-semibold text-sm">{employee.firstName} {employee.lastName}</p>
                            <p className="text-xs text-muted-foreground">{employee.position}</p>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}