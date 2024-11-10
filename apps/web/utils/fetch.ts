import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

async function fetchAxios<T>(
	url: string,
	config?: AxiosRequestConfig
): Promise<T> {
	try {
		const response: AxiosResponse<T> = await axios.get<T>(baseURL + url, config);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("Axios error:", error.message);
			throw new Error(error.message);
		} else {
			console.error("Unexpected error:", error);
			throw new Error("An unexpected error occurred");
		}
	}
}

export default fetchAxios;
