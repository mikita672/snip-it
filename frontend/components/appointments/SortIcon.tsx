'use client';

import { ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';

interface Props {
    field: string;
    currentSort: string;
    currentDirection: string;
}

export function SortIcon({ field, currentSort, currentDirection }: Props) {
    if (currentSort !== field) {
        return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    
    if (currentDirection === 'asc') {
        return <ChevronUp className="ml-2 h-4 w-4" />;
    }
    
    return <ChevronDown className="ml-2 h-4 w-4" />;
}
