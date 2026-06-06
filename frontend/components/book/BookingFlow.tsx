'use client'

import { useState } from 'react'
import { TreatmentPreview } from '@/types/treatment/TreatmentPreview'
import TreatmentSelector from './TreatmentSelector'
import BookingSummary from './BookingSummary'
import TimeSelector from './TimeSelector'

type Step = 'treatments' | 'time'

interface Props {
    treatments: TreatmentPreview[]
}

export default function BookingFlow({ treatments }: Props) {
    const [step, setStep] = useState<Step>('treatments')
    const [selected, setSelected] = useState<Set<number>>(new Set())
    const [selectedTime, setSelectedTime] = useState<string>('')

    function toggle(id: number) {
        setSelected(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    function handleContinue() {
        if (step === 'treatments') setStep('time')
        else console.log('Proceed with:', { treatmentIds: [...selected], reservationTime: selectedTime })
    }

    const selectedTreatments = treatments.filter(t => selected.has(t.id))

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                {step === 'treatments' ? (
                    <TreatmentSelector treatments={treatments} selected={selected} onToggle={toggle} />
                ) : (
                    <TimeSelector
                        treatmentIds={[...selected]}
                        onBack={() => setStep('treatments')}
                        onSelect={setSelectedTime}
                    />
                )}
            </div>
            <div>
                <BookingSummary
                    selectedTreatments={selectedTreatments}
                    selectedTime={selectedTime}
                    step={step}
                    onContinue={handleContinue}
                />
            </div>
        </div>
    )
}