'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeftIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'

interface Props {
    treatmentIds: number[]
    onBack: () => void
    onSelect: (dateTime: string) => void
}

function toISODate(d: Date): string {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export default function TimeSelector({ treatmentIds, onBack, onSelect }: Props) {
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [selectedSlot, setSelectedSlot] = useState('')
    const [slots, setSlots] = useState<string[]>([])
    const [loadingSlots, setLoadingSlots] = useState(false)
    const [error, setError] = useState(false)

    const [availableDays, setAvailableDays] = useState<Set<string>>(new Set())
    const [loadingDays, setLoadingDays] = useState(true)

    const treatmentIdsStr = treatmentIds.join(',')

    useEffect(() => {
        const fetchDays = async () => {
            setLoadingDays(true)
            try {
                const start = new Date()
                const end = new Date()
                end.setDate(end.getDate() + 30)

                const params = new URLSearchParams()
                treatmentIds.forEach(id => params.append('treatmentIds', String(id)))
                params.set('startDate', toISODate(start))
                params.set('endDate', toISODate(end))

                const res = await fetch(`/api/availability/days?${params.toString()}`, { cache: 'no-store' })
                if (res.ok) {
                    const days = await res.json() as string[]
                    setAvailableDays(new Set(days))
                }
            } catch (err) {
                console.error("Failed to load available days", err)
            } finally {
                setLoadingDays(false)
            }
        }
        fetchDays()
    }, [treatmentIdsStr])

    useEffect(() => {
        if (!date) return

        const dateStr = toISODate(date)
        setSelectedSlot('')
        setSlots([])
        setError(false)
        setLoadingSlots(true)

        const params = new URLSearchParams()
        treatmentIds.forEach(id => params.append('treatmentIds', String(id)))
        params.set('date', dateStr)

        fetch(`/api/availability?${params.toString()}`, { cache: 'no-store' })
            .then(res => {
                if (!res.ok) throw new Error()
                return res.json() as Promise<string[]>
            })
            .then(data => setSlots(data))
            .catch(() => setError(true))
            .finally(() => setLoadingSlots(false))
    }, [date, treatmentIdsStr])

    function handleSlotClick(slot: string) {
        setSelectedSlot(slot)
        if (date) {
            onSelect(`${toISODate(date)}T${slot}:00`)
        }
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const maxDate = new Date(today)
    maxDate.setDate(maxDate.getDate() + 30)

    const isDateDisabled = (d: Date) => {
        d.setHours(0, 0, 0, 0)
        if (d < today || d > maxDate) return true
        if (loadingDays) return true
        const dateStr = toISODate(d)
        return !availableDays.has(dateStr)
    }

    return (
        <div className="flex flex-col gap-6">
            <button
                onClick={onBack}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
            >
                <ChevronLeftIcon size={16} /> Back to services
            </button>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">Select a date</p>
                    <div className="border rounded-xl bg-card p-2 w-fit">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={isDateDisabled}
                            className="pointer-events-auto"
                        />
                    </div>
                    {loadingDays && <p className="text-xs text-muted-foreground mt-1">Loading calendar…</p>}
                </div>

                {date && (
                    <div className="flex flex-col gap-4 flex-1 w-full">
                        <p className="text-sm font-medium">Select a time</p>

                        {loadingSlots && (
                            <p className="text-sm text-muted-foreground">Loading available slots…</p>
                        )}
                        {error && (
                            <p className="text-sm text-destructive">Failed to load available slots.</p>
                        )}
                        {!loadingSlots && !error && slots.length === 0 && (
                            <p className="text-sm text-muted-foreground">No available slots on this date.</p>
                        )}
                        {!loadingSlots && !error && slots.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {slots.map((slot) => (
                                    <button
                                        key={slot}
                                        onClick={() => handleSlotClick(slot)}
                                        className={cn(
                                            'rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
                                            selectedSlot === slot
                                                ? 'border-primary bg-primary text-primary-foreground shadow-sm'
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
        </div>
    )
}