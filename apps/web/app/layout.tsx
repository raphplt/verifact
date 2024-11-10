import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Layout/Header";

export const metadata: Metadata = {
	title: "Verifact",
	description: "Pour une source d'information plus sûre",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fr">
			<body>
				<Header />

				{children}
			</body>
		</html>
	);
}
