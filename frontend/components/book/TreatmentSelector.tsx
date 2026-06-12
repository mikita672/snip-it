'use client'

import { Item, ItemContent, ItemTitle, ItemDescription, ItemFooter } from '@/components/ui/item'
import { ClockIcon, CheckIcon } from 'lucide-react'
import { TreatmentPreview } from '@/types/treatment/TreatmentPreview'
import { cn } from '@/lib/utils'

interface Props {
    treatments: TreatmentPreview[]
    selected: Set<number>
    onToggle: (treatment: TreatmentPreview) => void
}

export default function TreatmentSelector({ treatments, selected, onToggle }: Props) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                {treatments.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-4">No services found.</p>
                ) : (
                    treatments.map((treatment) => {
                        const isSelected = selected.has(treatment.id)
                        return (
                            <Item
                                key={treatment.id}
                                onClick={() => onToggle(treatment)}
                                className={cn(
                                    'cursor-pointer border transition-colors',
                                    isSelected
                                        ? 'border-primary bg-primary/10'
                                        : 'bg-card border-foreground border-opacity-75 hover:opacity-75'
                                )}
                            >
                                <ItemContent>
                                    <ItemTitle className="w-full flex items-center justify-between">
                                        <p className="font-bold">{treatment.name}</p>
                                        <div className="flex items-center gap-3">
                                            <p className="font-bold">${treatment.price}</p>
                                            {isSelected && <CheckIcon size={16} className="text-primary" />}
                                        </div>
                                    </ItemTitle>
                                    <ItemDescription>{treatment.description}</ItemDescription>
                                    <ItemFooter>
                                        <div className="flex items-center gap-2 opacity-35 text-xs">
                                            <ClockIcon size={16} /> {treatment.durationMinutes} min
                                        </div>
                                    </ItemFooter>
                                </ItemContent>
                            </Item>
                        )
                    })
                )}
            </div>
        </div>
    )
}