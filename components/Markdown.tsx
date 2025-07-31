import dynamic from "next/dynamic";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { CodeProps } from "react-markdown/lib/ast-to-react";
import "react-toastify/dist/ReactToastify.css";
import localFont from "next/font/local";
import rehypeRaw from "rehype-raw";

const IosevkaFont = localFont({
	src: "../fonts/IosevkaNerdFont-Regular.ttf",
	display: "swap",
});

export default dynamic(() => Promise.resolve(Markdown), { ssr: false });

export function CodeBlock(props: CodeProps & { allowHTML: boolean }) {
	let [copied, setCopied] = useState<"copied" | "error" | null>(null);
	return props.inline ? (
		<pre
			className={
				"inline h-fit border border-solid bg-gray-100 border-midGray dark:bg-[#3d434d] rounded-md px-1 py-[0.13rem] mx-1 " +
				IosevkaFont.className
			}
			dangerouslySetInnerHTML={
				props.allowHTML ? { __html: props.children.toString() } : undefined
			}
		>
			{props.allowHTML ? undefined : props.children}
		</pre>
	) : (
		<div className={"my-4 flex flex-col " + IosevkaFont.className}>
			<div
				className="text-left block overflow-x-auto bg-[#dce7f9] border-midGray dark:bg-[#2f383e] p-3 rounded-t-lg rounded-br-lg border-2"
				dangerouslySetInnerHTML={
					props.allowHTML
						? { __html: props.children.toString() }
						: undefined
				}
			>
				{props.allowHTML ? undefined : props.children}
			</div>
			<div
				className="font-bold place-self-start select-none w-fit px-1 py-[0.05rem] bg-gray-600 text-white dark:bg-gray-400 dark:text-black text-sm rounded-b-md cursor-pointer hover:bg-black hover:text-white active:bg-white hover:dark:bg-white hover:dark:text-black active:dark:bg-black"
				style={{
					backgroundColor:
						copied === "copied"
							? "#128f5f"
							: copied === "error"
								? "red"
								: undefined,
					color: copied ? "white" : undefined,
				}}
				onClick={async () => {
					try {
						if (
							navigator &&
							navigator.clipboard &&
							window.isSecureContext
						) {
							await navigator.clipboard.writeText(
								props.children.map((c) => c?.toString()).join(),
							);
							setCopied("copied");
							setTimeout(() => {
								setCopied(null);
							}, 2000);
						} else {
							setCopied("error");
							setTimeout(() => {
								setCopied(null);
							}, 2000);
						}
					} catch (e: any) {
						console.log("Error while copying code block");
					}
				}}
			>
				{copied ? "✓ Copied" : "Copy"}
			</div>
		</div>
	);
}

function getHeaderId(value: string) {
	let id = "";
	for (let i = 0; i < value.length; i++) {
		if (
			(value.charCodeAt(i) > 47 && value.charCodeAt(i) < 58) ||
			(value.charCodeAt(i) > 64 && value.charCodeAt(i) < 91) ||
			(value.charCodeAt(i) > 96 && value.charCodeAt(i) < 123) ||
			value.charCodeAt(i) === "_".charCodeAt(0)
		) {
			id += value[i];
		} else if (value[i] === " " && !id.endsWith("_")) {
			id += "_";
		}
	}
	id = id.toLowerCase();
	return id;
}

