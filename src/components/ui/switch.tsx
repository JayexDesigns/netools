import {Switch as SwitchPrimitive} from "@base-ui/react/switch";
import {cn} from "cn";

function Switch({
	className,
	size = "default",
	...props
}: SwitchPrimitive.Root.Props & {
	size?: "sm" | "default";
}) {
	return (
		<SwitchPrimitive.Root data-slot="switch" data-size={size} className={cn("group/switch peer inline-flex after:absolute relative after:-inset-x-3 after:-inset-y-2 items-center data-checked:bg-primary data-unchecked:bg-input/90 data-disabled:opacity-50 border-2 data-checked:border-primary data-unchecked:border-transparent aria-invalid:border-destructive focus-visible:border-ring dark:aria-invalid:border-destructive/50 group-has-[:focus-visible]/field-label:data-checked:border-primary group-has-[:focus-visible]/field-label:data-unchecked:border-transparent rounded-2xl outline-none aria-invalid:ring-3 aria-invalid:ring-destructive/20 focus-visible:ring-3 focus-visible:ring-ring/30 dark:aria-invalid:ring-destructive/40 group-has-[:focus-visible]/field-label:ring-0 data-[size=default]:w-8 data-[size=sm]:w-6 data-[size=default]:h-5 data-[size=sm]:h-4 transition-all data-disabled:cursor-not-allowed shrink-0", className)} {...props}>
			<SwitchPrimitive.Thumb data-slot="switch-thumb" className="block bg-background dark:data-checked:bg-primary-foreground dark:data-unchecked:bg-foreground not-dark:bg-clip-padding shadow-sm rounded-2xl ring-0 group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 transition-transform data-checked:translate-x-[calc(100%-4px)] data-unchecked:translate-x-0 pointer-events-none" />
		</SwitchPrimitive.Root>
	);
}

export {Switch};
