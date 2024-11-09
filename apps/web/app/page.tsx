import { Input } from "@nextui-org/react";
import React from "react";

const Home = () => {
	return (
		<div>
			<h1 className="text-5xl pt-20 text-center font-bold">Verifact</h1>
			<Input placeholder="Search for a fact..." className="w-1/2 mx-auto mt-10" />
		</div>
	);
};

export default Home;
