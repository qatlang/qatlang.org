import path from "path";
import fs from "fs";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Markdown from "../../components/Markdown";
import { GetStaticPaths } from "next/types";
import { DropdownString } from "../../components/Dropdown";
import { useSearchParams } from "next/navigation";

let uniqueIDCounter = 0;

export function getDocID(): number {
	return ++uniqueIDCounter;
}

export interface DocPageGroup {
	content: string;
	pages: DocPage[];
}

export interface VersionData {
	version: string;
	title: string;
	description: string;
	content: string | DocPageGroup;
}

export interface DocPage {
	id: number;
	title: string;
	description: string;
	index: number;
	slugComponent: string;
	fullPath: string;
	content: string | DocPageGroup;
	previous?: { title: string; path: string };
	next?: { title: string; path: string };
	versions: VersionData[];
}

enum CompareResult {
	lesser,
	equal,
	greater,
}

function compareVersion(first: string, second: string): CompareResult {
	if (first === second) {
		return CompareResult.equal;
	} else if (first.includes(".") || second.includes(".")) {
		const firstArr = first.split(".");
		const secondArr = second.split(".");
		let i = 0;
		for (; i < firstArr.length; i++) {
			if (i >= secondArr.length) {
				return CompareResult.greater;
			}
			if (Number(firstArr[i]) < Number(secondArr[i])) {
				return CompareResult.lesser;
			} else if (Number(firstArr[i]) > Number(secondArr[i])) {
				return CompareResult.greater;
			}
		}
		if (i < secondArr.length) {
			return CompareResult.lesser;
		} else {
			return CompareResult.equal;
		}
	} else {
		if (Number(first) < Number(second)) {
			return CompareResult.lesser;
		} else {
			return CompareResult.greater;
		}
	}
}

interface VersionedPage {
	title: string;
	content: string | DocPageGroup;
	fallbackVersion?: string;
}

function getVersionedPage(
	page: DocPage,
	version: string | null,
): VersionedPage {
	if (version === null) {
		return { title: page.title, content: page.content };
	}
	for (let i = 0; i < page.versions.length; i++) {
		if (page.versions[i].version === version) {
			return {
				title: page.versions[i].title,
				content:
					typeof page.content !== "string" &&
					typeof page.versions[i].content === "string"
						? {
								content: page.versions[i].content as string,
								pages: (page.content as DocPageGroup).pages,
							}
						: page.versions[i].content,
			};
		} else if (
			version &&
			compareVersion(version, page.versions[i].version) ===
				CompareResult.greater
		) {
			return {
				title: page.versions[i].title,
				content: page.versions[i].content,
				fallbackVersion: page.versions[i].version,
			};
		}
	}
	return {
		title: page.title,
		content: page.content,
		fallbackVersion: "initial",
	};
}

function docPageHasVersion(page: DocPage, version: string): boolean {
	for (let i = 0; i < page.versions.length; i++) {
		if (page.versions[i].version === version) {
			return true;
		}
	}
	return false;
}

function getVersionData(page: DocPage, version: string): VersionData | null {
	for (let i = 0; i < page.versions.length; i++) {
		if (page.versions[i].version === version) {
			return page.versions[i];
		}
	}
	return null;
}

