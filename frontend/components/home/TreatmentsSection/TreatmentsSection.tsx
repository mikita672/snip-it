import TreatmentsHeader from "./TreatmentsHeader";
import TreatmentsResults from "./TreatmentsResults";

interface Props {
	params: URLSearchParams;
}

function TreatmentsSection({ params }: Props) {
	return (
		<div className="flex flex-col gap-4 md:col-span-2">
			<TreatmentsHeader />

			<TreatmentsResults params={params} />
		</div>
	)
}

export default TreatmentsSection