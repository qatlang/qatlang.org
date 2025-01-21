"use client";
import localFont from "next/font/local";
import { useEffect, useState, useRef, useLayoutEffect, ReactNode } from "react";
import { Env } from "../models/env";
import { CompileStatus, Position } from "../models/interfaces";

const IosevkaFont = localFont({
	src: "../fonts/IosevkaNerdFont-Regular.ttf",
	display: "swap",
});

function useSaveKey(cbFn: () => void) {
	const callback = useRef(cbFn);
	useEffect(() => {
		callback.current = cbFn;
	});
	useEffect(() => {
		function handle(event: any) {
			if (event.code === "KeyS" && event.ctrlKey) {
				event.preventDefault();
				callback.current();
			}
		}
		document.addEventListener("keydown", handle);
		return () => document.removeEventListener("keydown", handle);
	});
}

export default function Playground() {
	const [code, setCode] = useState(
		'pub main -> int [\n   say "Hello, World!".\n   give 0.\n]',
	);
	const [lineLengths, setLineLengths] = useState<number[]>(
		code.split("\n").map((line) => line.length),
	);
	const findIndexFromPosition = (pos: Position) => {
		let result = 0;
		for (let i = 0; i < pos.line - 1; i++) {
			result += lineLengths[i];
			result++;
		}
		result += pos.char;
		return result;
	};
	const [savedCode, setSavedCode] = useState("");
	const [isSaved, setIsSaved] = useState<boolean>(false);
	const [compiling, setCompiling] = useState<boolean>(false);
	const [compileError, setCompileError] = useState<string | null>(null);
	const [compileStatus, setCompileStatus] = useState<CompileStatus | null>(
		null,
	);
	const hasErrorInLine = (line: number): boolean => {
		if (compileStatus) {
			for (let i = 0; i < compileStatus.result.problems.length; i++) {
				const prob = compileStatus.result.problems[i];
				if (
					prob.hasRange &&
					prob.fileRange!.start.line <= line &&
					line <= prob.fileRange!.end.line
				) {
					return true;
				}
			}
		}
		return false;
	};
	const lineCountRef = useRef<any>(null);
	const textAreaRef = useRef<any>(null);
	const [editorHeight, setEditorHeight] = useState<number>(10);
	useEffect(() => {
		textAreaRef?.current?.focus();
	});
	useLayoutEffect(() => {
		if (lineCountRef.current.scrollHeight) {
			setEditorHeight(lineCountRef.current.scrollHeight);
		}
	}, [code]);
	useEffect(() => {
		setLineLengths(code.split("\n").map((line) => line.length));
	}, [code]);
	useEffect(() => {
		if (savedCode === code) {
			setIsSaved(true);
		} else {
			setIsSaved(false);
		}
	}, [code, savedCode]);
	const saveFunction = () => {
		if (!compiling) {
			setSavedCode(code);
			setCompiling(true);
			fetch("/api/compile", {
				method: "POST",
				cache: "no-store",
				body: JSON.stringify({
					confirmationKey: Env.confirmationKey(),
					arguments: "",
					code: code,
				}),
			})
				.then(async (res) => {
					if (res.status === 200) {
						setCompileStatus((await res.json()) as CompileStatus);
					} else {
						setCompileError(
							"Error occured while trying to compile the code. The status code of the request for compilation is " +
								res.status.toString(),
						);
					}
					setCompiling(false);
				})
				.catch((err) => {
					setCompiling(false);
					setCompileError(
						"Error occured while trying to compile the code " +
							(err ? ": " + err.toString() : ""),
					);
				});
		}
	};
	useSaveKey(saveFunction);
	return (
		<div className="flex flex-col h-full w-full px-3 pb-3">
			<title>Playground | QAT Programming Language</title>
			<div
				className="flex flex-row text-xl text-white bg-styleGreen hover:dark:bg-white hover:bg-black hover:text-white hover:dark:text-black items-center select-none h-fit w-fit rounded-lg px-3 py-1 mb-2 font-bold font-mono transition-colors"
				style={{
					cursor: isSaved ? undefined : "pointer",
					color: isSaved ? "#888888" : undefined,
					backgroundColor: isSaved ? "#77777799" : undefined,
				}}
				onClick={saveFunction}
			>
				{isSaved ? "SAVED" : "SAVE"}
				{!isSaved && (
					<p className="text-sm ml-2 bg-[#00000033] rounded-lg px-2 py-1">
						Ctrl + S
					</p>
				)}
			</div>
			<div className="flex flex-col md:flex-row h-[94%] w-full gap-3">
				<div className="flex flex-row h-[60%] md:h-full w-full md:w-[60%] overflow-auto rounded-lg border-2 border-solid border-[#777777] dark:border-[#444444]">
					<div
						ref={lineCountRef}
						className={
							"py-4 pl-4 border-2 border-solid border-transparent flex flex-col text-xl bg-white dark:bg-[#222222] text-[#666666] dark:text-[#888888] select-none whitespace-pre " +
							IosevkaFont.className
						}
					>
						{lineLengths.flatMap((_, ind) => (
							<div
								key={ind + 1}
								className="border-r-[6px] border-solid border-transparent pr-3"
								style={{
									borderColor: hasErrorInLine(ind + 1)
										? "#ff3333"
										: undefined,
								}}
							>
								{(ind + 1).toString().padStart(3, " ").slice(0, 3)}
							</div>
						))}
					</div>
					<textarea
						ref={textAreaRef}
						className={
							"p-4 w-full rounded-r-lg text-xl overflow-hidden resize-none bg-[#dce7f9] dark:bg-[#00000077] text-black dark:text-[#cccccc] caret-black dark:caret-styleGreen border-l-2 border-[#999999] dark:border-[#444444] focus:border-styleGreen dark:focus:border-styleGreen transition-colors outline-none focus:outline-none " +
							IosevkaFont.className
						}
						style={{ height: editorHeight }}
						autoFocus
						defaultValue={code}
						onChange={(val) => {
							setCode(val.target.value);
						}}
					/>
				</div>
				<div className="flex flex-col h-[40%] md:h-full w-full md:w-[40%] border-2 border-solid border-midGray rounded-lg">
					<div className="py-3 px-4 font-mono h-fit rounded-t-lg bg-white dark:bg-[#222222] border-b-2 border-solid border-midGray font-bold text-left text-base whitespace-pre-wrap">
						{compiling || compileStatus || compileError ? (
							compiling ? (
								<div className="flex flex-row items-center">
									<LoadingIcon /> Running...
								</div>
							) : compileError === null &&
							  compileStatus &&
							  compileStatus.result.status ? (
								<div className="flex flex-row items-center">
									<div className="w-5 h-5 rounded bg-styleGreen mr-3" />
									SUCCESS{" "}
									<pre className="text-sm py-1 px-2 border-[1px] border-solid border-midGray rounded-lg">
										{compileStatus!.result.compilationTime / 1000000}{" "}
										seconds
									</pre>
								</div>
							) : (
								<div className="flex flex-row items-center">
									<div className="w-5 h-5 rounded bg-red-500 mr-3" />
									FAILED
								</div>
							)
						) : (
							<p>Save to run the code & see output</p>
						)}
					</div>
					<div className="flex flex-col flex-grow rounded-b-lg overflow-y-auto bg-white dark:bg-[#222222]">
						{compileError && (
							<div className="bg-red-700 text-white text-justify py-2 px-4 mb-1">
								{compileError}
							</div>
						)}
						{compileStatus && (
							<div>
								{(compileStatus.prematureKill ||
									compileStatus.overflowedOutput) && (
									<div className="text-justify text-white bg-red-700 py-2 px-4 mb-1">
										{compileStatus.prematureKill && (
											<p>
												Program reached the execution limit of 5
												seconds.
											</p>
										)}
										{compileStatus.overflowedOutput && (
											<p>
												Program reached the output size limit of 2
												megabytes.
											</p>
										)}
										<p>
											The output displayed here might not reflect the
											complete output you would get if you ran the
											code in your machine.
										</p>
									</div>
								)}
								{compileStatus.result.problems.flatMap((prob, i) => {
									const problemSelector = () => {
										if (textAreaRef.current && prob.hasRange) {
											textAreaRef.current.focus();
											textAreaRef.current.selectionStart =
												findIndexFromPosition(
													prob.fileRange!.start,
												);
											textAreaRef.current.selectionEnd =
												findIndexFromPosition(prob.fileRange!.end);
										}
									};
									return (
										<div
											key={i}
											className="text-left py-2 px-4 mb-2 cursor-pointer flex flex-col border-l-8 hover:border-l-[16px] transition-all border-solid"
											style={{
												borderColor: prob.isError
													? "#ef4444"
													: "violet",
											}}
											onMouseEnter={problemSelector}
											onClick={problemSelector}
										>
											<p
												className="font-mono text-xl mb-1"
												style={{
													color: prob.isError
														? "#ef4444"
														: "violet",
												}}
											>
												{prob.isError ? "ERROR" : "WARNING"}
											</p>
											<p className="text-justify">{prob.message}</p>
											{prob.hasRange && (
												<p className="italic text-sm mt-1 font-mono">
													{prob.fileRange!.start.line}:
													{prob.fileRange!.start.char} -{" "}
													{prob.fileRange!.end.line}:
													{prob.fileRange!.end.char}
												</p>
											)}
										</div>
									);
								})}
								{compileStatus.output && (
									<div className="text-left py-4 px-2 font-mono">
										<p className="select-none font-bold tracking-widest text-lg mb-2 pl-2">
											OUTPUT
										</p>
										<pre className="bg-[#dce7f9] dark:bg-black px-4 py-2 rounded-lg">
											{compileStatus.output}
										</pre>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

function LoadingIcon() {
	return (
		<svg
			className="h-6 w-6 animate-spin"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				className="fill-black dark:fill-white"
				d="M7.706 0.290 C 7.484 0.362,7.356 0.490,7.294 0.699 C 7.259 0.816,7.253 1.088,7.253 2.508 C 7.253 4.389,7.251 4.365,7.443 4.557 C 7.700 4.813,8.300 4.813,8.557 4.557 C 8.749 4.365,8.747 4.389,8.747 2.508 C 8.747 0.688,8.744 0.656,8.596 0.480 C 8.472 0.333,8.339 0.284,8.040 0.276 C 7.893 0.272,7.743 0.278,7.706 0.290 M2.753 2.266 C 2.595 2.338,2.362 2.566,2.281 2.728 C 2.197 2.897,2.193 3.085,2.269 3.253 C 2.343 3.418,4.667 5.750,4.850 5.843 C 5.109 5.976,5.375 5.911,5.643 5.649 C 5.907 5.391,5.977 5.111,5.843 4.850 C 5.750 4.667,3.418 2.343,3.253 2.269 C 3.101 2.200,2.901 2.199,2.753 2.266 M12.853 2.282 C 12.730 2.339,12.520 2.536,11.518 3.541 C 10.597 4.464,10.316 4.762,10.271 4.860 C 10.195 5.025,10.196 5.216,10.272 5.378 C 10.342 5.528,10.572 5.764,10.727 5.845 C 10.884 5.927,11.117 5.926,11.280 5.843 C 11.447 5.757,13.757 3.447,13.843 3.280 C 13.926 3.118,13.927 2.884,13.846 2.729 C 13.764 2.572,13.552 2.364,13.392 2.283 C 13.213 2.192,13.048 2.192,12.853 2.282 M0.699 7.292 C 0.404 7.385,0.258 7.620,0.258 7.999 C 0.259 8.386,0.403 8.618,0.698 8.706 C 0.816 8.741,1.079 8.747,2.508 8.747 C 3.997 8.747,4.196 8.742,4.318 8.702 C 4.498 8.644,4.644 8.498,4.702 8.318 C 4.788 8.053,4.745 7.677,4.608 7.491 C 4.578 7.451,4.492 7.384,4.417 7.343 L 4.280 7.267 2.547 7.261 C 1.152 7.257,0.791 7.263,0.699 7.292 M11.745 7.278 C 11.622 7.308,11.452 7.411,11.392 7.492 C 11.255 7.677,11.212 8.053,11.298 8.318 C 11.356 8.498,11.502 8.644,11.682 8.702 C 11.804 8.742,12.003 8.747,13.492 8.747 C 14.921 8.747,15.184 8.741,15.302 8.706 C 15.597 8.618,15.741 8.386,15.742 7.999 C 15.742 7.614,15.595 7.383,15.290 7.291 C 15.187 7.260,14.864 7.254,13.496 7.256 C 12.578 7.258,11.790 7.268,11.745 7.278 M4.853 10.282 C 4.730 10.339,4.520 10.536,3.518 11.541 C 2.597 12.464,2.316 12.762,2.271 12.860 C 2.195 13.025,2.196 13.216,2.272 13.378 C 2.342 13.528,2.572 13.764,2.727 13.845 C 2.884 13.927,3.117 13.926,3.280 13.843 C 3.447 13.757,5.757 11.447,5.843 11.280 C 5.926 11.118,5.927 10.884,5.846 10.729 C 5.764 10.572,5.552 10.364,5.392 10.283 C 5.213 10.192,5.048 10.192,4.853 10.282 M10.753 10.266 C 10.595 10.338,10.362 10.566,10.281 10.728 C 10.197 10.897,10.193 11.085,10.269 11.253 C 10.343 11.418,12.667 13.750,12.850 13.843 C 13.109 13.976,13.375 13.911,13.643 13.649 C 13.907 13.391,13.977 13.111,13.843 12.850 C 13.750 12.667,11.418 10.343,11.253 10.269 C 11.101 10.200,10.901 10.199,10.753 10.266 M7.745 11.277 C 7.620 11.309,7.451 11.412,7.392 11.492 C 7.254 11.678,7.253 11.691,7.253 13.489 C 7.253 14.921,7.259 15.184,7.294 15.302 C 7.382 15.597,7.615 15.741,8.000 15.741 C 8.385 15.741,8.618 15.597,8.706 15.302 C 8.768 15.090,8.767 11.875,8.704 11.690 C 8.644 11.514,8.575 11.430,8.420 11.346 C 8.310 11.286,8.246 11.271,8.057 11.264 C 7.930 11.259,7.790 11.265,7.745 11.277 "
				stroke="none"
				fill-rule="evenodd"
			></path>
		</svg>
	);
}
