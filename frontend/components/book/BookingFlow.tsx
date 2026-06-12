'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { TreatmentPreview } from '@/types/treatment/TreatmentPreview'
import TreatmentSelector from './TreatmentSelector'
import BookingSummary from './BookingSummary'
import TimeSelector from './TimeSelector'
import EmployeeSelector, { AvailableEmployee } from './EmployeeSelector'
import TreatmentsPagination from '../home/TreatmentsSection/TreatmentsPagination'
import TreatmentsHeader from '../home/TreatmentsSection/TreatmentsHeader'

type Step = 'treatments' | 'time' | 'employee'

interface Props {
    treatments: TreatmentPreview[]
    initialTreatment?: number
    totalPages: number
}

export default function BookingFlow({ treatments, initialTreatment, totalPages }: Props) {
    const router = useRouter()
    const [step, setStep] = useState<Step>('treatments')
    const [selectedMap, setSelectedMap] = useState<Map<number, TreatmentPreview>>(() => {
        const map = new Map<number, TreatmentPreview>()
        if (initialTreatment) {
            const t = treatments.find(t => t.id === initialTreatment)
            if (t) map.set(t.id, t)
        }
        return map
    })
    const [selectedTime, setSelectedTime] = useState<string>('')
    const [selectedEmployee, setSelectedEmployee] = useState<AvailableEmployee | null>(null)
    const [loading, setLoading] = useState(false)

    function toggle(treatment: TreatmentPreview) {
        setSelectedMap(prev => {
            const next = new Map(prev)
            if (next.has(treatment.id)) {
                next.delete(treatment.id)
            } else {
                next.set(treatment.id, treatment)
            }
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
                    treatmentIds: Array.from(selectedMap.keys()),
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

    const selectedTreatments = Array.from(selectedMap.values())
    const selectedIds = new Set(selectedMap.keys())

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 flex flex-col gap-4">
                {step === 'treatments' && (
                    <>
                        <TreatmentsHeader />
                        <TreatmentSelector treatments={treatments} selected={selectedIds} onToggle={toggle} />
                        <TreatmentsPagination totalPages={totalPages} />
                    </>
                )}
                {step === 'time' && (
                    <TimeSelector
                        treatmentIds={Array.from(selectedIds)}
                        onBack={() => setStep('treatments')}
                        onSelect={setSelectedTime}
                    />
                )}
                {step === 'employee' && (
                    <EmployeeSelector
                        treatmentIds={Array.from(selectedIds)}
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