export function Markdown(props: {
	className?: string;
	children: string;
	allowHTML?: boolean;
	highlightCandidates?: string[];
	currentURL?: string;
}) {
	return (
		<ReactMarkdown
			className={props.className + " text-black dark:text-white text-left"}
			components={{
				ul: (value) => <ul className="my-2" {...value} />,
				li: (value) => {
					const hasBlankCheckbox =
						(value.children as any[]).length > 0 &&
						typeof (value.children as any[])[0] === "string" &&
						(value.children as any[])[0].startsWith("[ ] ");
					const hasTickedCheckbox =
						(value.children as any[]).length > 0 &&
						typeof (value.children as any[])[0] === "string" &&
						(value.children as any[])[0].toLowerCase().startsWith("[x] ");
					return (
						<li className="my-2 flex flex-row" {...value}>
							<pre className="whitespace-pre inline opacity-70">
								{value.ordered
									? (value.index + 1).toString() + ". "
									: "-> "}
							</pre>
							<div>
								{(hasBlankCheckbox || hasTickedCheckbox) && (
									<input
										className="mr-2 h-4 w-4 self-center"
										type="checkbox"
										checked={hasTickedCheckbox}
									/>
								)}
								{hasBlankCheckbox || hasTickedCheckbox
									? [
											(value.children as string[])[0].substring(4),
											...value.children.toSpliced(0, 1),
										]
									: value.children}
							</div>
						</li>
					);
				},
				h1: (value) => {
					const id = getHeaderId((value.children as any[]).join("_"));
					return (
						<h1
							id={id}
							className="text-5xl font-bold mt-5 mb-3"
							{...value}
						/>
					);
				},
				h2: (value) => {
					const id = getHeaderId((value.children as any[]).join("_"));
					return (
						<h2
							id={id}
							className="text-4xl font-bold mt-5 mb-3"
							{...value}
						/>
					);
				},
				h3: (value) => {
					const id = getHeaderId((value.children as any[]).join("_"));
					return (
						<h3
							id={id}
							className="text-3xl font-bold mt-5 mb-3"
							{...value}
						/>
					);
				},
				h4: (value) => {
					const id = getHeaderId((value.children as any[]).join("_"));
					return (
						<h4
							id={id}
							className="text-2xl font-bold mt-4 mb-2"
							{...value}
						/>
					);
				},
				h5: (value) => {
					const id = getHeaderId((value.children as any[]).join("_"));
					return (
						<h5
							id={id}
							className="text-xl font-bold mt-4 mb-2"
							{...value}
						/>
					);
				},
				h6: (value) => {
					const id = getHeaderId((value.children as any[]).join("_"));
					return (
						<h6
							id={id}
							className="text-lg font-bold mt-3 mb-1"
							{...value}
						/>
					);
				},
				p: (value) => {
					const hasBlankCheckbox =
						(value.children as any[]).length > 0 &&
						typeof (value.children as any[])[0] === "string" &&
						(value.children as any[])[0].startsWith("[ ] ");
					const hasTickedCheckbox =
						(value.children as any[]).length > 0 &&
						typeof (value.children as any[])[0] === "string" &&
						(value.children as any[])[0].toLowerCase().startsWith("[x] ");
					const hasAlert =
						(value.children as any[]).length > 0 &&
						typeof (value.children as any[])[0] === "string" &&
						(value.children as any[])[0].toLowerCase().startsWith("[!");
					let alertType: string = "";
					let alertColor: string | undefined = undefined;
					if (hasAlert) {
						const stringCand = (value.children as any[])[0].toLowerCase();
						if (stringCand.startsWith("[!note]")) {
							alertType = "Note";
							alertColor = "#00b3ff";
						} else if (stringCand.startsWith("[!tip]")) {
							alertType = "Tip";
							alertColor = "#4db800";
						} else if (stringCand.startsWith("[!important]")) {
							alertType = "Important";
							alertColor = "#947eff";
						} else if (stringCand.startsWith("[!warning]")) {
							alertType = "Warning";
							alertColor = "#ff8733";
						} else if (stringCand.startsWith("[!caution]")) {
							alertType = "Caution";
							alertColor = "#ff3333";
						} else {
							alertType = stringCand.substring(
								2,
								stringCand.indexOf("]"),
							);
						}
					}

					return hasBlankCheckbox || hasTickedCheckbox ? (
						<div className="flex flex-row mb-2" {...value}>
							<input
								className="mr-2 h-4 w-4 self-center"
								type="checkbox"
								checked={hasTickedCheckbox}
							/>
							<p className={""}>
								{[
									(value.children as string[])[0].substring(4),
									...value.children.toSpliced(0, 1),
								]}
							</p>
						</div>
					) : hasAlert ? (
						<p
							className="my-4 shadow-lg border-l-[6px] border-2 border-midGray border-solid pl-4 border-l-black dark:border-l-white bg-white dark:bg-black py-2 rounded-lg"
							style={{ borderLeftColor: alertColor }}
							{...value}
						>
							<p
								className="font-bold text-xl font-mono mb-2"
								style={{ color: alertColor }}
							>
								{alertType === "Note" ? (
									<NoteIcon color={alertColor} />
								) : alertType === "Tip" ? (
									<TipIcon color={alertColor} />
								) : alertType === "Important" ? (
									<ImportantIcon color={alertColor} />
								) : alertType === "Warning" ? (
									<WarningIcon color={alertColor} />
								) : alertType === "Caution" ? (
									<CautionIcon color={alertColor} />
								) : (
									"!"
								)}
								{alertType}
							</p>
							{[
								(value.children as string[])[0].substring(
									(value.children as string[])[0].indexOf("]") + 1,
								),
								...value.children.toSpliced(0, 1),
							]}
						</p>
					) : (
						<p className="mb-2" {...value} />
					);
				},
				code: (value) => (
					<CodeBlock {...value} allowHTML={props.allowHTML ?? false} />
				),
				a: (value) => {
					if (value.href !== undefined && value.href.startsWith("#")) {
						return (
							<div
								className="inline-block mb-1 mx-1 px-2 bg-[#0088ff33] hover:bg-[#0088ff55] dark:text-[#0088ff] text-[#0055ff] hover:text-[#0000ff] dark:hover:text-[#0099ff] rounded-lg cursor-pointer"
								onClick={() => {
									if (document) {
										document
											.getElementById(value.href!.substring(1))
											?.scrollIntoView();
									}
								}}
							>
								{value.children}
								<svg
									className="h-7 w-7 inline"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										className="stroke-[#0055ff] dark:stroke-[#0088ff] hover:stroke-[#0000ff] dark:hover:stroke-[#0099ff]"
										d="M7 8L9 8C11.2091 8 13 9.79086 13 12L13 17"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										className="stroke-[#0055ff] dark:stroke-[#0088ff] hover:stroke-[#0000ff] dark:hover:stroke-[#0099ff]"
										d="M16 14L13 17L10 14"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</div>
						);
					} else {
						const isInsideLink =
							value.href !== undefined &&
							!value.href.startsWith("http://") &&
							!value.href.startsWith("https://");
						let usableHREF = value.href;
						if (isInsideLink && props.currentURL) {
							let rootSplit = props.currentURL!.split("/");
							let linkSplit = value.href!.split("/");
							let delInd = 0;
							for (let i = 0; i < linkSplit.length; i++) {
								if (linkSplit[i] === "..") {
									rootSplit = rootSplit.toSpliced(
										rootSplit.length - 1,
										1,
									);
									delInd++;
								} else if (linkSplit[i] === "") {
									delInd++;
								} else {
									break;
								}
							}
							linkSplit = linkSplit.toSpliced(0, delInd);
							usableHREF = [...rootSplit, ...linkSplit].join("/");
						}
						return (
							<a
								className="group inline mx-1 px-2 py-1 bg-[#0088ff33] hover:bg-[#0088ff55] underline dark:text-[#0088ff] text-[#0055ff] hover:text-[#0000ff] dark:hover:text-[#0099ff] rounded-lg"
								{...{
									...value,
									href: usableHREF,
									target:
										value.target ??
										(isInsideLink ? undefined : "_blank"),
								}}
							>
								{isInsideLink && (
									<svg
										className="inline h-5 w-5 mr-1 stroke-[#0088ff] group-hover:stroke-[#0000ff] dark:group-hover:stroke-[#0099ff]"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M9.16488 17.6505C8.92513 17.8743 8.73958 18.0241 8.54996 18.1336C7.62175 18.6695 6.47816 18.6695 5.54996 18.1336C5.20791 17.9361 4.87912 17.6073 4.22153 16.9498C3.56394 16.2922 3.23514 15.9634 3.03767 15.6213C2.50177 14.6931 2.50177 13.5495 3.03767 12.6213C3.23514 12.2793 3.56394 11.9505 4.22153 11.2929L7.04996 8.46448C7.70755 7.80689 8.03634 7.47809 8.37838 7.28062C9.30659 6.74472 10.4502 6.74472 11.3784 7.28061C11.7204 7.47809 12.0492 7.80689 12.7068 8.46448C13.3644 9.12207 13.6932 9.45086 13.8907 9.7929C14.4266 10.7211 14.4266 11.8647 13.8907 12.7929C13.7812 12.9825 13.6314 13.1681 13.4075 13.4078M10.5919 10.5922C10.368 10.8319 10.2182 11.0175 10.1087 11.2071C9.57284 12.1353 9.57284 13.2789 10.1087 14.2071C10.3062 14.5492 10.635 14.878 11.2926 15.5355C11.9502 16.1931 12.279 16.5219 12.621 16.7194C13.5492 17.2553 14.6928 17.2553 15.621 16.7194C15.9631 16.5219 16.2919 16.1931 16.9495 15.5355L19.7779 12.7071C20.4355 12.0495 20.7643 11.7207 20.9617 11.3787C21.4976 10.4505 21.4976 9.30689 20.9617 8.37869C20.7643 8.03665 20.4355 7.70785 19.7779 7.05026C19.1203 6.39267 18.7915 6.06388 18.4495 5.8664C17.5212 5.3305 16.3777 5.3305 15.4495 5.8664C15.2598 5.97588 15.0743 6.12571 14.8345 6.34955"
											stroke-width="2"
											stroke-linecap="round"
										/>
									</svg>
								)}
								{value.children}
								{!isInsideLink && <ExternalLinkIcon colored />}
							</a>
						);
					}
				},
				img: (value) => (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						className="my-4 rounded-lg max-w-[100%]"
						alt={
							value.src?.startsWith("image:")
								? "/api/images?id=" +
									value.src!.substring("image:".length)
								: value.src!
						}
						src={
							value.src?.startsWith("image:")
								? "/api/images?id=" +
									value.src!.substring("image:".length)
								: value.src!
						}
					/>
				),
			}}
			rehypePlugins={[rehypeRaw] as any}
			skipHtml={!props.allowHTML}
			// eslint-disable-next-line react/no-children-prop
			children={props.children}
		/>
	);
}

