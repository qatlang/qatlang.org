import { NextApiRequest, NextApiResponse } from "next";
import pb, { Tables } from "../../models/pb";
import https from "https";
import http from "http";
import { Env } from "../../models/env";
import { dataUrlToBlob } from "../../utils/dataUrlToBlob";

export default async function ImagesHandler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		if (req.method === "GET" && req.query["id"]) {
			const filename = (
				await pb
					.collection(Tables.images)
					.getOne<{ file: string }>(req.query["id"] as string)
			).file;
			let url = pb.files.getURL(
				{
					collectionId: pb.collection(Tables.images).collectionIdOrName,
					id: req.query["id"],
				},
				filename,
			);
			(url.startsWith("https://") ? https : http)
				.get(url, (resp) => {
					let chunks: any[] = [];
					resp.on("data", (chunk) => {
						chunks.push(chunk);
					});
					resp.on("end", () => {
						return res.status(200).send(Buffer.concat(chunks));
					});
				})
				.on("error", (e) => {
					console.log(e.message);
					return res.status(401).send({});
				});
		} else if (req.method === "POST") {
			const body = JSON.parse(req.body) as {
				confirmationKey: string;
				name: string;
				dataURL: string;
			};
			if (body.confirmationKey === Env.confirmationKey()) {
				let form = new FormData();
				const blob = dataUrlToBlob(body.dataURL);
				form.set("file", blob, body.name);
				const imageRes = await pb.collection(Tables.images).create(form);
				return res.status(200).json(imageRes);
			} else {
				return res.status(401).json({});
			}
		} else if (req.method === "DELETE") {
			const body = JSON.parse(req.body) as {
				confirmationKey: string;
				id: string;
			};
			if (body.confirmationKey === Env.confirmationKey()) {
				const deleted = await pb.collection(Tables.images).delete(body.id);
				return res.status(200).json({ deleted: deleted });
			} else {
				return res.status(401).json({});
			}
		} else {
			return res.status(401).json({});
		}
	} catch (e) {
		console.debug(e);
		return res.status(401).json({});
	}
}
