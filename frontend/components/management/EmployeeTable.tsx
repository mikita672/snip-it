'use client'

import { useState, useEffect } from 'react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { EmployeePreview } from '@/types/employee/EmployeePreview'
import type { TreatmentPreview } from '@/types/treatment/TreatmentPreview'

interface EmployeeForm {
    firstName: string
    lastName: string
    position: string
    email: string
    phone: string
    treatmentIds: number[]
}

const emptyForm: EmployeeForm = {
    firstName: '',
    lastName: '',
    position: '',
    email: '',
    phone: '',
    treatmentIds: [],
}

export default function EmployeeTable() {
    const [employees, setEmployees] = useState<EmployeePreview[]>([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [editingEmployee, setEditingEmployee] = useState<EmployeePreview | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [form, setForm] = useState<EmployeeForm>(emptyForm)
    const [availableTreatments, setAvailableTreatments] = useState<TreatmentPreview[]>([])

    const fetchEmployees = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/employee/preview')
            if (!res.ok) return
            const data: EmployeePreview[] = await res.json()
            setEmployees(data)
        } finally {
            setLoading(false)
        }
    }

    const fetchAllTreatments = async () => {
        const all: TreatmentPreview[] = []
        let page = 1
        while (true) {
            const res = await fetch(`/api/treatment/preview?pageNumber=${page}&activeOnly=false&sortBy=PRICE`)
            if (!res.ok) break
            const data: { treatments: TreatmentPreview[]; totalPages: number } = await res.json()
            all.push(...data.treatments)
            if (page >= data.totalPages) break
            page++
        }
        setAvailableTreatments(all)
    }

    useEffect(() => {
        fetchEmployees()
        fetchAllTreatments()
    }, [])

    const filtered = employees.filter(e => {
        const q = search.toLowerCase()
        return (
            e.firstName.toLowerCase().includes(q) ||
            e.lastName.toLowerCase().includes(q) ||
            e.email.toLowerCase().includes(q)
        )
    })

    const openCreate = () => {
        setForm(emptyForm)
        setIsCreating(true)
        setEditingEmployee(null)
    }

    const openEdit = (employee: EmployeePreview) => {
        setEditingEmployee(employee)
        setIsCreating(false)
        setForm({
            firstName: employee.firstName,
            lastName: employee.lastName,
            position: employee.position,
            email: employee.email,
            phone: employee.phone,
            treatmentIds: employee.treatmentIds ?? [],
        })
    }

    const closeModal = () => {
        setEditingEmployee(null)
        setIsCreating(false)
    }

    const handleSave = async () => {
        const isEdit = editingEmployee !== null
        const url = isEdit ? `/api/employee/${editingEmployee.id}` : '/api/employee'
        const method = isEdit ? 'PUT' : 'POST'

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        })
        if (res.ok) {
            await fetchEmployees()
            closeModal()
        }
    }

    const handleToggleActive = async (id: number) => {
        const res = await fetch(`/api/employee/${id}/toggle-active`, { method: 'PATCH' })
        if (res.ok) {
            const updated: EmployeePreview = await res.json()
            setEmployees((prev: EmployeePreview[]) => prev.map((e: EmployeePreview) => e.id === id ? updated : e))
        }
    }

    const toggleTreatment = (id: number) => {
        setForm(f => ({
            ...f,
            treatmentIds: f.treatmentIds.includes(id)
                ? f.treatmentIds.filter(t => t !== id)
                : [...f.treatmentIds, id],
        }))
    }

    const modalOpen = isCreating || editingEmployee !== null

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <Input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="max-w-sm"
                />
                <Button className="ml-auto" onClick={openCreate}>
                    Add new
                </Button>
            </div>

            <div className="rounded-xl border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>First Name</TableHead>
                            <TableHead>Last Name</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                    No employees found.
                                </TableCell>
                            </TableRow>
                        ) : filtered.map(e => (
                            <TableRow key={e.id}>
                                <TableCell className="font-medium">{e.firstName}</TableCell>
                                <TableCell>{e.lastName}</TableCell>
                                <TableCell className="text-muted-foreground">{e.position}</TableCell>
                                <TableCell className="text-muted-foreground">{e.email}</TableCell>
                                <TableCell className="text-muted-foreground">{e.phone}</TableCell>
                                <TableCell>
                                    <Badge variant={e.isActive ? 'default' : 'outline'}>
                                        {e.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" variant="outline" onClick={() => openEdit(e)}>
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={e.isActive ? 'destructive' : 'secondary'}
                                            onClick={() => handleToggleActive(e.id)}
                                        >
                                            {e.isActive ? 'Deactivate' : 'Reactivate'}
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    onClick={e => { if (e.target === e.currentTarget) closeModal() }}
                >
                    <div className="bg-popover rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl ring-1 ring-foreground/10 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-semibold">
                            {isCreating ? 'Add Employee' : 'Edit Employee'}
                        </h2>

                        <div className="flex flex-col gap-3">
                            <label className="flex flex-col gap-1 text-sm font-medium">
                                First Name
                                <Input
                                    value={form.firstName}
                                    onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                                />
                            </label>
                            <label className="flex flex-col gap-1 text-sm font-medium">
                                Last Name
                                <Input
                                    value={form.lastName}
                                    onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                                />
                            </label>
                            <label className="flex flex-col gap-1 text-sm font-medium">
                                Position
                                <Input
                                    value={form.position}
                                    onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                                />
                            </label>
                            <label className="flex flex-col gap-1 text-sm font-medium">
                                Email
                                <Input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                />
                            </label>
                            <label className="flex flex-col gap-1 text-sm font-medium">
                                Phone
                                <Input
                                    value={form.phone}
                                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                />
                            </label>

                            {availableTreatments.length > 0 && (
                                <div className="flex flex-col gap-2 text-sm font-medium">
                                    Treatments
                                    <div className="flex flex-col gap-1 rounded-lg border p-3 max-h-40 overflow-y-auto">
                                        {availableTreatments.map(t => (
                                            <label key={t.id} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={form.treatmentIds.includes(t.id)}
                                                    onChange={() => toggleTreatment(t.id)}
                                                    className="accent-primary"
                                                />
                                                <span className="font-normal">{t.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={closeModal}>Cancel</Button>
                            <Button onClick={handleSave}>Save</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
