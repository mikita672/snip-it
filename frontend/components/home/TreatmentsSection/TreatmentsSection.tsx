import TreatmentsHeader from "./TreatmentsHeader";
import TreatmentsResults from "./TreatmentsResults";

interface Props {
	params: URLSearchParams;
}

function TreatmentsSection({ params }: Props) {
	return (
		<div className="flex flex-col gap-4 col-span-7">
			<TreatmentsHeader />

			<TreatmentsResults params={params} />
		</div>
	)
}

export default TreatmentsSection