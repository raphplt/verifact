import { Button } from "@nextui-org/react";
import React from "react";

const Header = () => {
	return (
		<header className="fixed top-0 z-50 w-full h-fit flex items-center justify-between pt-2 px-10">
			<div className="text-2xl font-bold">Verifact</div>
			<div className="flex flex-row gap-3 items-center">
				<Button color="primary" className="mx-2">
					Accueil
				</Button>
				<Button color="primary" variant="bordered" className="mx-2">
					À propos
				</Button>
			</div>
		</header>
	);
};

export default Header;
