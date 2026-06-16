'use client'

import { useState } from "react"
import TreatmentTable from "@/components/management/TreatmentTable"
import EmployeeTable from "@/components/management/EmployeeTable"

type EntityType = 'reservations' | 'employees' | 'treatments'

export default function ManagementTab() {
    const [selectedEntity, setSelectedEntity] = useState<EntityType>('reservations')

    const menuItems: { id: EntityType; label: string }[] = [
        { id: 'reservations', label: 'Reservations' },
        { id: 'employees', label: 'Employees' },
        { id: 'treatments', label: 'Treatments' },
    ]

    return (
        <div className="flex flex-col md:flex-row gap-6 min-h-[400px] border rounded-xl p-6 bg-card">
            <aside className="w-full md:w-64 flex flex-row md:flex-col gap-2 border-b md:border-b-0 md:border-r pb-4 md:pb-0 md:pr-6 border-muted">
                {menuItems.map((item) => {
                    const isActive = selectedEntity === item.id
                    return (
                        <button
                            key={item.id}
                            onClick={() => setSelectedEntity(item.id)}
                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {item.label}
                        </button>
                    )
                })}
            </aside>

            <main className="flex-1 min-w-0 py-2 md:py-0">
                {selectedEntity === 'treatments' && <TreatmentTable />}
                {selectedEntity === 'employees' && <EmployeeTable />}
                {selectedEntity === 'reservations' && (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold capitalize mb-1">{selectedEntity}</h3>
                            <p className="text-sm text-muted-foreground">
                                Management panel for {selectedEntity} is under construction.
                            </p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}