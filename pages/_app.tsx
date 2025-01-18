"use client";

import "../styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { ThemeProvider, useTheme } from "../utils/darkMode";

function QatIcon() {
	return (
		<svg
			className="ml-6 mr-3 h-11 w-11"
			viewBox="0 0 315 315"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g filter="url(#filter0_i_606_3)">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M0 0H129.193L157.5 20.9033L185.807 0H315V128.993L295.118 157.5L315 186.007V315H186.007L157.5 295.118L128.993 315H0V185.606L20.9033 157.299L0 128.993V0Z"
					fill="#CCCCCC"
				/>
			</g>
			<g filter="url(#filter1_d_606_3)">
				<path
					d="M40.5145 40.5145H99.0073H128.254L157.5 62.1118L186.746 40.5145H215.993H274.486V99.0072V128.254L254.088 157.5L274.486 186.746V215.993V274.486H215.993H186.746L157.5 254.088L128.254 274.486H99.0073H40.5145V215.993V186.746L62.1119 157.5L40.5145 128.254V99.0072V40.5145Z"
					fill="#FAFAFA"
				/>
			</g>
			<path
				d="M131.719 87.4504H179.37L235.685 229.32H191.283H155.003H118.724H74.3218L131.719 87.4504Z"
				fill="#555555"
			/>
			<path
				d="M155.177 126.347L182.654 196.385H127.701L155.177 126.347Z"
				fill="#FAFAFA"
			/>
			<defs>
				<filter
					id="filter0_i_606_3"
					x="0"
					y="0"
					width="315"
					height="315"
					filterUnits="userSpaceOnUse"
					color-interpolation-filters="sRGB"
				>
					<feFlood flood-opacity="0" result="BackgroundImageFix" />
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="BackgroundImageFix"
						result="shape"
					/>
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset />
					<feGaussianBlur stdDeviation="10" />
					<feComposite
						in2="hardAlpha"
						operator="arithmetic"
						k2="-1"
						k3="1"
					/>
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"
					/>
					<feBlend
						mode="normal"
						in2="shape"
						result="effect1_innerShadow_606_3"
					/>
				</filter>
				<filter
					id="filter1_d_606_3"
					x="20.5145"
					y="20.5145"
					width="273.971"
					height="273.971"
					filterUnits="userSpaceOnUse"
					color-interpolation-filters="sRGB"
				>
					<feFlood flood-opacity="0" result="BackgroundImageFix" />
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset />
					<feGaussianBlur stdDeviation="10" />
					<feComposite in2="hardAlpha" operator="out" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"
					/>
					<feBlend
						mode="normal"
						in2="BackgroundImageFix"
						result="effect1_dropShadow_606_3"
					/>
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="effect1_dropShadow_606_3"
						result="shape"
					/>
				</filter>
			</defs>
		</svg>
	);
}

function QatNamedIcon() {
	return (
		<svg
			className="h-11 w-28"
			viewBox="0 0 548 198"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M190.577 148.322C188.352 146.096 187.851 142.696 189.15 139.83C194.791 127.381 197.932 113.557 197.932 99C197.932 44.3238 153.623 0 98.9659 0C44.3085 0 0 44.3238 0 99C0 153.676 44.3085 198 98.9659 198C113.887 198 128.036 194.697 140.724 188.782C144.792 186.885 149.67 187.507 152.843 190.681L157.215 195.055C159.09 196.931 161.634 197.985 164.287 197.985H181.309C181.313 197.985 181.316 197.989 181.314 197.993C181.313 197.996 181.315 198 181.319 198H391.713C398.776 198 403.613 190.877 401.008 184.312L354.894 68.1005C352.289 61.5356 357.127 54.4122 364.189 54.4122H411.901C417.424 54.4122 421.901 58.8894 421.901 64.4122V188C421.901 193.523 426.378 198 431.901 198H466.294C471.817 198 476.294 193.523 476.294 188V64.4122C476.294 58.8893 480.771 54.4122 486.294 54.4122H523.049C527.047 54.4122 530.661 52.031 532.238 48.3574L547.013 13.9452C549.846 7.34576 545.006 0 537.824 0H268.133C264.058 0 260.39 2.4728 258.863 6.25063L202.372 145.925C200.434 150.718 194.232 151.978 190.577 148.322ZM102.272 140.093C105.855 143.677 104.034 149.633 98.9659 149.633C71.0114 149.633 48.3498 126.964 48.3498 98.9999C48.3498 71.0358 71.0114 48.3664 98.9659 48.3664C126.92 48.3664 149.582 71.0358 149.582 98.9999C149.582 102.217 145.787 103.517 143.513 101.241L140.547 98.2751C139.413 97.1403 137.874 96.5027 136.27 96.5027H82.8327C73.9245 96.5027 69.4624 107.272 75.7604 113.573L102.272 140.093ZM317.789 152.035C324.835 152.035 329.671 144.943 327.099 138.384L303.428 78.0245C300.108 69.5591 288.129 69.5591 284.809 78.0245L261.138 138.384C258.565 144.943 263.402 152.035 270.447 152.035H317.789Z"
				fill="url(#paint0_linear_1819_4)"
			/>
			<defs>
				<linearGradient
					id="paint0_linear_1819_4"
					x1="8.5"
					y1="9.5"
					x2="553"
					y2="260"
					gradientUnits="userSpaceOnUse"
				>
					<stop stop-color="#4F60FF" />
					<stop offset="1" stop-color="#FF1B6D" />
				</linearGradient>
			</defs>
		</svg>
	);
}

