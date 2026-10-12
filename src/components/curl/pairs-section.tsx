import CurlSection from "@/components/curl/curl-section";
import PairsTable from "@/components/curl/pairs-table";
import type {Pair} from "@/lib/curl";

type PairsSectionProps = {
	id: string;
	title: string;
	description: string;
	label: string;
	placeholderKey: string;
	placeholderValue: string;
	pairs: Pair[];
	onChange: (pairs: Pair[]) => void;
};

export default function PairsSection({id, title, description, label, placeholderKey, placeholderValue, pairs, onChange}: PairsSectionProps) {
	return (
		<CurlSection id={id} title={title} description={description}>
			<PairsTable label={label} placeholderKey={placeholderKey} placeholderValue={placeholderValue} pairs={pairs} onChange={onChange} />
		</CurlSection>
	);
}
