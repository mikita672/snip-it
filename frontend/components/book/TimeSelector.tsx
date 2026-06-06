'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeftIcon } from 'lucide-react'

interface Props {
    onBack: () => void
    onSelect: (dateTime: string) => void
}

function generateSlots(): string[] {
    const slots: string[] = []
    for (let h = 9; h < 18; h++) {
        slots.push(`${String(h).padStart(2, '0')}:00`)
        slots.push(`${String(h).padStart(2, '0')}:30`)
    }
    return slots
}

const SLOTS = generateSlots()

function toDateInputMin(): string {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
}

export default function TimeSelector({ onBack, onSelect }: Props) {
    const [date, setDate] = useState('')
    const [selectedSlot, setSelectedSlot] = useState('')

    function handleSlotClick(slot: string) {
        setSelectedSlot(slot)
        if (date) onSelect(`${date}T${slot}:00`)
    }

    function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
        setDate(e.target.value)
        setSelectedSlot('')
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
                    <div className="grid grid-cols-4 gap-2">
                        {SLOTS.map((slot) => (
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
                </div>
            )}
        </div>
    )
}