function NavItem(props: {
	name: string;
	link: string;
	isActive: boolean;
	openInNewTab?: boolean;
}) {
	return (
		<Link
			className={
				props.isActive
					? "mx-2 h-fit text-[1.2rem] bg-black dark:bg-white text-white dark:text-black font-mono font-bold tracking-wider p-[0.35rem] rounded-xl transition-all"
					: "mx-2 text-[1.2rem] bg-transparent text-styleGreen hover:text-black dark:hover:text-white font-mono font-bold tracking-wider p-[0.35rem] rounded-xl transition-all"
			}
			target={props.openInNewTab ? "_blank" : undefined}
			href={props.link}
		>
			{props.name}
		</Link>
	);
}

function NavBar() {
	const router = useRouter();
	const [isDark, setDark] = useTheme()!;
	const [darkModeValue, setDarkMode] = useState<
		"dark" | "light" | "system" | null
	>(null);
	const ThemeButton = () => {
		const ModeButton = (props: { mode: string }) => {
			return (
				<div
					className="my-2 transition-colors rounded-lg px-3 py-1 border-2 border-midGray hover:border-black dark:hover:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black cursor-pointer uppercase font-mono font-bold"
					style={{
						borderColor:
							darkModeValue === props.mode ? "#128f5f" : undefined,
						color: darkModeValue === props.mode ? "white" : undefined,
						backgroundColor:
							darkModeValue === props.mode ? "#128f5f" : undefined,
					}}
					onClick={() => {
						setDarkMode(props.mode as "dark" | "light" | "system");
					}}
				>
					{props.mode}
				</div>
			);
		};

		return (
			<div className="transition-colors relative group mx-4 p-2 w-12 h-12 border-2 border-solid rounded-xl border-midGray bg-white hover:bg-black dark:bg-black dark:hover:bg-white">
				<div className="z-50 shadow-lg rounded-lg invisible absolute top-10 right-0 group-hover:visible py-2 px-4 text-lg bg-white dark:bg-black">
					<ModeButton mode="dark" />
					<ModeButton mode="light" />
					<ModeButton mode="system" />
				</div>
				{darkModeValue === "dark" ? (
					<svg
						className="icon"
						viewBox="0 0 24 24"
						fill="none"
						// xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M19.9001 2.30719C19.7392 1.8976 19.1616 1.8976 19.0007 2.30719L18.5703 3.40247C18.5212 3.52752 18.4226 3.62651 18.298 3.67583L17.2067 4.1078C16.7986 4.26934 16.7986 4.849 17.2067 5.01054L18.298 5.44252C18.4226 5.49184 18.5212 5.59082 18.5703 5.71587L19.0007 6.81115C19.1616 7.22074 19.7392 7.22074 19.9001 6.81116L20.3305 5.71587C20.3796 5.59082 20.4782 5.49184 20.6028 5.44252L21.6941 5.01054C22.1022 4.849 22.1022 4.26934 21.6941 4.1078L20.6028 3.67583C20.4782 3.62651 20.3796 3.52752 20.3305 3.40247L19.9001 2.30719Z"
							fill="#ffcf54"
						/>
						<path
							d="M16.0328 8.12967C15.8718 7.72009 15.2943 7.72009 15.1333 8.12967L14.9764 8.52902C14.9273 8.65407 14.8287 8.75305 14.7041 8.80237L14.3062 8.95987C13.8981 9.12141 13.8981 9.70107 14.3062 9.86261L14.7041 10.0201C14.8287 10.0694 14.9273 10.1684 14.9764 10.2935L15.1333 10.6928C15.2943 11.1024 15.8718 11.1024 16.0328 10.6928L16.1897 10.2935C16.2388 10.1684 16.3374 10.0694 16.462 10.0201L16.8599 9.86261C17.268 9.70107 17.268 9.12141 16.8599 8.95987L16.462 8.80237C16.3374 8.75305 16.2388 8.65407 16.1897 8.52902L16.0328 8.12967Z"
							fill="#ffcf54"
						/>
						<path
							d="M12 22C17.5228 22 22 17.5228 22 12C22 11.5373 21.3065 11.4608 21.0672 11.8568C19.9289 13.7406 17.8615 15 15.5 15C11.9101 15 9 12.0899 9 8.5C9 6.13845 10.2594 4.07105 12.1432 2.93276C12.5392 2.69347 12.4627 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
							fill="#659bff"
						/>
					</svg>
				) : darkModeValue === "system" ? (
					<svg className="icon" viewBox="0 0 1024 1024" version="1.1">
						<path
							d="M516.472 946.04c-35.688 0.32-64.872-28.4-65.16-64.088l-1.104-136.856a64.64 64.64 0 0 1 64.12-65.136c35.672-0.28 64.832 28.408 65.144 64.128l1.08 136.824c0.304 35.688-28.408 64.88-64.08 65.128z"
							fill="#E5226B"
						/>
						<path
							d="M938.072 979.992l-842.616 6.792c-35.688 0.28-64.88-28.44-65.16-64.096a64.648 64.648 0 0 1 64.12-65.168l842.648-6.784c35.656-0.28 64.816 28.432 65.128 64.128 0.248 35.688-28.4 64.848-64.12 65.128z"
							fill="#aaaaaa"
						/>
						<path
							d="M1007.992 650.336c0.384 49.856-39.632 90.592-89.496 91.008L111.2 747.816c-49.856 0.432-90.592-39.704-90.968-89.56L16 134.68c-0.376-49.808 39.664-90.56 89.52-90.96l807.296-6.504c49.856-0.392 90.568 39.696 90.944 89.504l4.232 523.616z"
							fill="#4797ff"
						/>
						<path
							d="M111.2 747.816c-49.856 0.432-90.592-39.704-90.968-89.56L16 134.68c-0.376-49.808 39.664-90.56 89.52-90.96l807.296-6.504"
							fill="#47c0f4"
						/>
					</svg>
				) : (
					<svg
						width="100%"
						height="100%"
						viewBox="-4 0 32 32"
						fill="none"
						version="1.1"
						id="svg3921"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M13.0912 30.5454C13.0912 29.742 12.44 29.0908 11.6367 29.0908C10.8334 29.0908 10.1821 29.742 10.1821 30.5454C10.1821 31.3487 10.8334 31.9999 11.6367 31.9999C12.44 31.9999 13.0912 31.3487 13.0912 30.5454Z"
							fill="#000000"
							id="path3897"
						/>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M21.2847 18.1412C22.61 16.1755 23.2727 14.0072 23.2727 11.6364C23.2727 8.42307 22.1367 5.68035 19.8646 3.40822C17.5924 1.13607 14.8496 0 11.6364 0C8.42307 0 5.68035 1.13607 3.40822 3.40822C1.13607 5.68035 0 8.42307 0 11.6364C0 14.0072 0.662666 16.1755 1.988 18.1412C2.8852 19.472 3.98233 20.5561 5.27939 21.3935V21.3984C5.90081 21.8673 6.38841 22.4812 6.74214 23.2397C7.09587 23.9983 7.27273 24.8092 7.27273 25.6727C7.27273 25.7511 7.27117 25.8295 7.26807 25.9078C7.26498 25.9862 7.26032 26.0643 7.25412 26.1424H7.27273V26.1818H16V25.6727C16 24.7962 16.1818 23.9747 16.5456 23.2079C16.9094 22.4409 17.4095 21.8247 18.046 21.3593C19.3201 20.5267 20.3996 19.454 21.2847 18.1412Z"
							fill="url(#paint0_radial_103_1531)"
							id="path3899"
							style={{ fill: "#ffa91e", fillOpacity: 1 }}
						/>
						<path
							d="M7.27246 27.6364C7.27246 29.2431 8.57491 30.5455 10.1816 30.5455H13.0906C14.6973 30.5455 15.9997 29.2431 15.9997 27.6364V26.1819H7.27246V27.6364Z"
							fill="url(#paint1_radial_103_1531)"
							id="path3901"
						/>
						<path
							d="M13.8184 27.6364H9.45481C9.05315 27.6364 8.72754 27.962 8.72754 28.3636C8.72754 28.7653 9.05315 29.0909 9.45481 29.0909H13.8184C14.2201 29.0909 14.5457 28.7653 14.5457 28.3636C14.5457 27.962 14.2201 27.6364 13.8184 27.6364Z"
							fill="#000000"
							fill-opacity="0.2"
							id="path3903"
						/>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M8.55045 8.55082C9.40251 7.69877 10.431 7.27274 11.636 7.27274C12.0377 7.27274 12.3805 7.13073 12.6645 6.84672C12.9485 6.56269 13.0906 6.21985 13.0906 5.81819C13.0906 5.41653 12.9485 5.07369 12.6645 4.78967C12.3805 4.50566 12.0377 4.36365 11.636 4.36365C9.6277 4.36365 7.9135 5.07369 6.49342 6.49379C5.07333 7.91387 4.36328 9.62806 4.36328 11.6364C4.36328 12.038 4.50529 12.3809 4.78931 12.6649C5.07333 12.9489 5.41617 13.0909 5.81783 13.0909C6.21948 13.0909 6.56232 12.9489 6.84635 12.6649C7.13037 12.3809 7.27237 12.038 7.27237 11.6364C7.27237 10.4314 7.6984 9.40287 8.55045 8.55082Z"
							fill="white"
							id="path3905"
						/>
					</svg>
				)}
			</div>
		);
	};
	useEffect(() => {
		if (localStorage) {
			const storageTheme = localStorage.getItem("color-scheme");
			if (storageTheme === "dark") {
				if (!document.documentElement.classList.contains("dark")) {
					document.documentElement.classList.add("dark");
				}
				setDarkMode("dark");
			} else if (storageTheme === "light") {
				if (document.documentElement.classList.contains("dark")) {
					document.documentElement.classList.remove("dark");
				}
				setDarkMode("light");
			} else {
				if (storageTheme === null) {
					localStorage.setItem("color-scheme", "system");
				}
				if (
					window &&
					window.matchMedia("(prefers-color-scheme: dark)").matches
				) {
					if (!document.documentElement.classList.contains("dark")) {
						document.documentElement.classList.add("dark");
					}
				} else {
					if (document.documentElement.classList.contains("dark")) {
						document.documentElement.classList.remove("dark");
					}
				}
				setDarkMode("system");
			}
		}
	}, []);
	useEffect(() => {
		if (darkModeValue === null) {
			if (!document.documentElement.classList.contains("dark")) {
				document.documentElement.classList.add("dark");
			}
			setDark(true);
		} else if (darkModeValue === "dark") {
			localStorage.setItem("color-scheme", "dark");
			if (!document.documentElement.classList.contains("dark")) {
				document.documentElement.classList.add("dark");
			}
			setDark(true);
		} else if (darkModeValue === "light") {
			localStorage.setItem("color-scheme", "light");
			if (document.documentElement.classList.contains("dark")) {
				document.documentElement.classList.remove("dark");
			}
			setDark(false);
		} else {
			localStorage.setItem("color-scheme", "system");
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				if (!document.documentElement.classList.contains("dark")) {
					document.documentElement.classList.add("dark");
				}
				setDark(true);
			} else {
				if (document.documentElement.classList.contains("dark")) {
					document.documentElement.classList.remove("dark");
				}
				setDark(false);
			}
		}
	}, [darkModeValue]);
	return (
		<>
			<nav className="hidden md:flex md:flex-row">
				<NavItem name="HOME" link="/" isActive={router.asPath === "/"} />
				<NavItem
					name="DOWNLOADS"
					link="/downloads"
					isActive={router.asPath.includes("/downloads")}
				/>
				<NavItem
					name="DOCS"
					link="/docs"
					isActive={router.asPath.includes("/docs")}
				/>
				<NavItem
					name="PLAYGROUND"
					link="/playground"
					isActive={router.asPath.includes("/playground")}
				/>
				<NavItem
					name="STORY"
					link="/story"
					isActive={router.asPath.includes("/story")}
				/>

				<ThemeButton />
			</nav>
			<div className="md:hidden">
				<ThemeButton />
			</div>
		</>
	);
}
// <NavItem
//   name="DOCS"
//   link="https://docs.qat.dev"
//   openInNewTab={true}
//   isActive={false}
// />
function MainPage({ Component, router, pageProps }: AppProps) {
	const navPaths = [
		{ name: "HOME", route: "/", out: false },
		{ name: "DOWNLOADS", route: "/downloads", out: false },
		{ name: "DOCS", route: "/docs", out: false },
		{ name: "PLAYGROUND", route: "/playground", out: false },
		{ name: "STORY", route: "/story", out: false },
		// { name: "DOCS", route: "https://docs.qat.dev", out: true },
	];
	const [isDark, _] = useTheme()!;
	let [isSmallMenuExpanded, setSmallMenuExpand] = useState<boolean>(false);
	const headerRef = useRef<any>(null);
	const [headerHeight, setHeaderHeight] = useState<number>(10);
	useLayoutEffect(() => {
		if (headerRef) {
			setHeaderHeight(headerRef.current.clientHeight);
		}
	}, []);
	return (
		<div
			className="text-center text-black dark:text-[#cccccc] flex flex-col flex-grow"
			style={{
				colorScheme: isDark ? "dark" : "light",
				backgroundImage: isDark
					? "radial-gradient(ellipse at top, #282828, #000000)"
					: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='42' height='73.5' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%23e9e9e9' fill-opacity='0.25' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\"), linear-gradient(to right top, #ffffff, #ffffff)",
				backgroundColor: isDark ? "" : "white",
			}}
		>
			<meta property="og:type" content="website" />
			<meta property="og:url" content="https://qat.dev/" />
			<meta property="og:title" content="Qat Programming Language" />
			<meta
				property="og:description"
				content="Superfast modern systems language for efficient & maintainable software..."
			/>
			<meta
				property="og:image"
				content="https://raw.githubusercontent.com/qatlang/media/main/images/qat_cover_1200x671.png"
			/>
			<header
				ref={headerRef}
				className="h-fit py-5 flex flex-row items-center justify-between"
			>
				<Link href="/">
					<div className="flex flex-row align-middle">
						<QatIcon />
						<QatNamedIcon />
					</div>
				</Link>
				<div className="flex flex-row">
					<div
						className="visible md:hidden relative"
						onClick={() => {
							setSmallMenuExpand(!isSmallMenuExpanded);
						}}
					>
						<svg
							className="self-center h-12 w-12 fill-styleGreen transition-all"
							viewBox="0 0 24 24"
							style={{
								rotate: isSmallMenuExpanded ? "135deg" : "0deg",
								fill: isSmallMenuExpanded ? "#128f5f" : undefined,
							}}
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM16 12.75H12.75V16C12.75 16.41 12.41 16.75 12 16.75C11.59 16.75 11.25 16.41 11.25 16V12.75H8C7.59 12.75 7.25 12.41 7.25 12C7.25 11.59 7.59 11.25 8 11.25H11.25V8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V11.25H16C16.41 11.25 16.75 11.59 16.75 12C16.75 12.41 16.41 12.75 16 12.75Z" />
						</svg>
						{isSmallMenuExpanded && (
							<div className="flex flex-col z-[100] absolute rounded-lg bg-white dark:bg-[#333333] w-fit py-1 px-3 right-7 top-9">
								{navPaths.flatMap((navItem) => {
									return (
										<Link
											href={navItem.route}
											target={navItem.out ? "_blank" : undefined}
											className="my-2 rounded-lg font-mono text-base py-2 px-6 tracking-wider"
											style={{
												backgroundColor:
													router.asPath === navItem.route
														? "#128f5f"
														: isDark
															? "black"
															: "white",
											}}
										>
											{navItem.name}
										</Link>
									);
								})}
							</div>
						)}
					</div>
					<NavBar />
				</div>
			</header>
			<div
				style={{
					height: "calc(100vh - " + headerHeight.toString() + "px)",
				}}
			>
				<Component {...pageProps} />
			</div>
		</div>
	);
}

export default function App({ Component, router, pageProps }: AppProps) {
	return (
		<div className="flex flex-col h-[100vh] w-[100%]">
			<ThemeProvider>
				<MainPage
					Component={Component}
					router={router}
					pageProps={pageProps}
				/>
			</ThemeProvider>
		</div>
	);
}
