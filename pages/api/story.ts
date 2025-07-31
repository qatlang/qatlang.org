import { NextApiRequest, NextApiResponse } from "next";
import { Env } from "../../models/env";
import { IPost } from "../../models/interfaces";
import pb, { Tables } from "../../models/pb";

export default async function StoryHandler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method === "POST") {
		const body = JSON.parse(req.body) as { confirmationKey?: string };
		if (body.confirmationKey === Env.confirmationKey()) {
			let result = await pb
				.collection(Tables.story)
				.getList<IPost>(0, 10, { sort: "-timestamp" });
			return res
				.status(200)
				.send({ posts: result.items, totalPage: result.totalPages });
		} else {
			return res.status(400).send({});
		}
	}
	return res.status(404).send({});
}
