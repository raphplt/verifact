/* eslint-disable @next/next/no-img-element */
"use client";
import { Button, Chip, Input, Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";

const url = process.env.NEXT_PUBLIC_API_URL;

type Response = {
	credibility: number;
	resume: string;
	keywords: string[];
	imageUrl: string;
};

type Metadata = {
	title: string;
	description: string;
	image: string;
	siteName: string;
};

const Home = () => {
	const [searchValue, setSearchValue] = useState("");
	const [response, setResponse] = useState<Response | null>(null);
	const [metadata, setMetadata] = useState<Metadata | null>(null);
	const [loading, setLoading] = useState(false);
	const [articles, setArticles] = useState([]);

	useEffect(() => {
		(async () => {
			try {
				const response = await axios.get(`${url}/article`);
				setArticles(response.data);
			} catch (error) {
				console.error("Error fetching articles:", error);
			}
		})();
	}, []);

	const onSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);

		// Reset the search results
		setResponse(null);
		setMetadata(null);

		if (!e.target.value) {
			return;
		}

		try {
			// Fetch metadata from NestJS backend
			const metadataResponse = await axios.get(`${url}/metadata`, {
				params: { url: e.target.value },
			});
			setMetadata(metadataResponse.data);
		} catch (error) {
			console.error("Error fetching metadata:", error);
			setMetadata(null);
		}
	};

	const handleClick = async () => {
		setLoading(true);
		if (searchValue) {
			try {
				// Fetch OpenAI completion
				const response = await axios.post(`${url}/openai/completion`, {
					url: searchValue,
					metadata,
				});
				setResponse(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching data:", error);
				setLoading(false);
			}
		}
	};

	const credibilityColor = (credibility: number) => {
		if (credibility > 80) return "#4B8F8C";
		if (credibility > 60) return "#ffdfba";
		return "#AD4444";
	};

	return (
		<div>
			<h1 className="text-5xl pt-20 text-center font-bold">Verifact</h1>
			<p className="text-center text-gray-500 text-lg w-1/2 mx-auto py-5">
				Verifact est un outil qui vous permet de vérifier les faits et de vérifier
				la véracité des informations que vous trouvez en ligne.
			</p>
			<div className="flex flex-row items-center justify-center w-2/3 mx-auto gap-5 my-20 py-1">
				<Input
					placeholder="Entrez l'URL de l'article à vérifier"
					className="mx-auto bg-transparent"
					onChange={onSearch}
					size="lg"
				/>
				<Button isIconOnly onClick={handleClick} size="lg">
					<Icon icon="formkit:arrowright" width={24} />
				</Button>
			</div>

			{metadata && (
				<div className="w-1/2 mx-auto flex flex-col items-center justify-center gap-5 bg-gray-100 py-10 px-10 pt-10 rounded-xl shadow-lg">
					<div className=" flex flex-row items-center justify-center gap-5 bg-gray-100 py-2">
						<img
							src={metadata.image}
							alt="Article Image"
							className="w-32 h-32 object-cover rounded-lg"
						/>
						<div className="flex flex-col justify-between">
							<p>{metadata.siteName}</p>
							<h2>{metadata.title}</h2>
							<p className="text-gray-500 text-sm">{metadata.description}</p>
						</div>
					</div>
					{loading && <Spinner color="primary" />}

					{response && (
						<>
							<div className="w-full h-1 bg-gray-200 my-5	"></div>
							<div className=" flex flex-col items-center justify-center gap-5">
								{response.keywords && response.keywords.length > 0 && (
									<div className="flex flex-row items-center justify-start gap-2 w-full">
										{response.keywords.map((keyword: string) => (
											<Chip key={keyword} className="p-1 text-center rounded-full w-1/8">
												{keyword}
											</Chip>
										))}
									</div>
								)}
								<div className="flex flex-row items-center justify-between gap-5">
									<div className="">
										<strong>Résumé de l'article</strong>
										<h2>{response.resume}</h2>
									</div>

									<div className="flex flex-col items-center justify-between h-full">
										<strong>Crédibilité</strong>
										<Chip
											className="text-white"
											style={{
												backgroundColor: credibilityColor(response.credibility),
											}}
										>
											<p>{response.credibility}/100</p>
										</Chip>
									</div>
								</div>
							</div>
						</>
					)}
				</div>
			)}

			{articles.length > 0 && (
				<div className="w-1/2 mx-auto py-10">
					<h2 className="text-2xl font-bold">Articles récents</h2>
					<div className="grid grid-cols-1 gap-5 py-5">
						{articles.map((article: any) => (
							<div
								key={article.id}
								className="bg-gray-100 p-5 rounded-xl shadow-lg flex flex-col items-center justify-between"
							>
								<img
									src={article.imageUrl}
									alt="Article Image"
									className="w-32 h-32 object-cover rounded-lg"
								/>
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
										<Chip key={keyword.id} className="p-1 text-center rounded-full w-1/8">
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

export default Home;
