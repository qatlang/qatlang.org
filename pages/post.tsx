import { useEffect, useState } from "react";
import pb from "../models/pb";
import router from "next/router";
import dynamic from "next/dynamic";
import Markdown from "../components/Markdown";
import { useFilePicker } from "use-file-picker";
import { addImageToDB, removeImageByID } from "../utils/imageUtils";
import { dataUrlToBlob } from "../utils/dataUrlToBlob";
import { Env } from "../models/env";

export default dynamic(() => Promise.resolve(Post), { ssr: false });

export interface INewImage {
	name: string;
	mimeType: string;
	content: string;
	id: string;
}

function Post() {
	const [title, setTitle] = useState<string>("");
	const [content, setContent] = useState<string>("");
	const [preview, setPreview] = useState<boolean>(false);
	const { openFilePicker, filesContent, loading, clear } = useFilePicker({
		accept: "image/*",
		multiple: true,
		readAs: "DataURL",
	});
	const [images, setImages] = useState<INewImage[]>([]);
	useEffect(() => {
		if (!(pb.authStore.isValid && pb.authStore.isAdmin)) {
			router.push("/admin?redirect=post");
		}
	}, []);
	useEffect(() => {
		filesContent.map((it) => {
			const mimeType = it.content.substring(
				it.content.indexOf(":") + 1,
				it.content.indexOf(";"),
			);
			addImageToDB(it.name, it.content).then((res) => {
				if (res) {
					setImages([
						...images,
						{
							name: it.name,
							mimeType: mimeType,
							content: it.content,
							id: res.id,
						},
					]);
				}
			});
		});
	}, [filesContent]);
	return (
		<div className="flex flex-col w-[100%] h-[100%]">
			<title>Post | QAT Programming Language</title>
			{pb.authStore.isValid && pb.authStore.isAdmin && (
				<div className="w-[90%] pt-10 self-center flex flex-col">
					<p className="text-xl font-mono font-bold text-left mb-10">
						Add post
					</p>
					<input
						name="Title"
						placeholder="Title"
						type="text"
						value={title}
						onChange={(ev) => {
							setTitle(ev.target.value);
						}}
						className="py-2 px-4 mb-5 text-lg border-2 border-solid rounded-xl h-14 border-midGray"
					></input>
					<div className="flex flex-row mb-2">
						<div
							onClick={() => {
								setPreview(false);
							}}
							style={{
								backgroundColor: preview ? undefined : "#128f5f",
							}}
							className="px-3 py-2 w-fit font-mono font-bold cursor-pointer rounded-l-xl mb-4 border-r-4 border-solid border-white dark:border-black dark:bg-gray-500 bg-gray-400 text-white"
						>
							Edit
						</div>
						<div
							onClick={() => {
								setPreview(true);
							}}
							style={{
								backgroundColor: preview ? "#128f5f" : undefined,
							}}
							className="px-3 py-2 w-fit font-mono font-bold cursor-pointer rounded-r-xl mb-4 dark:bg-gray-500 bg-gray-400 text-white"
						>
							Preview
						</div>
						<div
							className="py-2 px-4 font-mono font-bold rounded-xl ml-4 h-fit bg-styleGreen hover:bg-black dark:hover:bg-white text-white select-none cursor-pointer dark:hover:text-black active:bg-white active:dark:bg-black w-fit"
							onClick={() => {
								openFilePicker();
							}}
						>
							Add image
						</div>
					</div>
					{images.length > 0 && (
						<div className="flex flex-row py-5 mb-5 overflow-x-auto">
							{images.flatMap((it, ind) => {
								return (
									<div
										key={ind}
										className="mr-2 w-40 p-4 border-2 border-solid rounded-xl border-midGray"
									>
										<img
											className="w-32 h-32 object-cover mb-1 hover:opacity-80 active:opacity-50"
											onClick={() => {
												if (
													navigator &&
													navigator.clipboard &&
													window.isSecureContext
												) {
													navigator.clipboard.writeText(
														`![${it.name}](image:${it.id})`,
													);
												}
											}}
											alt={it.name}
											src={it.content}
										></img>
										<p className="mb-2 text-sm font-bold">
											{it.name}
										</p>
										<div
											onClick={async () => {
												const removed = await removeImageByID(
													it.id,
												);
												if (removed) {
													setImages([
														...images.slice(0, ind),
														...images.slice(ind + 1),
													]);
												}
											}}
											className="px-2 py-1 text-sm font-bold bg-red-600 select-none cursor-pointer active:bg-white hover:bg-black hover:text-white hover:dark:bg-white hover:dark:text-black active:dark:bg-black text-white active:dark:text-black rounded-lg"
										>
											Remove
										</div>
									</div>
								);
							})}
						</div>
					)}
					<div className="h-[30vh] w-[100%]">
						{preview && (
							<Markdown className="p-4 overflow-y-auto bg-white dark:bg-black rounded-xl border-2 border-solid border-midGray h-[100%] w-[100%]">
								{content}
							</Markdown>
						)}
						{!preview && (
							<textarea
								name="Content"
								placeholder="Content"
								value={content}
								style={{ resize: "none" }}
								onChange={(ev) => {
									setContent(ev.target.value);
								}}
								className="p-4 w-[100%] h-[100%] text-lg border-2 border-solid rounded-xl border-midGray"
							></textarea>
						)}
					</div>
					<div
						onClick={async () => {
							if (
								title &&
								content &&
								pb.authStore.isAdmin &&
								pb.authStore.isValid
							) {
								try {
									let res = await fetch("/api/addPost", {
										method: "POST",
										body: JSON.stringify({
											confirmationKey: Env.confirmationKey(),
											title: title,
											content: content,
											images: images.map((it) => it.id),
										}),
										cache: "no-store",
									});
									if (res.status !== 200) {
										console.error("Could not create the post");
									} else {
										setTitle("");
										setContent("");
										setImages([]);
										clear();
									}
								} catch (e) {
									console.debug(e);
									console.error("Error while creating new post");
								}
							} else {
								console.error("Could not create post");
							}
						}}
						style={{
							backgroundColor: title && content ? undefined : "gray",
							color: title && content ? undefined : "black",
							cursor: title && content ? undefined : "not-allowed",
						}}
						className="my-4 rounded-xl w-fit cursor-pointer select-none font-bold bg-styleGreen font-mono px-4 py-2 hover:bg-black hover:dark:bg-white text-white hover:dark:text-black active:bg-white active:dark:bg-black"
					>
						Submit
					</div>
				</div>
			)}
		</div>
	);
}
