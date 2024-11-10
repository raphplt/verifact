export const credibilityColor = (credibility: number) => {
	if (credibility > 80) return "#4B8F8C";
	if (credibility > 60) return "#ffdfba";
	return "#AD4444";
};
