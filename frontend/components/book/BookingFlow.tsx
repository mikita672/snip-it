'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { TreatmentPreview } from '@/types/treatment/TreatmentPreview'
import TreatmentSelector from './TreatmentSelector'
import BookingSummary from './BookingSummary'
import TimeSelector from './TimeSelector'
import EmployeeSelector, { AvailableEmployee } from './EmployeeSelector'

type Step = 'treatments' | 'time' | 'employee'

interface Props {
    treatments: TreatmentPreview[]
}

export default function BookingFlow({ treatments }: Props) {
    const router = useRouter()
    const [step, setStep] = useState<Step>('treatments')
    const [selected, setSelected] = useState<Set<number>>(new Set())
    const [selectedTime, setSelectedTime] = useState<string>('')
    const [selectedEmployee, setSelectedEmployee] = useState<AvailableEmployee | null>(null)
    const [loading, setLoading] = useState(false)

    function toggle(id: number) {
        setSelected(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    async function handleContinue() {
        if (step === 'treatments') { setStep('time'); return }
        if (step === 'time') { setStep('employee'); return }

        setLoading(true)
        try {
            const response = await fetch('/api/reservation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    employeeId: selectedEmployee!.id,
                    reservationTime: selectedTime,
                    treatmentIds: [...selected],
                }),
            })

            if (!response.ok) throw new Error()

            toast.success('Booking confirmed!')
            router.push('/')
        } catch {
            toast.error('Failed to confirm booking. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const selectedTreatments = treatments.filter(t => selected.has(t.id))

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                {step === 'treatments' && (
                    <TreatmentSelector treatments={treatments} selected={selected} onToggle={toggle} />
                )}
                {step === 'time' && (
                    <TimeSelector
                        treatmentIds={[...selected]}
                        onBack={() => setStep('treatments')}
                        onSelect={setSelectedTime}
                    />
                )}
                {step === 'employee' && (
                    <EmployeeSelector
                        treatmentIds={[...selected]}
                        selectedTime={selectedTime}
                        onSelect={setSelectedEmployee}
                        onBack={() => setStep('time')}
                    />
                )}
            </div>
            <div>
                <BookingSummary
                    selectedTreatments={selectedTreatments}
                    selectedTime={selectedTime}
                    selectedEmployee={selectedEmployee}
                    step={step}
                    onContinue={handleContinue}
                    loading={loading}
                />
            </div>
        </div>
    )
}