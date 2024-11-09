"use client";
import { Button, Input } from "@nextui-org/react";
import React, { useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";

const url = process.env.NEXT_PUBLIC_API_URL;

type Response = {
	credibility: number;
	resume: string;
};

const Home = () => {
	const [searchValue, setSearchValue] = useState("");
	const [response, setResponse] = useState<Response | null>(null);
	const [loading, setLoading] = useState(false);

	const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	const handleClick = async () => {
		setLoading(true);
		if (searchValue) {
			try {
				const response = await axios.post(`${url}/openai/completion`, {
					url: searchValue,
				});
				setResponse(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching metadata:", error);
			}
		}
	};

	const credibilityColor = (credibility: number) => {
		if (credibility > 80) return "#77dd77";
		if (credibility > 60) return "#ffdfba";
		return "#ff6961";
	};

	return (
		<div>
			<h1 className="text-5xl pt-20 text-center font-bold">Verifact</h1>
			<p className="text-center text-gray-500 text-lg w-1/2 mx-auto py-5">
				Verifact est un outil qui vous permet de vérifier les faits et de vérifier
				la véracité des informations que vous trouvez en ligne.
			</p>
			<div className="flex flex-row items-center justify-center w-1/2 mx-auto gap-5 py-5">
				<Input
					placeholder="Entrez l'URL de l'article à vérifier"
					className="mx-auto"
					onChange={onSearch}
				/>
				<Button
					onClick={handleClick}
					endContent={<Icon icon="material-symbols:search" width={32} />}
				>
					Rechercher
				</Button>
			</div>
			{loading && (
				<div className="w-1/2 mx-auto flex flex-col items-center justify-center gap-5">
					{/* <Icon */}
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
				</div>
			)}
			{response && (
				<div className="w-1/2 mx-auto flex flex-col items-center justify-center gap-5 bg-gray-100 py-10 px-10 pt-10 rounded-xl shadow-lg">
					<div>
						<strong>Résumé de l'article</strong>
						<h2>{response.resume}</h2>
					</div>
					<div
						className="p-4 text-white text-center rounded-full w-fit"
						style={{
							backgroundColor: credibilityColor(response.credibility),
						}}
					>
						<strong>Crédibilité</strong>
						<p>{response.credibility}/100</p>
					</div>
				</div>
			)}
			{/* {metadata && (
				<div className="preview">
					<h2>{metadata.title}</h2>
					{metadata.image && <img src={metadata.image} alt={metadata.title} />}
					<p>{metadata.description}</p>
				</div>
			)} */}
		</div>
	);
};

export default Home;
