'use client';

import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field } from '@/components/ui/field';
import { ButtonGroup } from '@/components/ui/button-group';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Button } from '@/components/ui/button';

interface Props {
    searchValue: string;
    setSearchValue: (value: string) => void;
    handleSearch: (formData: FormData) => void;
    currentStatus: string;
    currentSize: string;
    updateParams: (updates: Record<string, string | null>) => void;
}

export function AppointmentsFilters({ searchValue, setSearchValue, handleSearch, currentStatus, currentSize, updateParams }: Props) {
    return (
        <div className="flex flex-col md:flex-row items-end justify-between gap-4">
            <form action={handleSearch} className="w-full max-w-md">
                <Field className="bg-card">
                    <ButtonGroup>
                        <InputGroup>
                            <InputGroupAddon>
                                <Search className="size-4" />
                            </InputGroupAddon>
                            <InputGroupInput
                                name="search"
                                type="search"
                                placeholder="Search appointments..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </InputGroup>
                        <Button
                            className="cursor-pointer hover:opacity-75"
                            type="submit"
                        >Search</Button>
                    </ButtonGroup>
                </Field>
            </form>

            <div className="flex items-center gap-2 w-full md:w-auto">
                <Select
                    value={currentStatus}
                    onValueChange={(value) => updateParams({ status: value })}
                >
                    <SelectTrigger className="w-37.5">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={currentSize}
                    onValueChange={(value) => updateParams({ size: value })}
                >
                    <SelectTrigger className="w-25">
                        <SelectValue placeholder="Rows" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5 rows</SelectItem>
                        <SelectItem value="10">10 rows</SelectItem>
                        <SelectItem value="20">20 rows</SelectItem>
                        <SelectItem value="50">50 rows</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
