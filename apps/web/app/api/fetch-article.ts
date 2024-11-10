import fetchAxios from "../../utils/fetch";

interface Article {
	id: number;
	title: string;
	content: string;
	siteName: string;
	contentLength: number;
}

async function getArticleData(url: string) {
	try {
		const article: Article = await fetchAxios<Article>(url);
		console.log(article);
	} catch (error) {
		console.error("Error fetching article data:", error);
	}
}

const url = "https://api.example.com/articles/1";
getArticleData(url);
