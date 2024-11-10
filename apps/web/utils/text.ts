// Mets en majuscule la première lettre d'une chaine de caractère
export const maj = (str: string) => {
	return str && str.charAt(0).toUpperCase() + str.slice(1);
};