const findPreviousPage = (page: DocPage): DocPage => {
	if (typeof page.content === "string") {
		return page;
	} else {
		return findPreviousPage(
			(page.content as DocPageGroup).pages[
				(page.content as DocPageGroup).pages.length - 1
			],
		);
	}
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
	const getDocPages = (
		root: string,
		slugPrefix: string,
	): { pages: DocPage[]; paths: string[]; versions: string[] } => {
		const fileNames = fs.readdirSync(root).sort();
		let result: DocPage[] = [];
		let allPaths: string[] = [];
		let allVersions: string[] = [];
		for (let i = 0; i < fileNames.length; i++) {
			const p = fileNames[i];
			const itPath = path.join(root, p);
			const itStat = fs.statSync(itPath);
			if (itStat.isFile()) {
				const parsedPath = path.parse(itPath);
				if (
					fs.existsSync(path.join(root, parsedPath.name)) ||
					parsedPath.ext !== ".mdx"
				) {
					continue;
				}
				const itName = path.parse(itPath).name;
				const content = fs.readFileSync(itPath).toString();
				const [headStr, contentStr] = content.split("---");
				const headSplit = headStr.split("\n");
				let titleStr = "";
				let descriptionStr = "";
				let indexStr = "";
				let slugStr = "";
				let versionStr = "";
				for (let j = 0; j < headSplit.length; j++) {
					if (headSplit[j].startsWith("title: ")) {
						titleStr = headSplit[j].split("title: ")[1];
					} else if (headSplit[j].startsWith("index: ")) {
						indexStr = headSplit[j].split("index: ")[1];
					} else if (headSplit[j].startsWith("slug: ")) {
						slugStr = headSplit[j].split("slug: ")[1];
					} else if (headSplit[j].startsWith("version: ")) {
						versionStr = headSplit[j].split("version: ")[1];
					} else if (headSplit[j].startsWith("description: ")) {
						descriptionStr = headSplit[j].split("description: ")[1];
					}
				}
				if (slugStr.length === 0) {
					slugStr = itName;
				}
				let existingPage: DocPage | null = null;
				for (let j = 0; j < result.length; j++) {
					if (result[j].slugComponent === slugStr) {
						existingPage = result[j];
						break;
					}
				}
				if (indexStr.length === 0) {
					if (versionStr.length === 0) {
						if (i !== 0) {
							indexStr = (
								result[result.length - 1].index - 1
							).toString();
						} else {
							indexStr = "0";
						}
					}
				}
				const currSlug = path.join(slugPrefix, slugStr);
				if (existingPage === null) {
					allPaths.push(currSlug);
				}
				if (versionStr.length !== 0) {
					if (existingPage !== null) {
						if (docPageHasVersion(existingPage, versionStr)) {
							(
								getVersionData(existingPage, versionStr)!
									.content as DocPageGroup
							).content = contentStr;
						} else {
							existingPage.versions.push({
								version: versionStr,
								title: titleStr,
								description: descriptionStr,
								content: contentStr,
							});
							existingPage.versions.sort().reverse();
						}
					} else {
						result.push({
							id: getDocID(),
							title: "",
							description: "",
							index: 0,
							slugComponent: slugStr,
							fullPath: currSlug,
							content: "",
							versions: [
								{
									version: versionStr,
									title: titleStr,
									description: descriptionStr,
									content: contentStr,
								},
							],
						});
					}
					allVersions.push(versionStr);
				} else {
					if (existingPage !== null) {
						existingPage.title = titleStr;
						existingPage.index = Number(indexStr);
						existingPage.content = content;
					} else {
						result.push({
							id: getDocID(),
							title: titleStr,
							description: descriptionStr,
							index: Number(indexStr),
							slugComponent: slugStr,
							fullPath: currSlug,
							content: contentStr,
							versions: [],
						});
					}
				}
			} else {
				const hasCorrespondingFile = fs.existsSync(itPath + ".mdx");
				const content = hasCorrespondingFile
					? fs.readFileSync(itPath + ".mdx").toString()
					: "";
				let title = p;
				let description = "";
				let index = 0;
				let slug = title;
				let version = "";
				let contentValue = "";
				if (hasCorrespondingFile) {
					const [headStr, contentStr] = content.split("---");
					const headSplit = headStr.split("\n");
					let indexStr = "";
					for (let j = 0; j < headSplit.length; j++) {
						if (headSplit[j].startsWith("title: ")) {
							title = headSplit[j].split("title: ")[1];
						} else if (headSplit[j].startsWith("description: ")) {
							description = headSplit[j].split("description: ")[1];
						} else if (headSplit[j].startsWith("index: ")) {
							indexStr = headSplit[j].split("index: ")[1];
						} else if (headSplit[j].startsWith("slug: ")) {
							slug = headSplit[j].split("slug: ")[1];
						} else if (headSplit[j].startsWith("version: ")) {
							version = headSplit[j].split("version: ")[1];
						}
					}
					contentValue = contentStr;
					index = indexStr.length === 0 ? 0 : Number(indexStr);
					if (indexStr.length === 0 && result.length > 0) {
						index = result[result.length - 1].index + 1;
					}
				} else {
					if (result.length > 0) {
						index = result[result.length - 1].index + 1;
					}
				}
				let existingPage: DocPage | null = null;
				for (let j = 0; j < result.length; j++) {
					if (result[j].slugComponent === slug) {
						existingPage = result[j];
						break;
					}
				}
				const currSlug = path.join(slugPrefix, slug);
				allPaths.push(currSlug);
				const children = getDocPages(itPath, currSlug);
				children.pages.sort((a, b) => a.index - b.index);
				allPaths.push(...children.paths);
				allVersions.push(...children.versions);
				let thisPage: DocPage;
				if (existingPage !== null) {
					if (version.length > 0) {
						if (docPageHasVersion(existingPage, version)) {
							const existingVersion = getVersionData(
								existingPage,
								version,
							)!;
							existingVersion.title = title;
							existingVersion.content = {
								content: content,
								pages: children.pages,
							};
						} else {
							existingPage.versions.push({
								version: version,
								title: title,
								description: description,
								content: { content: content, pages: children.pages },
							});
							existingPage.versions.sort().reverse();
						}
						allVersions.push(version);
					} else {
						existingPage.title = title;
						existingPage.content = {
							content: content,
							pages: children.pages,
						};
						existingPage.index = index;
					}
					thisPage = existingPage;
				} else {
					if (version.length > 0) {
						result.push({
							id: getDocID(),
							title: "",
							description: "",
							index: index,
							slugComponent: slug,
							fullPath: currSlug,
							content: { content: "", pages: [] },
							versions: [
								{
									version: version,
									title: title,
									description: description,
									content: { content: content, pages: children.pages },
								},
							],
							next:
								children.pages.length > 0
									? {
											title: children.pages[0].title,
											path: children.pages[0].fullPath,
										}
									: undefined,
						});
						allVersions.push(version);
					} else {
						result.push({
							id: getDocID(),
							title: title,
							description: description,
							index: index,
							slugComponent: slug,
							fullPath: currSlug,
							content: { content: contentValue, pages: children.pages },
							versions: [],
							next:
								children.pages.length > 0
									? {
											title: children.pages[0].title,
											path: children.pages[0].fullPath,
										}
									: undefined,
						});
					}
					thisPage = result[result.length - 1];
				}
				children.pages[0].previous = {
					title: thisPage.title,
					path: thisPage.fullPath,
				};
			}
		}
		result.sort((a, b) => a.index - b.index);
		for (let i = 1; i < result.length; i++) {
			let latestPage = findPreviousPage(result[i - 1]);
			latestPage.next = {
				title: result[i].title,
				path: result[i].fullPath,
			};
			result[i].previous = {
				title: latestPage.title,
				path: latestPage.fullPath,
			};
		}
		return {
			pages: result,
			paths: allPaths,
			versions: allVersions.sort().reverse(),
		};
	};

	const rootPages = getDocPages(path.resolve("./docs"), "/docs");
	rootPages.paths.push("/docs");

	return {
		paths: rootPages.paths,
		fallback: "blocking",
	};
};

