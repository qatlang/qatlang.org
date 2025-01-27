import PocketBase from "pocketbase";

const pb = await (async () => {
	const result = new PocketBase(process.env["POCKETBASE_URL"]!);
	await result.admins.authWithPassword(
		process.env["POCKETBASE_EMAIL"]!,
		process.env["POCKETBASE_PASSWORD"]!,
	);
	return result;
})();

export enum Tables {
	images = "images",
	releases = "releases",
	story = "story",
	commits = "commits",
}

export default pb;
