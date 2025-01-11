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
}) {
	return (
		<ReactMarkdown
			className={props.className + " text-black dark:text-white text-left"}
			components={{
				ul: (value) => <ul className="my-2">{value.children}</ul>,
				li: (value) => <li className="my-2">• {value.children}</li>,
				p: (value) => <p className="inline my-0">{value.children}</p>,
				code: (value) => (
					<CodeBlock {...value} allowHTML={props.allowHTML ?? false} />
				),
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
