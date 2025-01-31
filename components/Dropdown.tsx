import { useState, useEffect } from "react";

interface DropdownItem<T> {
	name: string;
	value: T;
}

export function Dropdown<T>(props: {
	className?: string;
	name?: string;
	items: DropdownItem<T>[];
	default: T | null;
	nonePrompt?: string;
	onChange?: (value: T | null, index: number | null) => void;
	disallowNone?: boolean;
}) {
	const [isExpanded, setExpanded] = useState<boolean>(false);

	const getChoiceForDefault = () => {
		if (props.default !== null) {
			for (let i = 0; i < props.items.length; i++) {
				if (props.items[i].value === props.default) {
					return i;
				}
			}
		}
		return null;
	};
	const [choice, setChoice] = useState<number | null>(getChoiceForDefault());
	useEffect(() => {
		setChoice(getChoiceForDefault());
	}, [props.default]);
	return (
		<div
			className={(props.className ?? "") + " flex flex-col font-mono mb-2"}
		>
			<div
				className="h-12 flex flex-row px-4 py-2 rounded-lg select-none cursor-pointer bg-white hover:bg-[#dddddd] border-2 border-midGray dark:bg-black dark:hover:bg-[#222222] relative"
				style={{
					borderBottomLeftRadius: isExpanded ? "0" : undefined,
					borderBottomRightRadius: isExpanded ? "0" : undefined,
				}}
				onClick={() => {
					setExpanded(!isExpanded);
				}}
				onMouseLeave={() => {
					setExpanded(false);
				}}
			>
				{props.name && (
					<div className="text-midGray self-center text-sm tracking-widest uppercase mr-2">
						{props.name}
					</div>
				)}
				<div className="self-center text-right flex-grow text-ellipsis w-full">
					{props.nonePrompt === undefined
						? props.items[choice ?? 0].name
						: choice !== null
							? props.items[choice].name
							: props.nonePrompt}
				</div>
				<svg
					className="ml-2 h-12 self-center"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					style={{ rotate: isExpanded ? "180deg" : undefined }}
				>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L6.29289 9.70711C5.90237 9.31658 5.90237 8.68342 6.29289 8.29289C6.68342 7.90237 7.31658 7.90237 7.70711 8.29289L12 12.5858L16.2929 8.29289C16.6834 7.90237 17.3166 7.90237 17.7071 8.29289C18.0976 8.68342 18.0976 9.31658 17.7071 9.70711L12.7071 14.7071Z"
						fill="#777777"
					/>
				</svg>
				{isExpanded && (
					<div className="pb-2 rounded-b-xl left-0 top-11 w-full text-right absolute bg-white dark:bg-[#222222] border-2 border-solid border-midGray shadow-2xl dark:shadow-black">
						{props.items.flatMap((it, i) => (
							<div
								key={i.toString()}
								className="font-bold py-2 px-4 hover:bg-[#cccccc] dark:hover:bg-[#333333]"
								style={{
									backgroundColor:
										choice === i ? "#128f5f" : undefined,
									color: choice === i ? "white" : undefined,
								}}
								onClick={() => {
									if (choice !== i) {
										setChoice(i);
										if (props.onChange !== undefined) {
											props.onChange(props.items[i].value, i);
										}
									}
								}}
							>
								{it.name}
							</div>
						))}

						{!(props.disallowNone ?? false) && (
							<div
								key="none"
								className="font-bold py-2 px-4 hover:bg-[#cccccc] dark:hover:bg-[#333333]"
								style={{
									backgroundColor:
										choice === null ? "#128f5f" : undefined,
									color: choice === null ? "white" : undefined,
								}}
								onClick={() => {
									if (choice !== null) {
										setChoice(null);
										if (props.onChange !== undefined) {
											props.onChange(null, null);
										}
									}
								}}
							>
								{props.nonePrompt ?? "None"}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

function DropdownItem() {
	return;
}

export const DropdownString = Dropdown<string>;

export const DropdownNumber = Dropdown<number>;
