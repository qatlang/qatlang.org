import dynamic from "next/dynamic";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { CodeProps } from "react-markdown/lib/ast-to-react";
import "react-toastify/dist/ReactToastify.css";
import localFont from "next/font/local";
import rehypeRaw from "rehype-raw";
import { useRouter } from "next/router";

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
				"inline border border-solid bg-gray-100 border-midGray dark:bg-[#3d434d] rounded-md px-1 " +
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
				className="text-left block overflow-x-auto bg-[#dce7f9] border-midGray dark:bg-[#2f383e] p-3 rounded-t-lg rounded-br-lg border-2 transition-colors"
				dangerouslySetInnerHTML={
					props.allowHTML
						? { __html: props.children.toString() }
						: undefined
				}
			>
				{props.allowHTML ? undefined : props.children}
			</div>
			<div
				className="font-bold place-self-start select-none transition-colors w-fit px-1 py-[0.05rem] bg-gray-600 text-white dark:bg-gray-400 dark:text-black text-sm rounded-b-md cursor-pointer hover:bg-black hover:text-white active:bg-white hover:dark:bg-white hover:dark:text-black active:dark:bg-black"
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
				ul: (value) => <ul className="my-2">{value.children}</ul>,
				li: (value) => <li className="my-2">• {value.children}</li>,
				p: (value) => (
					<p className="my-3" {...value}>
						{value.children}
					</p>
				),
				code: (value) => (
					<CodeBlock {...value} allowHTML={props.allowHTML ?? false} />
				),
				a: (value) => {
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
							className="group inline px-2 py-1 bg-[#0055ff33] hover:bg-[#0055ff55] underline text-[#0055ff] hover:text-[#0000ff] dark:hover:text-[#0099ff] rounded-lg"
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
									className="inline h-5 w-5 mr-1 stroke-[#0055ff] group-hover:stroke-[#0000ff] dark:group-hover:stroke-[#0099ff]"
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
							{!isInsideLink && (
								<svg
									className="inline h-5 w-5 ml-1 stroke-[#0055ff] group-hover:stroke-[#0000ff] dark:group-hover:stroke-[#0099ff]"
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
							)}
						</a>
					);
				},
				img: (value) => (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						className="my-4 rounded-2xl max-w-[100%]"
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
