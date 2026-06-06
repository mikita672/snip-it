'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeftIcon } from 'lucide-react'

interface Props {
    treatmentIds: number[]
    onBack: () => void
    onSelect: (dateTime: string) => void
}

function toDateInputMin(): string {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
}

export default function TimeSelector({ treatmentIds, onBack, onSelect }: Props) {
    const [date, setDate] = useState('')
    const [selectedSlot, setSelectedSlot] = useState('')
    const [slots, setSlots] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        if (!date) return
        setSelectedSlot('')
        setSlots([])
        setError(false)
        setLoading(true)

        const params = new URLSearchParams()
        treatmentIds.forEach(id => params.append('treatmentIds', String(id)))
        params.set('date', date)

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/availability?${params.toString()}`)
            .then(res => {
                if (!res.ok) throw new Error()
                return res.json() as Promise<string[]>
            })
            .then(data => setSlots(data))
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }, [date, treatmentIds])

    function handleSlotClick(slot: string) {
        setSelectedSlot(slot)
        onSelect(`${date}T${slot}:00`)
    }

    function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
        setDate(e.target.value)
    }

    return (
        <div className="flex flex-col gap-6">
            <button
                onClick={onBack}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
            >
                <ChevronLeftIcon size={16} /> Back to services
            </button>

            <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Select a date</p>
                <input
                    type="date"
                    min={toDateInputMin()}
                    value={date}
                    onChange={handleDateChange}
                    className="bg-card border border-border rounded-xl px-4 py-2 text-sm w-fit focus:outline-none focus:ring-2 focus:ring-ring"
                />
            </div>

            {date && (
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">Select a time</p>
                    {loading && (
                        <p className="text-sm text-muted-foreground">Loading available slots…</p>
                    )}
                    {error && (
                        <p className="text-sm text-destructive">Failed to load available slots.</p>
                    )}
                    {!loading && !error && slots.length === 0 && (
                        <p className="text-sm text-muted-foreground">No available slots on this date.</p>
                    )}
                    {!loading && !error && slots.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                            {slots.map((slot) => (
                                <button
                                    key={slot}
                                    onClick={() => handleSlotClick(slot)}
                                    className={cn(
                                        'rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
                                        selectedSlot === slot
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5'
                                    )}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}