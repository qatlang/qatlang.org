import { NextApiRequest, NextApiResponse } from "next";
import { Env } from "../../models/env";

export default async function ReleaseCountHandler(req: NextApiRequest, res: NextApiResponse) {
	try {
		if (req.method === 'GET') {
			const result = await fetch(Env.serverUrl() + "/releaseCount", {
				method: "GET",
				mode: "cors",
				cache: 'no-cache',
			});
			return res.status(200).json(await result.json());
		} else {
			return res.status(405).json({});
		}
	} catch (e) {
		return res.status(200).json({});
	}
}