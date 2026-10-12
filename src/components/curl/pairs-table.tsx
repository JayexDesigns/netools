import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Input} from "@/components/ui/input";
import {createPair, type Pair} from "@/lib/curl";
import {PlusIcon, XIcon} from "lucide-react";

type PairsTableProps = {
	label: string;
	placeholderKey: string;
	placeholderValue: string;
	pairs: Pair[];
	onChange: (pairs: Pair[]) => void;
};

export default function PairsTable({label, placeholderKey, placeholderValue, pairs, onChange}: PairsTableProps) {
	function update(id: string, patch: Partial<Pair>) {
		onChange(pairs.map(pair => (pair.id === id ? {...pair, ...patch} : pair)));
	}

	return (
		<div className="flex flex-col gap-2">
			{pairs.map((pair, index) => (
				<div key={pair.id} className="items-center gap-1.5 sm:gap-2 grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_auto]">
					<Checkbox checked={pair.enabled} onCheckedChange={checked => update(pair.id, {enabled: checked === true})} aria-label={`Include ${label.toLowerCase()} ${index + 1}`} />

					<Input type="text" autoComplete="off" spellCheck={false} placeholder={placeholderKey} value={pair.key} onChange={event => update(pair.id, {key: event.target.value})} aria-label={`${label} key`} className="font-mono" />
					<Input type="text" autoComplete="off" spellCheck={false} placeholder={placeholderValue} value={pair.value} onChange={event => update(pair.id, {value: event.target.value})} aria-label={`${label} value`} className="font-mono" />

					<Button variant="ghost" size="icon-sm" onClick={() => onChange(pairs.filter(candidate => candidate.id !== pair.id))} aria-label={`Remove ${label.toLowerCase()} ${index + 1}`} className="text-muted-foreground hover:text-destructive">
						<XIcon />
					</Button>
				</div>
			))}

			<Button variant="outline" size="sm" onClick={() => onChange([...pairs, createPair()])} className="self-start mt-1">
				<PlusIcon />
				Add {label.toLowerCase()}
			</Button>
		</div>
	);
}
