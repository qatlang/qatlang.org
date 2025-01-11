import { useState } from "react";
import { ILanguageRelease } from "../models/interfaces";
import Markdown from "../components/Markdown";
import pb, { Tables } from "../models/pb";
import Device from "../components/Device";

export async function getServerSideProps() {
	const result = await pb
		.collection(Tables.releases)
		.getFullList<ILanguageRelease>({ sort: "-releaseDate" });
	return {
		props: {
			latestRelease: result,
		},
	};
}

function Artefact(props: {
	value: {
		id: string;
		name: string;
		downloads: number;
		platform: string;
		architecture: string;
		target: string;
		size: string;
		path: string;
	};
	releaseItemID: string;
	index: number;
	artefactCount: number;
}) {
	const Info = (props: { name: string; value: string }) => {
		return (
			<div className="flex flex-row my-1">
				<p className="">
					{props.name + ": "}
					<b>{props.value}</b>
				</p>
			</div>
		);
	};
	return (
		<div className="flex flex-col p-4 align-top justify-start text-left border-2 border-solid border-midGray rounded-2xl shadow-lg dark:shadow-none bg-white dark:bg-black">
			<div className="mb-1 sm:mb-2 font-bold text-lg sm:text-xl">
				{props.value.name}
			</div>
			<Info name="Target Triple" value={props.value.target} />
			<Info name="Size" value={props.value.size} />
			<div
				key={"downloadButton." + props.index.toString()}
				className="text-white w-fit mt-2 mb-2 px-3 py-2 font-bold transition-colors select-none flex flex-row bg-[#128f5f] rounded-xl align-middle justify-start cursor-pointer hover:bg-white hover:text-black active:bg-gray-400"
				onClick={() => {
					window.open(props.value.path, "_blank");
				}}
			>
				{"Download"}
			</div>
		</div>
	);
}

export default function Downloads(props: {
	latestRelease?: ILanguageRelease[];
}) {
	const [selection, setSelection] = useState<number>(0);
	const [showNotes, setShowNotes] = useState<boolean>(false);
	const release = props.latestRelease![0];
	const [platform, setPlatform] = useState<string | null>(null);
	if (!props.latestRelease) {
		return <div>No releases available</div>;
	}
	return (
		<div className="flex flex-col max-w-[100%] pt-8">
			<title>Downloads | QAT Programming Language</title>
			<div className="flex flex-col w-[90%] lg:max-w-[80rem] self-center">
				<div className="flex flex-row h-fit w-fit align-middle justify-center">
					<div className="font-mono font-bold rounded-lg bg-white dark:bg-black border-2 border-solid border-midGray px-4 py-2 text-xl self-center">
						v{release.version.value}
					</div>
					{release.version.isPrerelease && (
						<div className="self-center font-mono font-bold text-white bg-red-500 text-lg rounded-lg h-fit ml-4 px-2 py-1">
							{release.version.prerelease}
						</div>
					)}
				</div>
				<Device>
					{({ isWindows, isMacOs, isDesktop, isMobile }) => {
						if (platform === "all") {
							return <></>;
						}
						if (isWindows) {
							setPlatform("windows");
						} else if (isMacOs) {
							setPlatform("macOS");
						} else if (isDesktop) {
							setPlatform("linux");
						}
						return <></>;
					}}
				</Device>
				{platform && platform !== "all" && (
					<div
						className="select-none py-1 px-2 rounded-lg transition-colors bg-yellow-400 hover:bg-black dark:hover:bg-white active:bg-white dark:active:bg-black w-fit mt-6 text-left font-bold text-black hover:text-white hover:dark:text-black cursor-pointer active:text-white active:dark:text-black"
						onClick={() => {
							setPlatform("all");
						}}
					>
						Looks like your system platform is <b>{platform}</b>. To list
						all available downloads, click here
					</div>
				)}
				<div className="grid grid-cols-fluid gap-4 mt-6 mb-10">
					{release.files.flatMap((artefact, i) => {
						return (
							(platform
								? platform === "all" || artefact.platform === platform
								: true) && (
								<Artefact
									releaseItemID={release.id}
									value={artefact}
									index={i}
									artefactCount={release.files.length}
								/>
							)
						);
					})}
				</div>
				{release.title.length !== 0 && (
					<div className="mb-2 font-bold text-md sm:text-lg lg:text-xl text-left ">
						Highlights: {release.title}
					</div>
				)}
				<div
					className="flex flex-row mb-4"
					onClick={() => {
						setShowNotes(!showNotes);
					}}
				>
					<div className="self-center text-lg">Release notes</div>
					<div className="cursor-pointer ml-2 px-2 py-1 rounded-lg text-white bg-[#555555]">
						{showNotes ? "🞁" : "🞃"}
					</div>
				</div>
				{showNotes && (
					<Markdown
						className="shadow-lg dark:shadow-none text-left rounded-xl h-fit py-2 sm:py-3 px-2 sm:px-5 border-2 border-solid border-midGray bg-white dark:bg-black"
						// eslint-disable-next-line react/no-children-prop
						children={release.content}
					/>
				)}
			</div>
		</div>
	);
}
