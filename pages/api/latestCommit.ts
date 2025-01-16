import { NextApiRequest, NextApiResponse } from "next";
import pb, { Tables } from "../../models/pb";
import { Env } from "../../models/env";
import { ICommit } from "../../models/interfaces";

export default async function LatestCommitHandler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		if (req.method === "POST") {
			const body = JSON.parse(req.body) as { confirmationKey: string };
			if (body.confirmationKey === Env.confirmationKey()) {
				let commit = await pb
					.collection(Tables.commits)
					.getFirstListItem<ICommit>("", { sort: "-created" });
				return res.status(200).json(commit);
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