export async function getStaticProps(_ctx: any) {
	const getDocPages = (
		root: string,
		slugPrefix: string,
	): { pages: DocPage[]; paths: string[]; versions: string[] } => {
		const fileNames = fs.readdirSync(root).sort();
		let result: DocPage[] = [];
		let allPaths: string[] = [];
		let allVersions: string[] = [];
		for (let i = 0; i < fileNames.length; i++) {
			const p = fileNames[i];
			const itPath = path.join(root, p);
			const itStat = fs.statSync(itPath);
			if (itStat.isFile()) {
				const parsedPath = path.parse(itPath);
				if (
					fs.existsSync(path.join(root, parsedPath.name)) ||
					parsedPath.ext !== ".mdx"
				) {
					continue;
				}
				const itName = path.parse(itPath).name;
				const content = fs.readFileSync(itPath).toString();
				const [headStr, contentStr] = content.split("---");
				const headSplit = headStr.split("\n");
				let titleStr = "";
				let descriptionStr = "";
				let indexStr = "";
				let slugStr = "";
				let versionStr = "";
				for (let j = 0; j < headSplit.length; j++) {
					if (headSplit[j].startsWith("title: ")) {
						titleStr = headSplit[j].split("title: ")[1];
					} else if (headSplit[j].startsWith("index: ")) {
						indexStr = headSplit[j].split("index: ")[1];
					} else if (headSplit[j].startsWith("slug: ")) {
						slugStr = headSplit[j].split("slug: ")[1];
					} else if (headSplit[j].startsWith("version: ")) {
						versionStr = headSplit[j].split("version: ")[1];
					} else if (headSplit[j].startsWith("description: ")) {
						descriptionStr = headSplit[j].split("description: ")[1];
					}
				}
				if (slugStr.length === 0) {
					slugStr = itName;
				}
				let existingPage: DocPage | null = null;
				for (let j = 0; j < result.length; j++) {
					if (result[j].slugComponent === slugStr) {
						existingPage = result[j];
						break;
					}
				}
				if (indexStr.length === 0) {
					if (versionStr.length === 0) {
						if (i !== 0) {
							indexStr = (
								result[result.length - 1].index - 1
							).toString();
						} else {
							indexStr = "0";
						}
					}
				}
				const currSlug = path.join(slugPrefix, slugStr);
				if (existingPage === null) {
					allPaths.push(currSlug);
				}
				if (versionStr.length !== 0) {
					if (existingPage !== null) {
						if (docPageHasVersion(existingPage, versionStr)) {
							(
								getVersionData(existingPage, versionStr)!
									.content as DocPageGroup
							).content = contentStr;
						} else {
							existingPage.versions.push({
								version: versionStr,
								title: titleStr,
								description: descriptionStr,
								content: contentStr,
							});
							existingPage.versions.sort().reverse();
						}
					} else {
						result.push({
							id: getDocID(),
							title: "",
							description: "",
							index: 0,
							slugComponent: slugStr,
							fullPath: currSlug,
							content: "",
							versions: [
								{
									version: versionStr,
									title: titleStr,
									description: descriptionStr,
									content: contentStr,
								},
							],
						});
					}
					allVersions.push(versionStr);
				} else {
					if (existingPage !== null) {
						existingPage.title = titleStr;
						existingPage.index = Number(indexStr);
						existingPage.content = content;
					} else {
						result.push({
							id: getDocID(),
							title: titleStr,
							description: descriptionStr,
							index: Number(indexStr),
							slugComponent: slugStr,
							fullPath: currSlug,
							content: contentStr,
							versions: [],
						});
					}
				}
			} else {
				const hasCorrespondingFile = fs.existsSync(itPath + ".mdx");
				const content = hasCorrespondingFile
					? fs.readFileSync(itPath + ".mdx").toString()
					: "";
				let title = p;
				let description = "";
				let index = 0;
				let slug = title;
				let version = "";
				let contentValue = "";
				if (hasCorrespondingFile) {
					const [headStr, contentStr] = content.split("---");
					const headSplit = headStr.split("\n");
					let indexStr = "";
					for (let j = 0; j < headSplit.length; j++) {
						if (headSplit[j].startsWith("title: ")) {
							title = headSplit[j].split("title: ")[1];
						} else if (headSplit[j].startsWith("description: ")) {
							description = headSplit[j].split("description: ")[1];
						} else if (headSplit[j].startsWith("index: ")) {
							indexStr = headSplit[j].split("index: ")[1];
						} else if (headSplit[j].startsWith("slug: ")) {
							slug = headSplit[j].split("slug: ")[1];
						} else if (headSplit[j].startsWith("version: ")) {
							version = headSplit[j].split("version: ")[1];
						}
					}
					contentValue = contentStr;
					index = indexStr.length === 0 ? 0 : Number(indexStr);
					if (indexStr.length === 0 && result.length > 0) {
						index = result[result.length - 1].index + 1;
					}
				} else {
					if (result.length > 0) {
						index = result[result.length - 1].index + 1;
					}
				}
				let existingPage: DocPage | null = null;
				for (let j = 0; j < result.length; j++) {
					if (result[j].slugComponent === slug) {
						existingPage = result[j];
						break;
					}
				}
				const currSlug = path.join(slugPrefix, slug);
				allPaths.push(currSlug);
				const children = getDocPages(itPath, currSlug);
				children.pages.sort((a, b) => a.index - b.index);
				allPaths.push(...children.paths);
				allVersions.push(...children.versions);
				let thisPage: DocPage;
				if (existingPage !== null) {
					if (version.length > 0) {
						if (docPageHasVersion(existingPage, version)) {
							const existingVersion = getVersionData(
								existingPage,
								version,
							)!;
							existingVersion.title = title;
							existingVersion.content = {
								content: content,
								pages: children.pages,
							};
						} else {
							existingPage.versions.push({
								version: version,
								title: title,
								description: description,
								content: { content: content, pages: children.pages },
							});
							existingPage.versions.sort().reverse();
						}
						allVersions.push(version);
					} else {
						existingPage.title = title;
						existingPage.content = {
							content: content,
							pages: children.pages,
						};
						existingPage.index = index;
					}
					thisPage = existingPage;
				} else {
					if (version.length > 0) {
						result.push({
							id: getDocID(),
							title: "",
							description: "",
							index: index,
							slugComponent: slug,
							fullPath: currSlug,
							content: { content: "", pages: [] },
							versions: [
								{
									version: version,
									title: title,
									description: description,
									content: { content: content, pages: children.pages },
								},
							],
							next:
								children.pages.length > 0
									? {
											title: children.pages[0].title,
											path: children.pages[0].fullPath,
										}
									: undefined,
						});
						allVersions.push(version);
					} else {
						result.push({
							id: getDocID(),
							title: title,
							description: description,
							index: index,
							slugComponent: slug,
							fullPath: currSlug,
							content: { content: contentValue, pages: children.pages },
							versions: [],
							next:
								children.pages.length > 0
									? {
											title: children.pages[0].title,
											path: children.pages[0].fullPath,
										}
									: undefined,
						});
					}
					thisPage = result[result.length - 1];
				}
				children.pages[0].previous = {
					title: thisPage.title,
					path: thisPage.fullPath,
				};
			}
		}
		result.sort((a, b) => a.index - b.index);
		for (let i = 1; i < result.length; i++) {
			let latestPage = findPreviousPage(result[i - 1]);
			latestPage.next = {
				title: result[i].title,
				path: result[i].fullPath,
			};
			result[i].previous = {
				title: latestPage.title,
				path: latestPage.fullPath,
			};
		}
		return {
			pages: result,
			paths: allPaths,
			versions: allVersions.sort().reverse(),
		};
	};

	const docPagesResult = getDocPages(path.resolve("./docs"), "/docs");

	return {
		props: {
			files: docPagesResult.pages,
			versions: docPagesResult.versions,
		},
	};
}

