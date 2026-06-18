'use client'

import { Badge } from '@/components/ui/badge'

interface Props {
    status: string
}

export function StatusBadge({ status }: Props) {
    const s = status.toLowerCase()

    if (s === 'pending') {
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">Pending</Badge>
    }

    if (s === 'confirmed') {
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Confirmed</Badge>
    }

    if (s === 'completed') {
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Completed</Badge>
    }

    if (s === 'cancelled') {
        return <Badge variant="destructive">Cancelled</Badge>
    }

    return <Badge variant="outline">{status}</Badge>
}
