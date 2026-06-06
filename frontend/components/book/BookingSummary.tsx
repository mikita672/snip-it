import { Separator } from '@/components/ui/separator'
import { TreatmentPreview } from '@/types/treatment/TreatmentPreview'

interface Props {
    selectedTreatments: TreatmentPreview[]
    selectedTime?: string
    step: 'treatments' | 'time'
    onContinue: () => void
}

export default function BookingSummary({ selectedTreatments, selectedTime, step, onContinue }: Props) {
    const totalPrice = selectedTreatments.reduce((sum, t) => sum + t.price, 0)
    const totalMinDuration = selectedTreatments.reduce((sum, t) => sum + t.minDurationMinutes, 0)
    const totalMaxDuration = selectedTreatments.reduce((sum, t) => sum + t.maxDurationMinutes, 0)

    const canContinue = step === 'treatments'
        ? selectedTreatments.length > 0
        : !!selectedTime

    const formattedTime = selectedTime
        ? new Date(selectedTime).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
        : null

    return (
        <div className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-4 h-fit sticky top-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Your booking</p>

            {selectedTreatments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No services selected yet.</p>
            ) : (
                <>
                    <div className="flex flex-col gap-3">
                        {selectedTreatments.map((t) => (
                            <div key={t.id} className="flex items-start justify-between gap-4">
                                <div className="flex flex-col">
                                    <p className="font-semibold text-sm">{t.name}</p>
                                    <p className="text-xs text-muted-foreground">{t.minDurationMinutes}–{t.maxDurationMinutes} min</p>
                                </div>
                                <p className="text-sm font-semibold whitespace-nowrap">${t.price}</p>
                            </div>
                        ))}
                    </div>

                    <Separator />

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <p>Est. duration</p>
                            <p>{totalMinDuration}–{totalMaxDuration} min</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="font-bold">Total</p>
                            <p className="font-bold">${totalPrice}</p>
                        </div>
                    </div>

                    {formattedTime && (
                        <>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-widest">Scheduled for</p>
                                <p className="text-sm font-semibold">{formattedTime}</p>
                            </div>
                        </>
                    )}

                    <button
                        disabled={!canContinue}
                        onClick={onContinue}
                        className="w-full bg-primary text-primary-foreground rounded-xl py-2 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {step === 'treatments' ? `Continue (${selectedTreatments.length} selected)` : 'Confirm time'}
                    </button>
                </>
            )}
        </div>
    )
}