import type { Metadata } from "next";
import "./globals.css";

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
			<body>{children}</body>
		</html>
	);
}
