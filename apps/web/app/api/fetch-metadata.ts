import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { url } = req.query;

	if (!url || typeof url !== "string") {
		return res.status(400).json({ error: "Invalid URL" });
	}

	try {
		const response = await axios.get(url);
		const html = response.data;
		const $ = cheerio.load(html);

		const title =
			$("meta[property='og:title']").attr("content") || $("title").text();
		const description =
			$("meta[property='og:description']").attr("content") ||
			$("meta[name='description']").attr("content");
		const image = $("meta[property='og:image']").attr("content");

		res.status(200).json({ title, description, image });
	} catch (error) {
		res.status(500).json({ error: "Error fetching metadata" });
	}
}
