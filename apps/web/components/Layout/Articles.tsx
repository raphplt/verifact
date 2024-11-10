import React, { useEffect, useState } from "react";
import { credibilityColor } from "../../utils/color";
import { Chip } from "@nextui-org/react";
import axios from "axios";
import { baseUrl } from "../../utils/constants";

const Articles = () => {
	const [articles, setArticles] = useState([]);

	useEffect(() => {
		(async () => {
			try {
				const response = await axios.get(`${baseUrl}/article`);
				setArticles(response.data);
			} catch (error) {
				console.error("Error fetching articles:", error);
			}
		})();
	}, []);

	return (
		<div>
			{articles.length > 0 && (
				<div className="w-2/3 mx-auto py-10">
					<h2 className="text-2xl font-bold">Articles récents</h2>
					<div className="grid grid-cols-1 gap-5 py-5">
						{articles
							.sort(
								(a: any, b: any) =>
									new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
							)
							.map((article: any) => (
								<div
									key={article.id}
									className="bg-gray-100 p-5 rounded-xl shadow-lg flex flex-col items-center justify-between"
								>
									<div className="flex flex-row items-center justify-start gap-2 w-full">
										<Chip
											className="p-1 text-white text-center rounded-full w-1/8"
											style={{
												backgroundColor: credibilityColor(article.credibilityScore),
											}}
										>
											{article.credibilityScore}/100
										</Chip>
										{article.keywords.map((keyword: any) => (
											<Chip
												key={keyword.id}
												className="p-1 text-center rounded-full w-1/8"
											>
												{keyword.name}
											</Chip>
										))}
									</div>
									<div className="flex flex-col items-start py-2 justify-start w-full">
										<strong>{article.siteName}</strong>
										<p>{article.title}</p>
										<p>{article.description}</p>
										{article.imageUrl && (
											<img
												src={article.imageUrl}
												alt="Article Image"
												className="w-32 h-32 object-cover rounded-lg"
											/>
										)}
									</div>
								</div>
							))}
					</div>
				</div>
			)}
		</div>
	);
};

export default Articles;