export function ExternalLinkIcon(props: { colored?: boolean }) {
	return (
		<svg
			className={
				props.colored
					? "inline h-5 w-5 ml-1 stroke-[#0066ff] group-hover:stroke-[#0000ff] dark:group-hover:stroke-[#0099ff]"
					: "inline h-5 w-5 ml-1 stroke-black dark:stroke-white opacity-70"
			}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g id="Interface / External_Link">
				<path
					id="Vector"
					d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</g>
		</svg>
	);
}

function NoteIcon(props: { color?: string }) {
	return (
		<svg
			className="h-8 w-8 inline mr-2"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				className="fill-black dark:fill-white"
				d="M12.6761 19.9589C12.9508 20.0228 12.976 20.3827 12.7084 20.4719L11.1284 20.9919C7.15839 22.2719 5.06839 21.2019 3.77839 17.2319L2.49839 13.2819C1.21839 9.31187 2.27839 7.21187 6.24839 5.93187L6.77238 5.75834C7.17525 5.62493 7.56731 6.02899 7.45292 6.43766C7.39622 6.64023 7.34167 6.85164 7.28839 7.07188L6.30839 11.2619C5.20839 15.9719 6.81839 18.5719 11.5284 19.6919L12.6761 19.9589Z"
				style={{ fill: props.color }}
			/>
			<path
				className="fill-black dark:fill-white"
				d="M17.1702 3.20854L15.5002 2.81854C12.1602 2.02854 10.1702 2.67854 9.00018 5.09854C8.70018 5.70854 8.46018 6.44854 8.26018 7.29854L7.28018 11.4885C6.30018 15.6685 7.59018 17.7285 11.7602 18.7185L13.4402 19.1185C14.0202 19.2585 14.5602 19.3485 15.0602 19.3885C18.1802 19.6885 19.8402 18.2285 20.6802 14.6185L21.6602 10.4385C22.6402 6.25854 21.3602 4.18854 17.1702 3.20854ZM15.2902 13.3285C15.2002 13.6685 14.9002 13.8885 14.5602 13.8885C14.5002 13.8885 14.4402 13.8785 14.3702 13.8685L11.4602 13.1285C11.0602 13.0285 10.8202 12.6185 10.9202 12.2185C11.0202 11.8185 11.4302 11.5785 11.8302 11.6785L14.7402 12.4185C15.1502 12.5185 15.3902 12.9285 15.2902 13.3285ZM18.2202 9.94854C18.1302 10.2885 17.8302 10.5085 17.4902 10.5085C17.4302 10.5085 17.3702 10.4985 17.3002 10.4885L12.4502 9.25854C12.0502 9.15854 11.8102 8.74854 11.9102 8.34854C12.0102 7.94854 12.4202 7.70854 12.8202 7.80854L17.6702 9.03854C18.0802 9.12854 18.3202 9.53854 18.2202 9.94854Z"
				style={{ fill: props.color }}
			/>
		</svg>
	);
}

