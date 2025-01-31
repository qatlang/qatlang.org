export default function Button(props: {
	className?: string;
	style?: string;
	theme?: "normal" | "special";
	onClick: (e: any) => void;
	children: any;
}) {
	const themes = {
		special:
			"flex flex-row align-middle justify-center text-center items-center cursor-pointer h-[100%] w-fit py-2 md:py-[0.62rem] lg:py-2 xl:py-3 px-4 md:px-5 lg:px-5 xl:px-6 rounded-lg sm:mx-2 mx-1 lg:text-xl xl:text-2xl md:text-[1.6rem] sm:text-2xl text-xl font-bold text-black hover:text-white dark:hover:text-black bg-[#fec033] hover:bg-black dark:hover:bg-white active:bg-[#bbbbbb] select-none",
		normal:
			"flex flex-row align-middle justify-center text-center items-center cursor-pointer h-[100%] w-fit py-2 md:py-[0.62rem] lg:py-2 xl:py-3 px-4 md:px-5 lg:px-5 xl:px-6 rounded-lg sm:mx-2 mx-1 lg:text-xl xl:text-2xl md:text-[1.6rem] sm:text-2xl text-xl font-bold text-white bg-[#128f5f] hover:bg-black dark:hover:bg-white active:bg-[#bbbbbb] hover:text-white dark:hover:text-black select-none",
	};

	return (
		<div
			className={
				(props.style ? props.style + " " : "") +
				(props.className ?? themes[props.theme ?? "normal"])
			}
			onClick={props.onClick}
		>
			{props.children}
		</div>
	);
}
