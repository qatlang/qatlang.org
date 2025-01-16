import { NextApiRequest, NextApiResponse } from "next";
import pb, { Tables } from "../../models/pb";
import { Env } from "../../models/env";

export default async function AddPostHandler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		if (req.method === "POST") {
			let post = JSON.parse(req.body) as {
				confirmationKey: string;
				title: string;
				content: string;
				images: string[];
			};
			if (post.confirmationKey === Env.confirmationKey()) {
				const createRes = await pb.collection(Tables.story).create({
					title: post.title,
					content: post.content,
					images: post.images,
					source: "site",
					timestamp: new Date().toUTCString(),
				});
				return res.status(200).json(createRes);
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