function TipIcon(props: { color?: string }) {
	return (
		<svg
			className="h-8 w-8 inline mr-2"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
		>
			<path
				className="stroke-black dark:stroke-white"
				style={{ stroke: props.color }}
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 18v-.107c0-.795-.496-1.488-1.117-1.984a5 5 0 1 1 6.235 0c-.622.497-1.118 1.189-1.118 1.984V18m-4 0v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2m-4 0h4m6-6h1M4 12H3m9-8V3m5.657 3.343.707-.707m-12.02.707-.708-.707M12 15v-2"
			/>
		</svg>
	);
}

function ImportantIcon(props: { color?: string }) {
	return (
		<svg
			className="h-8 w-8 inline mr-2 fill-black dark:fill-white"
			style={{ fill: props.color }}
			viewBox="0 0 32 32"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M1.728 20.992q-0.416 1.6 0.416 3.008 0.832 1.44 2.432 1.856t3.040-0.384q0.832-0.48 2.56-1.92t3.168-2.912q-0.608 2.016-0.96 4.192t-0.384 3.168q0 1.664 1.184 2.848t2.816 1.152 2.816-1.152 1.184-2.848q0-0.96-0.384-3.168t-0.928-4.192q1.44 1.504 3.168 2.944t2.528 1.888q1.44 0.832 3.040 0.384t2.432-1.856 0.416-3.008-1.888-2.464q-0.864-0.48-2.944-1.248t-4.064-1.28q2.016-0.512 4.096-1.28t2.912-1.248q1.44-0.832 1.888-2.432t-0.416-3.040q-0.832-1.44-2.432-1.856t-3.040 0.384q-0.832 0.512-2.528 1.92t-3.168 2.912q0.576-1.984 0.928-4.192t0.384-3.168q0-1.632-1.184-2.816t-2.816-1.184-2.816 1.184-1.184 2.816q0 0.992 0.384 3.168t0.96 4.192q-1.44-1.472-3.168-2.88t-2.56-1.952q-1.44-0.8-3.040-0.384t-2.432 1.856-0.416 3.040 1.888 2.432q0.832 0.48 2.912 1.248t4.128 1.28q-2.016 0.512-4.096 1.28t-2.944 1.248q-1.44 0.832-1.888 2.464z"></path>
		</svg>
	);
}