interface HighlightUnit {
	start: number;
	end: number;
}

interface ResultSegment {
	start: number;
	end: number;
	highlights: HighlightUnit[];
}

interface SearchResult {
	title: string;
	content: string;
	path: string;
	version?: string;
	result: { title: ResultSegment[]; content: ResultSegment[] };
	versions: {
		version: string;
		title: string;
		content: string;
		result: { title: ResultSegment[]; content: ResultSegment[] };
	}[];
}

function getHighlightUnitsFromSegments(seg: ResultSegment[]): HighlightUnit[] {
	let result: HighlightUnit[] = [];
	for (let i = 0; i < seg.length; i++) {
		result.push(...seg[i].highlights);
	}
	return result;
}

function findBreakBefore(value: string, index: number): number {
	for (let i = index; i > 0; i--) {
		if (value[i] === "\n") {
			return i;
		}
	}
	return 0;
}

function findBreakAfter(value: string, index: number): number {
	for (let i = index; i < value.length; i++) {
		if (value[i] === "\n") {
			return i;
		}
	}
	return value.length;
}

function searchInString(
	sourceOriginal: string,
	strOriginal: string,
): ResultSegment[] {
	const source = sourceOriginal.toLowerCase();
	const str = strOriginal.toLowerCase();
	if (source.indexOf(str) > -1) {
		let ind = 0;
		let start = 0;
		let end = 0;
		let segments: ResultSegment[] = [];
		while (source.indexOf(str, ind) > -1) {
			ind = source.indexOf(str, ind);
			start = findBreakBefore(source, ind);
			end = findBreakAfter(source, ind + str.length);
			segments.push({
				start: start,
				end: end,
				highlights: [{ start: ind, end: ind + str.length }],
			});
			for (let j = ind + str.length; j < end; j++) {
				if (source.indexOf(str, j) > -1) {
					const newInd = source.indexOf(str, j);
					segments[segments.length - 1].highlights.push({
						start: newInd,
						end: newInd + str.length,
					});
					j = newInd + str.length - 1;
				}
			}
			ind = end;
		}
		return segments;
	} else {
		return [];
	}
}

