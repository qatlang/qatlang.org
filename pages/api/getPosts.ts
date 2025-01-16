import { NextApiRequest, NextApiResponse } from "next";
import pb, { Tables } from "../../models/pb";
import { IPost } from "../../models/interfaces";
import { Env } from "../../models/env";

export default async function GetPostsHandler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		if (req.method === "POST") {
			const page = parseInt(
				(req.query["previousPage"] as string | undefined) ?? "0",
			);
			const key = JSON.parse(req.body) as { confirmationKey: string };
			if (key.confirmationKey === Env.confirmationKey()) {
				const postRes = await pb
					.collection(Tables.story)
					.getList<IPost>(page + 1, 10, { sort: "-timestamp" });
				return res
					.status(200)
					.json({ totalPages: postRes.totalPages, items: postRes.items });
			} else {
				return res.status(404).json({});
			}
		} else {
			return res.status(500).json({});
		}
	} catch (e) {
		return res.status(500).json({});
	}
}
