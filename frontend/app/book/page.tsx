import BookingFlow from "@/components/book/BookingFlow";
import { TreatmentsPreviewPage } from "@/types/treatment/TreatmentsPreviewPage";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function BookPage({ searchParams }: Props) {
  const paramsObj = await searchParams;
  const initialTreatment = paramsObj.treatment
    ? parseInt(paramsObj.treatment as string)
    : undefined;

  const params = new URLSearchParams();
  Object.entries(paramsObj).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value !== undefined) {
      params.append(key, value);
    }
  });

  const response = await fetch(
    `${process.env.API_URL}/treatment/preview?${params.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return <p className="text-center font-bold">Failed to load services</p>;
  }

  const data: TreatmentsPreviewPage = await response.json();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Select a service</h1>
        <p className="text-muted-foreground text-sm">
          Pick one or more services you&apos;d like to book
        </p>
      </div>
      <BookingFlow
        treatments={data.treatments}
        totalPages={data.totalPages}
        initialTreatment={initialTreatment}
      />
    </div>
  );
}

export default BookPage;
