import BookingFlow from '@/components/book/BookingFlow'
import { TreatmentsPreviewPage } from '@/types/treatment/TreatmentsPreviewPage'

async function BookPage() {
    const response = await fetch(`${process.env.API_URL}/treatment/preview`, {
        method: 'GET',
    })

    if (!response.ok) {
        return <p className="text-center font-bold">Failed to load services</p>
    }

    const data: TreatmentsPreviewPage = await response.json()

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold">Select a service</h1>
                <p className="text-muted-foreground text-sm">Pick one or more services you'd like to book</p>
            </div>

            <BookingFlow treatments={data.treatments} />
        </div>
    )
}

export default BookPage