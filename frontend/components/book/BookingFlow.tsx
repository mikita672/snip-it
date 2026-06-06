'use client'

import { useState } from 'react'
import { TreatmentPreview } from '@/types/treatment/TreatmentPreview'
import TreatmentSelector from './TreatmentSelector'
import BookingSummary from './BookingSummary'

interface Props {
    treatments: TreatmentPreview[]
}

export default function BookingFlow({ treatments }: Props) {
    const [selected, setSelected] = useState<Set<number>>(new Set())

    function toggle(id: number) {
        setSelected(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const selectedTreatments = treatments.filter(t => selected.has(t.id))

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <TreatmentSelector treatments={treatments} selected={selected} onToggle={toggle} />
            </div>
            <div>
                <BookingSummary selectedTreatments={selectedTreatments} />
            </div>
        </div>
    )
}