function getHighlightSpans(
	value: string,
	results: HighlightUnit[],
	offset: number,
): string {
	if (results.length === 0) {
		return value;
	}
	let nodes: string = "";
	nodes += value.substring(0, results[0].start - offset);
	for (let i = 0; i < results.length; i++) {
		if (i !== 0) {
			if (results[i - 1].end - offset < results[i].start - offset) {
				nodes += value.substring(
					results[i - 1].end - offset,
					results[i].start - offset,
				);
			}
		}
		nodes +=
			"<span style='background-color: orange; color: black;'>" +
			value.substring(results[i].start - offset, results[i].end - offset) +
			"</span>";
	}
	if (results[results.length - 1].end - offset < value.length) {
		nodes += value.substring(results[results.length - 1].end - offset);
	}
	return nodes;
}

export default function Page(props: { files: DocPage[]; versions: string[] }) {
	const [activePage, setActivePage] = useState<DocPage>(props.files[0]);
	const isActivePage = (page: DocPage): boolean => {
		return activePage !== null && page.id === activePage.id;
	};
	const [activeVersion, setActiveVersion] = useState<string | null>(
		props.versions.length > 0 ? props.versions[0] : null,
	);
	const [versionedPage, setVersionedPage] = useState<VersionedPage>(
		getVersionedPage(activePage!, activeVersion),
	);

	const router = useRouter();
	const { slug } = router.query;

	useEffect(() => {
		setVersionedPage(getVersionedPage(activePage!, activeVersion));
		router.push(
			{
				pathname: activePage.fullPath,
				query: activeVersion ? "version=" + activeVersion : null,
			},
			undefined,
			{
				shallow: true,
			},
		);
	}, [activePage, activeVersion]);

	const findPageAtSlug = (
		pages: DocPage[],
		slugVal: string[],
		version: string | null,
	): { page: DocPage | null; incomplete: boolean; version: string | null } => {
		for (let i = 0; i < pages.length; i++) {
			if (pages[i].slugComponent === slugVal[0]) {
				if (version === null || !docPageHasVersion(pages[i], version)) {
					if (1 === slugVal.length) {
						return {
							page: pages[i],
							incomplete: false,
							version: version,
						};
					} else if (typeof pages[i].content !== "string") {
						let foundInMain = false;
						for (
							let i = 0;
							i < (pages[i].content as DocPageGroup).pages.length;
							i++
						) {
							if (
								(pages[i].content as DocPageGroup).pages[i]
									.slugComponent === slugVal[1]
							) {
								foundInMain = true;
								break;
							}
						}
						if (foundInMain) {
							return findPageAtSlug(
								(pages[i].content as DocPageGroup).pages,
								slugVal.toSpliced(0, 1),
								version,
							);
						} else {
							for (let i = 0; i < pages[i].versions.length; i++) {
								const verData = pages[i].versions[i];
								if (typeof verData.content !== "string") {
									const verGroup = verData.content as DocPageGroup;
									for (let j = 0; j < verGroup.pages.length; j++) {
										if (
											verGroup.pages[i].slugComponent === slugVal[1]
										) {
											if (slugVal.length === 2) {
												return {
													page: verGroup.pages[i],
													incomplete: false,
													version: verData.version,
												};
											} else if (
												typeof verGroup.pages[i].content !==
												"string"
											) {
												return findPageAtSlug(
													(
														verGroup.pages[i]
															.content as DocPageGroup
													).pages,
													slugVal.toSpliced(0, 2),
													verData.version,
												);
											} else {
												return {
													page: verGroup.pages[i],
													incomplete: true,
													version: verData.version,
												};
											}
										}
									}
								}
							}
						}
					} else {
						return { page: pages[i], incomplete: true, version: null };
					}
				} else if (version !== null) {
					const versionData = getVersionData(pages[i], version)!;
					if (1 === slugVal.length) {
						return {
							page: pages[i],
							incomplete: false,
							version: version,
						};
					} else if (typeof versionData.content !== "string") {
						return findPageAtSlug(
							(versionData.content as DocPageGroup).pages,
							slugVal.toSpliced(0, 1),
							version,
						);
					} else if (typeof pages[i].content !== "string") {
						return findPageAtSlug(
							(pages[i].content as DocPageGroup).pages,
							slugVal.toSpliced(0, 1),
							version,
						);
					} else {
						return { page: pages[i], incomplete: true, version: version };
					}
				}
			}
		}
		return { page: null, incomplete: false, version: null };
	};

	const [searchVisible, setSearchVisible] = useState<boolean>(false);
	const [searchCandidate, setSearchCandidate] = useState<string>("");
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
	const resetSearch = (clear: boolean) => {
		setSearchVisible(false);
		if (clear) {
			setSearchCandidate("");
			setSearchResults([]);
		}
	};

	let searchShouldCancel = false;
	let searchOngoing = false;

	const [highlightParts, setHighlightParts] = useState<{
		title: HighlightUnit[];
		content: HighlightUnit[];
	} | null>(null);

	const searchInPages = (
		pages: DocPage[],
		str: string,
		version?: string,
	): SearchResult[] => {
		let searchRes: SearchResult[] = [];
		if (searchShouldCancel) {
			return [];
		}
		for (let i = 0; i < pages.length; i++) {
			if (searchShouldCancel) {
				return [];
			}
			const titleRes = searchInString(pages[i].title, str);
			let contentRes: ResultSegment[] = [];
			let versionsRes: {
				version: string;
				title: string;
				content: string;
				result: { title: ResultSegment[]; content: ResultSegment[] };
			}[] = [];
			if (searchShouldCancel) {
				return [];
			}
			if (typeof pages[i].content === "string") {
				contentRes = searchInString(pages[i].content as string, str);
				if (searchShouldCancel) {
					return [];
				}
			} else {
				const group = pages[i].content as DocPageGroup;
				if (group.content.length > 0) {
					contentRes = searchInString(group.content, str);
					if (searchShouldCancel) {
						return [];
					}
				}
				searchRes.push(...searchInPages(group.pages, str));
				if (searchShouldCancel) {
					return [];
				}
			}
			if (pages[i].versions.length > 0) {
				for (let j = 0; j < pages[i].versions.length; j++) {
					if (searchShouldCancel) {
						return [];
					}
					const versionTitleRes = searchInString(
						pages[i].versions[j].title,
						str,
					);
					if (searchShouldCancel) {
						return [];
					}
					let versionContentRes: ResultSegment[] = [];
					if (typeof pages[i].versions[j].content === "string") {
						versionContentRes = searchInString(
							pages[i].versions[j].content as string,
							str,
						);
					} else {
						const group = pages[i].versions[j].content as DocPageGroup;
						versionContentRes = searchInString(group.content, str);
						if (searchShouldCancel) {
							return [];
						}
						searchRes.push(
							...searchInPages(
								group.pages,
								str,
								pages[i].versions[j].version,
							),
						);
					}
					if (searchShouldCancel) {
						return [];
					}
					if (versionTitleRes.length > 0 || versionContentRes.length > 0) {
						versionsRes.push({
							version: pages[i].versions[j].version,
							title: pages[i].versions[j].title,
							content:
								typeof pages[i].versions[j].content === "string"
									? (pages[i].versions[j].content as string)
									: (pages[i].versions[j].content as DocPageGroup)
											.content,
							result: {
								title: versionTitleRes,
								content: versionContentRes,
							},
						});
					}
				}
			}
			if (
				titleRes.length > 0 ||
				contentRes.length > 0 ||
				versionsRes.length > 0
			) {
				if (searchShouldCancel) {
					return [];
				}
				searchRes.push({
					title: pages[i].title,
					content:
						contentRes.length > 0
							? typeof pages[i].content === "string"
								? (pages[i].content as string)
								: (pages[i].content as DocPageGroup).content
							: "",
					path: pages[i].fullPath,
					version: version,
					result: { title: titleRes, content: contentRes },
					versions: versionsRes,
				});
				if (searchShouldCancel) {
					return [];
				}
			}
		}
		if (searchShouldCancel) {
			return [];
		}
		return searchRes;
	};

	const [unknownPath, setUnknownPath] = useState<string | null>();

	useEffect(() => {
		if (slug) {
			const pageRes = findPageAtSlug(
				props.files,
				slug as string[],
				activeVersion,
			);
			if (pageRes.page !== null) {
				if (pageRes.incomplete) {
					setUnknownPath((slug as string[]).join("/"));
				}
				setActivePage(pageRes.page);
				setActiveVersion(pageRes.version);
				router.push(
					{
						pathname: pageRes.page.fullPath,
						query: activeVersion ? "version=" + activeVersion : undefined,
					},
					undefined,
					{
						shallow: true,
					},
				);
			} else {
				setActivePage(props.files[0]);
				setUnknownPath((slug as string[]).join("/"));
				router.push(
					{
						pathname: props.files[0].fullPath,
						query: activeVersion ? "version=" + activeVersion : undefined,
					},
					undefined,
					{
						shallow: true,
					},
				);
			}
		} else {
			setActivePage(props.files[0]);
			router.push(
				{
					pathname: props.files[0].fullPath,
					query: activeVersion ? "version=" + activeVersion : undefined,
				},
				undefined,
				{
					shallow: true,
				},
			);
		}
	}, []);

	return (
		<div className="flex flex-col w-full h-full self-center">
			<title>Docs | QAT Programming Language</title>
			{unknownPath && (
				<div className="flex flex-row bg-orange-400 text-black px-4 py-2 rounded-lg w-fit">
					Could not find the path{" "}
					<p className="font-bold px-2">{unknownPath}</p> in the
					documentation. You have been redirected
				</div>
			)}
			<div className="flex flex-col md:flex-row h-full">
				<div className="md:flex md:flex-col h-full min-w-[15rem] w-[15rem] overflow-y-auto hidden px-4 border-solid border-r-[0.1rem] border-r-lightGray dark:border-r-darkGray">
					{props.versions.length > 0 && (
						<DropdownString
							name="Version"
							items={props.versions.map((val) => {
								return { name: val, value: val };
							})}
							nonePrompt="initial"
							default={activeVersion}
							onChange={(val: string | null) => {
								setActiveVersion(val);
							}}
						/>
					)}
					<div className="mb-2" />
					{props.files.flatMap((it) => {
						return (
							<MenuItem
								onClick={(item: DocPage) => {
									setActivePage(item);
									router.push({ pathname: item.fullPath }, undefined, {
										shallow: true,
									});
								}}
								isActiveFn={isActivePage}
								item={it}
							/>
						);
					})}
				</div>
				<div className="flex flex-col w-full">
					<div className="flex flex-row w-full px-4 mb-5">
						<input
							className="pl-4 pr-12 py-2 border-2 border-solid border-midGray bg-white dark:bg-black text-xl rounded-xl w-full md:w-[50%]"
							placeholder="Search in docs..."
							type="text"
							value={searchCandidate}
							onFocus={() => {
								if (searchCandidate.length > 0) {
									setSearchVisible(true);
								}
							}}
							onInput={async (ev: any) => {
								setSearchCandidate(ev.target.value as string);
								if (searchOngoing) {
									searchShouldCancel = true;
								}
								while (searchOngoing) {}
								searchShouldCancel = false;
								if ((ev.target.value as string).length > 0) {
									setSearchVisible(true);
									searchOngoing = true;
									const pageRes = searchInPages(
										props.files,
										ev.target.value,
									);
									if (searchShouldCancel) {
										searchOngoing = false;
										return;
									}
									setSearchResults(pageRes);
									searchOngoing = false;
								} else {
									setSearchVisible(false);
								}
							}}
						/>
						<div
							className="flex flex-col transition-all hover:rotate-180 active:rotate-[-360deg] mr-8 w-8 h-8 -ml-11 self-center cursor-pointer"
							onClick={() => {
								resetSearch(true);
							}}
						>
							<CloseButton />
						</div>
						<div className="flex flex-row fixed md:relative w-full md:flex-grow bottom-3 md:bottom-0 left-0 px-3 md:px-0">
							{activePage && activePage.previous && (
								<ChangePage
									onClick={() => {
										resetSearch(false);
										const pageRes = findPageAtSlug(
											props.files,
											activePage!
												.previous!.path.split("/")
												.toSpliced(0, 2),
											activeVersion,
										);
										router.push(
											{ pathname: activePage!.previous!.path },
											undefined,
											{ shallow: true },
										);
										setActivePage(pageRes.page!);
									}}
									type="Previous"
									name={activePage!.previous!.title}
								/>
							)}
							<div className="flex-grow"></div>
							{activePage && activePage.next && (
								<ChangePage
									onClick={() => {
										resetSearch(false);
										const pageRes = findPageAtSlug(
											props.files,
											activePage!
												.next!.path.split("/")
												.toSpliced(0, 2),
											activeVersion,
										);
										router.push(
											{
												pathname: pageRes.page!.fullPath,
												query: activeVersion
													? "version=" + activeVersion
													: null,
											},
											undefined,
											{ shallow: true },
										);
										setActivePage(pageRes.page!);
									}}
									type="Next"
									name={activePage!.next!.title}
								/>
							)}
						</div>
					</div>
					<div className="flex flex-col flex-grow px-4 overflow-y-auto">
						{searchVisible ? (
							searchResults.length > 0 ? (
								<div className="flex flex-col w-full pb-20">
									<p className="text-left pl-4">
										{searchResults.length.toString()}{" "}
										{searchResults.length === 1 ? "page " : "pages "}
										found
									</p>
									{searchResults.flatMap((it) => {
										return (
											<SearchResultCard
												value={it}
												setPage={(
													pagePath: string,
													version: string | null,
												) => {
													setActivePage(
														findPageAtSlug(
															props.files,
															pagePath
																.split("/")
																.toSpliced(0, 2),
															activeVersion,
														).page!,
													);
													setActiveVersion(version);
													setSearchVisible(false);
												}}
											/>
										);
									})}
								</div>
							) : (
								<div className="text-2xl text-center mt-5">
									Could not find anything
									<p>...</p>
								</div>
							)
						) : (
							<>
								<div className="text-4xl font-bold text-left mb-6">
									{versionedPage.title}
								</div>
								{versionedPage.fallbackVersion && (
									<div className="px-3 py-1 mb-4 italic bg-[#cccccc] dark:bg-[#444444] rounded-lg w-fit">
										Since {versionedPage.fallbackVersion} version
									</div>
								)}
								{typeof versionedPage.content === "string" ? (
									<Markdown
										allowHTML
										className="text-lg"
										children={versionedPage.content as string}
										currentURL={activePage.fullPath}
									/>
								) : (
									(() => {
										const group =
											versionedPage.content as DocPageGroup;
										return (
											<div className="flex flex-col">
												{group.content.length > 0 && (
													<Markdown
														allowHTML
														className="text-lg mb-2"
														children={group.content}
														currentURL={activePage.fullPath}
													/>
												)}
												<div className="grid grid-cols-4 gap-4">
													{group.pages.flatMap((d) => {
														return (
															<div
																className="hover:text-white hover:dark:text-white cursor-pointer rounded-lg px-4 pt-1 pb-2 my-2 border-2 border-solid border-midGray hover:bg-styleGreen hover:border-[#128f5f] text-left"
																onClick={() => {
																	const newPage =
																		findPageAtSlug(
																			props.files,
																			d.fullPath
																				.split("/")
																				.toSpliced(0, 2),
																			activeVersion,
																		);
																	if (newPage.page !== null) {
																		setActivePage(
																			newPage.page,
																		);
																		router.push(
																			{
																				pathname:
																					d.fullPath,
																				query:
																					activeVersion !==
																					null
																						? "version=" +
																							activeVersion
																						: undefined,
																			},
																			undefined,
																			{ shallow: true },
																		);
																	}
																}}
															>
																<p className="text-lg font-bold">
																	{d.title}
																</p>
																{d.description.length > 0 && (
																	<p className="text-sm">
																		{d.description}
																	</p>
																)}
															</div>
														);
													})}
												</div>
											</div>
										);
									})()
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

function SearchResultCard(props: {
	value: SearchResult;
	setPage: (path: string, version: string | null) => void;
}) {
	return (
		<>
			{(props.value.result.title.length > 0 ||
				props.value.result.content.length > 0) && (
				<div
					className="my-4 mx-4 px-4 py-4 border-2 border-solid border-midGray rounded-xl bg-[#ffffff77] dark:bg-[#00000077]"
					onClick={() => {
						props.setPage(props.value.path, props.value.version ?? null);
					}}
				>
					<div className="flex flex-row mb-4">
						<div className="px-2 py-1 bg-[#00000022] dark:bg-[#ffffff22] w-fit rounded">
							{props.value.path}
						</div>
						{props.value.version && (
							<div className="px-2 py-1 ml-2 bg-[#00000022] dark:bg-[#ffffff22] w-fit rounded">
								{props.value.version}
							</div>
						)}
					</div>
					<div
						className="text-3xl font-bold text-left"
						dangerouslySetInnerHTML={{
							__html: getHighlightSpans(
								props.value.title,
								getHighlightUnitsFromSegments(props.value.result.title),
								0,
							),
						}}
					/>
					{props.value.result.content.length > 0 && (
						<div className="mt-4">
							{props.value.result.content.flatMap((cont, i) => (
								<div className="flex flex-col">
									<div className="py-2">
										<Markdown allowHTML>
											{getHighlightSpans(
												props.value.content.substring(
													cont.start,
													cont.end,
												),
												cont.highlights,
												cont.start,
											)}
										</Markdown>
									</div>
									{i !== props.value.result.content.length - 1 && (
										<div className="px-2 self-end rounded bg-[#00000011] dark:bg-[#ffffff11] text-[#00000077] dark:text-[#ffffff55] w-fit">
											• • • • • • •
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			)}
			{props.value.versions.flatMap((ver) => {
				return (
					<SearchResultCard
						value={{
							title: ver.title,
							content: ver.content,
							version: ver.version,
							result: ver.result,
							path: props.value.path,
							versions: [],
						}}
						setPage={props.setPage}
					/>
				);
			})}
		</>
	);
}

function ChangePage(props: {
	onClick: () => void;
	type: string;
	name: string;
}) {
	return (
		<div
			onClick={props.onClick}
			className="bg-white dark:bg-black select-none border-2 active:bg-white active:border-white dark:active:bg-black dark:active:border-black hover:text-white hover:bg-styleGreen dark:hover:bg-styleGreen px-3 py-1 border-solid border-midGray hover:border-transparent hover:dark:border-transparent cursor-pointer rounded-xl flex flex-col md:w-[49%]"
			style={{
				textAlign: props.type === "Previous" ? "left" : "right",
			}}
		>
			<div className="text-sm tracking-widest font-mono uppercase">
				{props.type}
			</div>
			<div className="font-bold overflow-hidden text-ellipsis whitespace-nowrap">
				{props.name}
			</div>
		</div>
	);
}

function MenuItem(props: {
	onClick: (page: DocPage) => void;
	isActiveFn: (page: DocPage) => boolean;
	item: DocPage;
}) {
	const [isExpanded, setExpanded] = useState<boolean>(false);
	useEffect(() => {
		setExpanded(props.isActiveFn(props.item));
	}, []);
	return (
		<div className="flex flex-col my-1 select-none">
			<div className="flex flex-row">
				<p
					className="flex-grow hover:bg-[#00000022] dark:hover:bg-[#ffffff22] active:bg-black active:text-white text-left py-1 px-3 rounded-lg text-[#555555] font-bold dark:text-[#999999] whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer"
					style={{
						color: props.isActiveFn(props.item) ? "#ffffff" : undefined,
						backgroundColor: props.isActiveFn(props.item)
							? "#128f5f"
							: undefined,
					}}
					onClick={() => {
						if (!props.isActiveFn(props.item)) {
							setExpanded(true);
							props.onClick(props.item);
						}
					}}
				>
					{props.item.title}
				</p>
				{typeof props.item.content !== "string" && (
					<div
						className="text-2xl font-mono px-2 ml-2 cursor-pointer hover:bg-[#00000022] dark:hover:bg-[#ffffff22] active:bg-black active:text-white rounded-lg"
						onClick={() => {
							setExpanded(!isExpanded);
						}}
					>
						{isExpanded ? "-" : "+"}
					</div>
				)}
			</div>
			{typeof props.item.content !== "string" && isExpanded && (
				<div className="ml-1 pl-1 mt-1 border-l-2 border-midGray">
					{(props.item.content as DocPageGroup).pages.flatMap((it) => {
						return (
							<MenuItem
								onClick={props.onClick}
								isActiveFn={props.isActiveFn}
								item={it}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}

function CloseButton() {
	return (
		<svg
			className="h-8 w-8"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				className="fill-[#999999] dark:fill-[#666666]"
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z"
			/>
		</svg>
	);
}
