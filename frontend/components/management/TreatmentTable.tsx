'use client'

import { useState, useEffect, useCallback } from 'react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Pagination, PaginationContent, PaginationItem,
    PaginationLink, PaginationNext, PaginationPrevious,
} from '@/components/ui/pagination'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Treatment {
    id: number
    name: string
    description: string | null
    durationMinutes: number
    price: number
    isActive: boolean
}

type SortBy = 'PRICE' | 'DURATION'

export default function TreatmentTable() {
    const [treatments, setTreatments] = useState<Treatment[]>([])
    const [totalPages, setTotalPages] = useState(1)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [sortBy, setSortBy] = useState<SortBy>('PRICE')
    const [sortDesc, setSortDesc] = useState(false)
    const [loading, setLoading] = useState(false)
    const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null)
    const [editForm, setEditForm] = useState({ name: '', description: '', durationMinutes: '', price: '' })

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
            setPage(1)
        }, 400)
        return () => clearTimeout(timer)
    }, [search])

    const fetchTreatments = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                pageNumber: String(page),
                sortBy,
                sortDescending: String(sortDesc),
                searchToken: debouncedSearch,
            })
            const res = await fetch(`/api/treatment?${params}`)
            if (!res.ok) return
            const data: { treatments: Treatment[]; totalPages: number } = await res.json()
            setTreatments(data.treatments)
            setTotalPages(data.totalPages)
        } finally {
            setLoading(false)
        }
    }, [page, sortBy, sortDesc, debouncedSearch])

    useEffect(() => {
        fetchTreatments()
    }, [fetchTreatments])

    const handleSortChange = (value: string) => {
        const [newSortBy, dir] = value.split('_')
        setSortBy(newSortBy as SortBy)
        setSortDesc(dir === 'desc')
        setPage(1)
    }

    const handleToggleActive = async (id: number) => {
        const res = await fetch(`/api/treatment/${id}/toggle-active`, { method: 'PATCH' })
        if (res.ok) {
            const updated: Treatment = await res.json()
            setTreatments(prev => prev.map(t => t.id === id ? updated : t))
        }
    }

    const openEdit = (treatment: Treatment) => {
        setEditingTreatment(treatment)
        setEditForm({
            name: treatment.name,
            description: treatment.description ?? '',
            durationMinutes: String(treatment.durationMinutes),
            price: String(treatment.price),
        })
    }

    const handleEditSave = async () => {
        if (!editingTreatment) return
        const res = await fetch(`/api/treatment/${editingTreatment.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: editForm.name,
                description: editForm.description,
                durationMinutes: Number(editForm.durationMinutes),
                price: editForm.price,
            }),
        })
        if (res.ok) {
            const updated: Treatment = await res.json()
            setTreatments(prev => prev.map(t => t.id === updated.id ? updated : t))
            setEditingTreatment(null)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <Input
                    placeholder="Search treatments..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="max-w-sm"
                />
                <div className="flex items-center gap-2 ml-auto">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">Sort:</span>
                    <Select
                        value={`${sortBy}_${sortDesc ? 'desc' : 'asc'}`}
                        onValueChange={handleSortChange}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
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

            <div className="rounded-xl border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : treatments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                    No treatments found.
                                </TableCell>
                            </TableRow>
                        ) : treatments.map(t => (
                            <TableRow key={t.id}>
                                <TableCell className="font-medium">{t.name}</TableCell>
                                <TableCell className="max-w-[200px] truncate text-muted-foreground">
                                    {t.description}
                                </TableCell>
                                <TableCell>{t.durationMinutes} min</TableCell>
                                <TableCell>${Number(t.price).toFixed(2)}</TableCell>
                                <TableCell>
                                    <Badge variant={t.isActive ? 'default' : 'outline'}>
                                        {t.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" variant="outline" onClick={() => openEdit(t)}>
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={t.isActive ? 'destructive' : 'secondary'}
                                            onClick={() => handleToggleActive(t.id)}
                                        >
                                            {t.isActive ? 'Deactivate' : 'Reactivate'}
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={e => { e.preventDefault(); setPage(p => Math.max(1, p - 1)) }}
                                aria-disabled={page === 1}
                                className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                            />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <PaginationItem key={p}>
                                <PaginationLink
                                    isActive={p === page}
                                    onClick={e => { e.preventDefault(); setPage(p) }}
                                >
                                    {p}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                onClick={e => { e.preventDefault(); setPage(p => Math.min(totalPages, p + 1)) }}
                                aria-disabled={page === totalPages}
                                className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}

            {editingTreatment && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    onClick={e => { if (e.target === e.currentTarget) setEditingTreatment(null) }}
                >
                    <div className="bg-popover rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl ring-1 ring-foreground/10 flex flex-col gap-4">
                        <h2 className="text-lg font-semibold">Edit Treatment</h2>
                        <div className="flex flex-col gap-3">
                            <label className="flex flex-col gap-1 text-sm font-medium">
                                Name
                                <Input
                                    value={editForm.name}
                                    onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                                />
                            </label>
                            <label className="flex flex-col gap-1 text-sm font-medium">
                                Description
                                <Input
                                    value={editForm.description}
                                    onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                                />
                            </label>
                            <label className="flex flex-col gap-1 text-sm font-medium">
                                Duration (min)
                                <Input
                                    type="number"
                                    min={1}
                                    value={editForm.durationMinutes}
                                    onChange={e => setEditForm(f => ({ ...f, durationMinutes: e.target.value }))}
                                />
                            </label>
                            <label className="flex flex-col gap-1 text-sm font-medium">
                                Price ($)
                                <Input
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    value={editForm.price}
                                    onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))}
                                />
                            </label>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setEditingTreatment(null)}>
                                Cancel
                            </Button>
                            <Button onClick={handleEditSave}>
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
