import pb, { Tables } from "../../models/pb";
import { IPost } from "../../models/interfaces";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Markdown from "../../components/Markdown";

export async function getServerSideProps() {
	return {
		props: {
			posts: await pb
				.collection(Tables.story)
				.getFullList<IPost>({ batch: 2000 }),
		},
	};
}

export default function StoryPost(props: { posts: IPost[] }) {
	const router = useRouter();
	const { slug } = router.query;
	const [postCount, setPostCount] = useState<number>(10);
	const [activePost, setActivePost] = useState<number | null>(null);
	useEffect(() => {
		if (slug !== undefined) {
			for (let i = 0; i < props.posts.length; i++) {
				if (
					props.posts[i].slug &&
					props.posts[i].slug === (slug as string[])[0]
				) {
					setActivePost(i);
					break;
				}
			}
			if (activePost === null) {
				router.push("/story", undefined, { shallow: true });
			}
		}
	}, [slug]);
	return activePost !== null ? (
		<div className="flex flex-col w-full h-full overflow-y-auto">
			<div className="flex flex-col py-8 w-[90%] self-center pb-14">
				<p
					className="fixed md:static bottom-4 left-4 w-fit font-bold px-6 py-3 md:px-4 md:py-2 md:mb-6 rounded-xl md:rounded-lg shadow-lg text-lg md:text-base bg-white text-black hover:bg-styleGreen hover:text-white dark:bg-black dark:text-white dark:hover:bg-styleGreen dark:hover:text-white cursor-pointer border-2 border-solid border-midGray hover:border-styleGreen"
					onClick={() => {
						setActivePost(null);
						router.push("/story", undefined, { shallow: true });
					}}
				>
					Go back
				</p>
				<title>{props.posts[activePost].title}</title>
				<p className="font-bold text-3xl text-left mb-4">
					{props.posts[activePost].title}
				</p>
				<div className="italic text-lg text-left mb-4 opacity-80">
					{new Date(props.posts[activePost].timestamp).toLocaleString(
						"en-IN",
						{
							day: "numeric",
							month: "long",
							year: "numeric",
							hour: "numeric",
							minute: "numeric",
						},
					)}
				</div>
				<Markdown
					className={"text-lg text-left"}
					children={props.posts[activePost].content}
				/>

				{props.posts[activePost].source.length > 0 && (
					<div className="py-1 italic opacity-50 text-left">
						Posted on {props.posts[activePost].source}
					</div>
				)}
			</div>
		</div>
	) : (
		<div className="flex flex-col w-full h-full pt-8 overflow-y-auto">
			<title>Story | QAT Programming Language</title>
			<div className="flex flex-col w-[90%] self-center">
				<p className="text-3xl font-bold text-left mb-4">Story of qat</p>
				<p className="text-lg text-left mb-10">
					Hi, these are updates that I post occasionally, mostly about the
					status of the project, or crucial changes. Please don't expect
					frequent updates. My focus is on developing and improving the
					language and not on maintaining any superficial impression about
					the project
				</p>
				{[...Array(postCount)].flatMap((_, i) => {
					return (
						<div className="flex flex-col" key={i}>
							<div
								className="px-6 py-4 group cursor-pointer dark:shadow-none bg-white dark:bg-black rounded-2xl border-2 border-solid border-midGray hover:border-styleGreen"
								onClick={() => {
									if (props.posts[i].slug) {
										setActivePost(i);
										router.push(
											"/story/" + props.posts[i].slug,
											undefined,
											{ shallow: true },
										);
									}
								}}
							>
								{props.posts[i].title.length > 0 && (
									<div className="font-bold text-2xl text-left mb-2 group-hover:text-styleGreen">
										{props.posts[i].title}
									</div>
								)}
								<div className="text-left mb-3 italic opacity-80 w-fit">
									{new Date(props.posts[i].timestamp).toLocaleString(
										"en-IN",
										{
											day: "numeric",
											month: "long",
											year: "numeric",
											hour: "numeric",
											minute: "numeric",
										},
									)}
								</div>
								<div className="max-h-40 min-h-10 overflow-y-clip relative">
									<Markdown children={props.posts[i].content} />
									<div className="z-10 absolute bottom-0 w-full h-full bg-gradient-to-t from-white dark:from-black from-10%" />
									<div className="z-20 absolute bottom-0 right-4 text-lg opacity-50 group-hover:opacity-100 group-hover:text-styleGreen">
										Read more
									</div>
								</div>
							</div>
							{i != postCount - 1 && (
								<p className="my-3 text-xl font-bold select-none text-left text-gray-500">
									⇡
								</p>
							)}
						</div>
					);
				})}
				<div
					className="bg-styleGreen select-none text-[#ffffff] cursor-pointer py-2 px-4 font-bold w-fit self-center mt-10 mb-20 hover:bg-black dark:hover:bg-white active:bg-white dark:active:bg-black hover:text-white dark:hover:text-black rounded-lg"
					onClick={() => {
						if (postCount + 1 <= props.posts.length) {
							setPostCount(
								postCount + 10 < props.posts.length
									? postCount + 10
									: props.posts.length,
							);
						}
					}}
				>
					Show more
				</div>
			</div>
		</div>
	);
}
