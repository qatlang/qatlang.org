import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import pb from "../models/pb";
import router from "next/router";

export default function Admin() {
	const searchParams = useSearchParams();
	const redirect = () => {
		if (searchParams.has("redirect")) {
			const url = searchParams.get("redirect")!;
			if (url.startsWith("http")) {
				router.push(url);
			} else {
				router.push("/" + url);
			}
		} else {
			router.push("/");
		}
	};
	const [email, setEmail] = useState<string | null>(null);
	const [password, setPassword] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		if (pb.authStore.isValid && pb.authStore.isAdmin) {
			redirect();
		}
	}, []);
	return (
		<div className="flex flex-col h-[100%] w-[100%]">
			<title>Admin | QAT Programming Language</title>
			<div className="flex flex-col flex-grow align-middle justify-center">
				<p className="text-3xl font-bold mt-20 mb-10">Admin</p>
				{error && (
					<div className="p-2 bg-red-600 w-fit rounded-lg font-bold self-center mb-4">
						{error}
					</div>
				)}
				<input
					name="Email"
					placeholder="Email"
					type="email"
					onChange={(ev) => {
						setEmail(ev.target.value);
						setError(null);
					}}
					className="place-self-center mb-4 w-72 h-16 py-2 px-4 border-2 border-solid border-midGray rounded-xl"
				/>
				<input
					name="Password"
					placeholder="Password"
					type="password"
					onChange={(ev) => {
						setPassword(ev.target.value);
						setError(null);
					}}
					className="place-self-center w-72 h-16 py-2 px-4 border-2 border-solid border-midGray rounded-xl"
				/>
				<div
					className="mt-10 select-none cursor-pointer transition-colors w-fit py-2 px-4 text-2xl font-bold rounded-xl self-center bg-styleGreen text-white hover:bg-black active:bg-white hover:text-white dark:hover:bg-white dark:active:bg-black dark:hover:text-black"
					style={{ backgroundColor: error ? "gray" : undefined }}
					onClick={() => {
						if (email && password && !error) {
							pb.admins
								.authWithPassword(email!, password!)
								.then((res) => {
									if (pb.authStore.isValid && pb.authStore.isAdmin) {
										redirect();
									}
								})
								.catch((e) => {
									console.debug(e);
									setError("Could not login. Please try again");
								});
						} else if (!error) {
							setError("Invalid credentials, please try again");
						}
					}}
				>
					Login
				</div>
			</div>
		</div>
	);
}
