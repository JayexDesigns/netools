import CopyButton from "@/components/copy-button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Toggle} from "@/components/ui/toggle";
import type {SubnetRow} from "@/lib/subnet";
import {cn} from "cn";
import {BinaryIcon} from "lucide-react";
import {useState} from "react";

function ResultRow({row}: {row: SubnetRow}) {
	const [showBinary, setShowBinary] = useState(false);

	const value = row.value;
	const binary = row.binary;
	const isNull = value === null;
	const canToggle = !isNull && binary !== null;
	const binaryShown = canToggle && showBinary;
	const displayed = isNull ? null : binaryShown ? binary : value;

	return (
		<TableRow>
			<TableCell className="font-medium text-muted-foreground">{row.label}</TableCell>
			<TableCell>
				<div className="flex justify-end items-center gap-1.5">
					<span className={cn("font-mono", binaryShown ? "text-foreground text-xs" : "text-sm", isNull && "text-muted-foreground")}>{displayed ?? "—"}</span>
					{canToggle && (
						<Toggle variant="outline" size="sm" pressed={showBinary} onPressedChange={setShowBinary} aria-label={`Show ${row.label} in ${showBinary ? "dotted decimal" : "binary"}`} className="h-6 min-w-6 px-0 [&_svg:not([class*='size-'])]:size-3 aria-pressed:bg-primary-500/15 aria-pressed:text-primary-600 dark:aria-pressed:text-primary-300">
							<BinaryIcon />
						</Toggle>
					)}
					{!isNull && <CopyButton className="bg-transparent hover:bg-muted border border-input text-foreground" value={value} label={row.label} />}
				</div>
			</TableCell>
		</TableRow>
	);
}

type SubnetTableProps = {
	rows: SubnetRow[];
};

export default function SubnetTable({rows}: SubnetTableProps) {
	return (
		<div className="bg-muted/40 dark:bg-black/30 border border-border rounded-xl overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Property</TableHead>
						<TableHead className="text-right">Value</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.map(row => (
						<ResultRow key={row.label} row={row} />
					))}
				</TableBody>
			</Table>
		</div>
	);
}