function WarningIcon(props: { color?: string }) {
	return (
		<svg
			className="h-8 w-8 inline mr-2"
			viewBox="0 0 512 512"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g
				id="Page-1"
				stroke="none"
				stroke-width="1"
				fill="none"
				fill-rule="evenodd"
			>
				<g
					id="add"
					className="fill-black dark:fill-white"
					style={{ fill: props.color }}
					transform="translate(32.000000, 42.666667)"
				>
					<path
						d="M246.312928,5.62892705 C252.927596,9.40873724 258.409564,14.8907053 262.189374,21.5053731 L444.667042,340.84129 C456.358134,361.300701 449.250007,387.363834 428.790595,399.054926 C422.34376,402.738832 415.04715,404.676552 407.622001,404.676552 L42.6666667,404.676552 C19.1025173,404.676552 7.10542736e-15,385.574034 7.10542736e-15,362.009885 C7.10542736e-15,354.584736 1.93772021,347.288125 5.62162594,340.84129 L188.099293,21.5053731 C199.790385,1.04596203 225.853517,-6.06216498 246.312928,5.62892705 Z M224,272 C208.761905,272 197.333333,283.264 197.333333,298.282667 C197.333333,313.984 208.415584,325.248 224,325.248 C239.238095,325.248 250.666667,313.984 250.666667,298.624 C250.666667,283.264 239.238095,272 224,272 Z M245.333333,106.666667 L202.666667,106.666667 L202.666667,234.666667 L245.333333,234.666667 L245.333333,106.666667 Z"
						id="Combined-Shape"
					></path>
				</g>
			</g>
		</svg>
	);
}

function CautionIcon(props: { color?: string }) {
	return (
		<svg
			className="h-8 w-8 inline mr-2"
			version="1.1"
			id="_x32_"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 512 512"
		>
			<g>
				<path
					className="fill-black dark:fill-white"
					style={{ fill: props.color }}
					d="M387.317,0.005H284.666h-57.332h-102.65L0,124.688v102.67v57.294v102.67l124.684,124.674h102.65h57.332
		h102.651L512,387.321v-102.67v-57.294v-102.67L387.317,0.005z M255.45,411.299c-19.082,0-34.53-15.467-34.53-34.549
		c0-19.053,15.447-34.52,34.53-34.52c19.082,0,34.53,15.467,34.53,34.52C289.98,395.832,274.532,411.299,255.45,411.299z
		 M283.414,278.692c0,15.448-12.516,27.964-27.964,27.964c-15.458,0-27.964-12.516-27.964-27.964l-6.566-135.368
		c0-19.072,15.447-34.54,34.53-34.54c19.082,0,34.53,15.467,34.53,34.54L283.414,278.692z"
				/>
			</g>
		</svg>
	);
}
