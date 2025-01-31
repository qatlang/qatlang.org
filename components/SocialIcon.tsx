import Image, { StaticImageData } from "next/image";

export function SocialIcon(props: {
	color?: "normal" | "discord";
	icon: StaticImageData;
	link: string;
}) {
	const colorVars = {
		normal:
			"flex flex-col justify-center align-middle cursor-pointer mx-2 px-2 border-[3px] border-transparent hover:border-[#ffffffaa] dark:hover:border-[#ffffff55] rounded-xl sm:h-14 sm:w-14 h-[3.25rem] w-[3.25rem] bg-[#333333]",
		discord:
			"flex flex-col justify-center align-middle cursor-pointer mx-2 px-2 border-[3px] border-transparent hover:border-[#ffffffaa] dark:hover:border-[#ffffff55] rounded-xl sm:h-14 sm:w-14 h-[3.25rem] w-[3.25rem] bg-[#5865f2]",
	};
	return (
		<div className={colorVars[props.color ?? "normal"]}>
			<a href={props.link} rel="noopener noreferrer" target="_blank">
				<Image src={props.icon} alt="github-icon" />
			</a>
		</div>
	);
}
