import { NextApiRequest, NextApiResponse } from "next";
import { Env } from "../../models/env";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import childProcess from "child_process";
import { CompileResult } from "../../models/interfaces";

export default async function CompilationHandler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method === "POST") {
		const body = JSON.parse(req.body) as {
			confirmationKey?: string;
			arguments: string;
			code: string;
		};
		if (body.confirmationKey === Env.confirmationKey()) {
			let id = crypto.randomBytes(12).toString("hex");
			if (fs.existsSync(path.join("compilations", id))) {
				id = crypto.randomBytes(12).toString("hex");
			}
			const rootDir = path.join("compilations", id);
			const outDir = path.join(rootDir, ".qatcache");
			fs.mkdirSync(outDir, { recursive: true });
			const filePath = path.join(rootDir, "main.qat");
			fs.writeFileSync(filePath, body.code);
			try {
				childProcess.execSync(
					"qat build " + filePath + " -o " + outDir + " --no-colors",
					{},
				);
			} catch (_) {}
			const result = JSON.parse(
				fs
					.readFileSync(path.join(outDir, "QatCompilationResult.json"))
					.toString(),
			) as CompileResult;
			const binDir = path.join(outDir, "bin");
			let output: string = "";
			const isOutputBig = (otherLen: number): boolean => {
				return output.length + otherLen > 2097152;
			};
			let status: number | undefined = undefined;
			let prematureKill: boolean = false;
			if (fs.existsSync(binDir)) {
				const dirItems = fs.readdirSync(binDir);
				if (dirItems.length > 0) {
					try {
						const proc = childProcess.spawn(
							path.join(binDir, dirItems[0]) +
								(body.arguments.length > 0 ? " " + body.arguments : ""),
						);
						setTimeout(() => {
							if (!proc.killed) {
								prematureKill = true;
								proc.kill();
							}
						}, 5000);
						proc.stdout!.on("data", (val) => {
							if (!isOutputBig((val as string).length)) {
								output += val;
							}
						});
						proc.stderr!.on("data", (val) => {
							if (!isOutputBig((val as string).length)) {
								output += val;
							}
						});
						while (!proc.killed && proc.exitCode === null) {
							const promise = new Promise<any>((resolve) =>
								setTimeout(resolve, 50),
							);
							await promise;
						}
						if (proc.exitCode !== null) {
							status = proc.exitCode;
						}
					} catch (_) {}
				}
			}
			fs.rm(rootDir, { recursive: true }, () => {});
			return res.status(200).send({
				result: result,
				output: output,
				statusCode: status,
				prematureKill: prematureKill,
				overflowedOutput: isOutputBig(0),
			});
		} else {
			return res.status(400).send({});
		}
	}
	return res.status(404).send({});
}
