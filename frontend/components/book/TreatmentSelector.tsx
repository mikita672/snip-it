'use client'

import { useState } from 'react'
import { Item, ItemContent, ItemTitle, ItemDescription, ItemFooter } from '@/components/ui/item'
import { ClockIcon, CheckIcon, SearchIcon } from 'lucide-react'
import { TreatmentPreview } from '@/types/treatment/TreatmentPreview'
import { cn } from '@/lib/utils'
import { Field } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type SortBy = 'PRICE_asc' | 'PRICE_desc' | 'DURATION_asc' | 'DURATION_desc'

interface Props {
    treatments: TreatmentPreview[]
    selected: Set<number>
    onToggle: (id: number) => void
}

export default function TreatmentSelector({ treatments, selected, onToggle }: Props) {
    const [searchToken, setSearchToken] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [sortBy, setSortBy] = useState<SortBy>('PRICE_asc')

    const handleSearch = (e: React.SubmitEvent) => {
        e.preventDefault()
        setSearchToken(searchInput)
    }

    const filtered = treatments
        .filter(t =>
            t.name.toLowerCase().includes(searchToken.toLowerCase()) ||
            t.description.toLowerCase().includes(searchToken.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'PRICE_asc':  return a.price - b.price
                case 'PRICE_desc': return b.price - a.price
                case 'DURATION_asc':  return a.minDurationMinutes - b.minDurationMinutes
                case 'DURATION_desc': return b.minDurationMinutes - a.minDurationMinutes
            }
        })

    return (
        <div className="flex flex-col gap-4">
            <div className="w-full text-sm flex justify-between items-center">
                <p className="uppercase">Services</p>

                <div className="flex gap-1 items-center">
                    <p className="opacity-75">Sort: </p>
                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
                        <SelectTrigger className="bg-card">
                            <SelectValue placeholder="Sort" />
                        </SelectTrigger>
                        <SelectContent className="bg-card">
                            <SelectGroup>
                                <SelectItem value="PRICE_asc">Price (cheap first)</SelectItem>
                                <SelectItem value="PRICE_desc">Price (cheap last)</SelectItem>
                                <SelectItem value="DURATION_asc">Duration (short first)</SelectItem>
                                <SelectItem value="DURATION_desc">Duration (short last)</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <form onSubmit={handleSearch}>
                <Field className="bg-card">
                    <ButtonGroup>
                        <InputGroup>
                            <InputGroupAddon>
                                <SearchIcon />
                            </InputGroupAddon>
                            <InputGroupInput
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search services..."
                            />
                        </InputGroup>
                        <Button className="cursor-pointer hover:opacity-75" type="submit">
                            Search
                        </Button>
                    </ButtonGroup>
                </Field>
            </form>

            <div className="flex flex-col gap-2">
                {filtered.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-4">No services found.</p>
                ) : (
                    filtered.map((treatment) => {
                        const isSelected = selected.has(treatment.id)
                        return (
                            <Item
                                key={treatment.id}
                                onClick={() => onToggle(treatment.id)}
                                className={cn(
                                    'cursor-pointer border transition-colors',
                                    isSelected
                                        ? 'border-primary bg-primary/10'
                                        : 'border-border hover:opacity-75'
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
                                            <ClockIcon size={16} /> {treatment.minDurationMinutes}-{treatment.maxDurationMinutes} min
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