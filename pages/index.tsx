import lavaCapsule from "../public/lava_capsule.png";
import discordIcon from "../public/discord.png";
import githubIcon from "../public/github.png";
import youtubeIcon from "../public/youtube.png";
import aldrinImg from "../public/aldrin.jpeg";
import Button from "../components/Button";
import { examples, languageFeatures } from "../models/data";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import useWindowSize from "../utils/WindowSize";
import { SocialIcon } from "../components/SocialIcon";
import Markdown, { ExternalLinkIcon } from "../components/Markdown";
import { DropdownNumber } from "../components/Dropdown";

const repoList: { name: string; link: string }[] = [
	{ name: "compiler", link: "https://github.com/qatlang/qat" },
	{ name: "language-server", link: "https://github.com/qatlang/qatls" },
	{ name: "treesitter", link: "https://github.com/qatlang/tree-sitter-qat" },
	{ name: "website", link: "https://github.com/qatlang/qatlang.org" },
];

export default function Home() {
	const Feature = (props: { title: string; content: string }) => {
		return (
			<div className="flex flex-col bg-white dark:bg-black text-left px-2 py-1 sm:px-4 sm:py-2 border-2 border-solid border-gray-300 shadow-lg dark:shadow-none dark:border-[#333333] rounded-xl md:rounded-2xl">
				<p className="font-bold text-base sm:text-lg">{props.title}</p>
				<Markdown className="text-sm sm:text-base">
					{props.content}
				</Markdown>
			</div>
		);
	};

	return (
		<div className="flex flex-col w-full h-full overflow-y-auto">
			<title>Home | QAT Language</title>
			<div className="flex flex-col xl:w-[1200px] lg:w-[90%] xs:w-[95%] self-center">
				<div className="flex flex-col lg:flex-row pt-2 sm:pt-2 md:pt-4 lg:h-[21rem] mb-4">
					<MobileCatchphrase />
					<div className="lg:w-[25%] w-[100%] flex flex-row lg:flex-col align-middle justify-center">
						<Image
							className="self-center xs:h-56 xs:w-auto sm:h-auto sm:w-60 lg:h-full lg:w-auto pointer-events-none select-none"
							src={lavaCapsule}
							priority
							alt="lava-cover"
						/>
						<div className="lg:hidden flex flex-col w-[65%] pl-5 sm:pl-0 sm:w-[70%]">
							<Catchphrase className="hidden font-mono text-left sm:flex sm:flex-col" />
							<AllButtons className="mt-5 flex flex-col" />
						</div>
					</div>
					<AllButtons className="lg:w-[40%] lg:flex lg:flex-col hidden" />
					<div className="lg:w-[35%] lg:ml-2 h-[100%] p-2 lg:mt-0 mt-5">
						<Examples />
					</div>
				</div>
				<div className="font-mono flex flex-row flex-grow md:text-xl h-fit w-full mt-2 mb-2 lg:mb-0">
					<div className="h-[0.12rem] flex-grow bg-black dark:bg-white opacity-20 self-center mr-8" />
					<div className="font-mono flex flex-col self-center">
						<div className="flex flex-row w-fit align-middle justify-center whitespace-pre-wrap text-[0.6rem] md:text-base">
							Created with ❤️ in <b>Kerala, India</b> 🇮🇳 by
						</div>
						<div className="flex flex-row mt-2 w-fit h-fit">
							<p className="font-bold text-sm md:text-2xl mt-1 md:mt-0 mr-4">
								Aldrin Mathew
							</p>
							<Markdown
								className="text-sm md:text-base mt-1"
								children={"[github](https://github.com/aldrinmathew)"}
							/>
						</div>
					</div>
					<Image
						className="w-20 h-20 md:w-28 md:h-28 rounded-full ml-6"
						src={aldrinImg}
						alt="Aldrin Mathew Profile Picture"
					/>
					<div className="h-[0.12rem] flex-grow bg-black dark:bg-white opacity-20 self-center ml-8" />
				</div>
				<p className="font-mono w-fit mb-1 tracking-widest font-bold text-base opacity-40 px-2 md:px-0">
					REPOSITORIES
				</p>
				<div className="grid grid-cols-2 md:flex md:flex-row mb-4 sm:mb-1 font-mono gap-2 md:gap-3 px-2 md:px-0">
					{repoList.flatMap((rep) => (
						<a href={rep.link} target="_blank">
							<div className="group cursor-pointer text-sm md:text-base px-2 py-1 bg-[#0088ff33] hover:bg-[#0088ff55] underline dark:text-[#0088ff] text-[#0055ff] hover:text-[#0000ff] dark:hover:text-[#0099ff] rounded-lg">
								{rep.name}
								<ExternalLinkIcon colored />
							</div>
						</a>
					))}
				</div>
				<div className="mx-2 mb-5 flex flex-col gap-3 sm:hidden">
					{languageFeatures.flatMap((f) => (
						<Feature title={f.title} content={f.content} />
					))}
				</div>
				<div className="hidden sm:flex sm:flex-row gap-2 lg:gap-3 w-full self-center mt-2 lg:mt-4 mb-10">
					{[
						{ a: 0, b: Math.floor(languageFeatures.length / 2) },
						{
							a: Math.floor(languageFeatures.length / 2),
							b: languageFeatures.length,
						},
					].flatMap((i) => (
						<div className="flex flex-col gap-2 lg:gap-3 w-[50%]">
							{languageFeatures.slice(i.a, i.b).flatMap((feature) => {
								return (
									<Feature
										title={feature.title}
										content={feature.content}
									/>
								);
							})}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

function Examples() {
	const [active, setActive] = useState(1);
	const size = useWindowSize();
	return (
		<>
			{
				<div className="flex flex-col font-mono">
					<div className="flex flex-row justify-end">
						<DropdownNumber
							name="Examples"
							className="w-96 lg:w-full"
							items={examples.flatMap((ex, i) => {
								return {
									name: ex.title,
									value: i,
								};
							})}
							default={active}
							disallowNone
							onChange={(val, _) => {
								setActive(val!);
							}}
						/>
					</div>
					<div
						className="shadow-lg dark:shadow-none w-full lg:max-w-[27rem] lg:h-60 border-2 border-midGray bg-[#dce7f9] dark:bg-[#303030] rounded-lg pr-1 pt-1 font-bold text-black dark:text-[#dddddd] flex flex-col align-top justify-start overflow-x-auto overflow-y-auto"
						style={{
							fontSize: size.isVertical() ? "3.3vmin" : "1.8vmin",
						}}
					>
						{examples[active].content.split("\n").map((elem, i) => (
							<div
								className="w-auto text-sm sm:text-base flex flex-row align-middle"
								key={"codeLineRow." + i.toString()}
							>
								<div className="pl-3 whitespace-pre mb-1">{elem}</div>
							</div>
						))}
					</div>
				</div>
			}
		</>
	);
}

function Catchphrase(props: { className?: string }) {
	return (
		<div className={props.className ?? "font-mono text-left"}>
			<div className="flex flex-row">
				<div className="font-bold xl:text-4xl lg:text-2xl md:text-4xl sm:text-4xl text-2xl mb-2">
					{"Closer to your machine's heart"}
				</div>
				<div className="text-4xl sm:text-6xl self-center pr-5 sm:pr-10">
					🦾
				</div>
			</div>
			<div className="pt-2 sm:pb-3 xl:text-2xl lg:text-lg md:text-2xl sm:text-xl text-sm">
				{
					"Superfast modern systems language for reliable & maintainable software..."
				}
			</div>
		</div>
	);
}

function MobileCatchphrase() {
	return (
		<div className="sm:hidden font-mono text-center mx-5">
			<div className="flex flex-row">
				<div className="font-bold lg:text-4xl md:text-4xl sm:text-2xl text-3xl mb-2">
					{"Closer to your machine's heart"}
				</div>
				<div className="text-6xl sm:text-6xl self-center sm:pr-10">🦾</div>
			</div>
			<div className="pt-2 sm:pb-3 lg:text-2xl md:text-2xl sm:text-xl text-base">
				{
					"Superfast modern systems language for reliable & maintainable software..."
				}
			</div>
		</div>
	);
}

function AllButtons(props: { className: string }) {
	const router = useRouter();
	return (
		<div className={props.className}>
			<div className="hidden lg:flex lg:flex-col">
				<Catchphrase />
			</div>
			<div className="flex flex-col sm:flex-row">
				<div className="flex flex-row mb-2 sm:mb-0">
					<Button
						style="font-mono sm:text-xl text-sm"
						onClick={() => router.push("/downloads")}
					>
						Download
					</Button>
				</div>
				<Button
					theme="special"
					style="font-mono sm:text-xl text-sm"
					onClick={() => {
						router.push("/contribute");
					}}
				>
					<svg
						className="self-center mr-2 h-6 w-6 sm:h-6 sm:w-6 xl:h-8 xl:w-8"
						viewBox="0 0 20 20"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M13.8498 0.500709C14.4808 0.500709 15.1108 0.589709 15.7098 0.790709C19.4008 1.99071 20.7308 6.04071 19.6198 9.58071C18.9898 11.3897 17.9598 13.0407 16.6108 14.3897C14.6798 16.2597 12.5608 17.9197 10.2798 19.3497L10.0298 19.5007L9.76977 19.3397C7.48077 17.9197 5.34977 16.2597 3.40077 14.3797C2.06077 13.0307 1.02977 11.3897 0.389772 9.58071C-0.740228 6.04071 0.589773 1.99071 4.32077 0.769709C4.61077 0.669709 4.90977 0.599709 5.20977 0.560709H5.32977C5.61077 0.519709 5.88977 0.500709 6.16977 0.500709H6.27977C6.90977 0.519709 7.51977 0.629709 8.11077 0.830709H8.16977C8.20977 0.849709 8.23977 0.870709 8.25977 0.889709C8.48077 0.960709 8.68977 1.04071 8.88977 1.15071L9.26977 1.32071C9.36159 1.36968 9.46466 1.44451 9.55373 1.50918C9.61017 1.55015 9.66099 1.58705 9.69977 1.61071C9.71609 1.62034 9.73268 1.63002 9.7494 1.63978C9.83514 1.68983 9.92446 1.74197 9.99977 1.79971C11.1108 0.950709 12.4598 0.490709 13.8498 0.500709ZM16.5098 7.70071C16.9198 7.68971 17.2698 7.36071 17.2998 6.93971V6.82071C17.3298 5.41971 16.4808 4.15071 15.1898 3.66071C14.7798 3.51971 14.3298 3.74071 14.1798 4.16071C14.0398 4.58071 14.2598 5.04071 14.6798 5.18971C15.3208 5.42971 15.7498 6.06071 15.7498 6.75971V6.79071C15.7308 7.01971 15.7998 7.24071 15.9398 7.41071C16.0798 7.58071 16.2898 7.67971 16.5098 7.70071Z"
							fill="#ff3300"
						/>
					</svg>
					{"Contribute"}
				</Button>
			</div>
			<div className="flex flex-row mt-5 mb-10 ml-[-0.5rem] sm:ml-0">
				<SocialIcon icon={githubIcon} link={"https://github.com/qatlang"} />
				<SocialIcon
					icon={youtubeIcon}
					link={"https://youtube.com/@aldrinmathew"}
				/>
				<SocialIcon
					icon={discordIcon}
					link={"https://discord.gg/CNW3Uvptvd"}
					color="discord"
				/>
			</div>
		</div>
	);
}
