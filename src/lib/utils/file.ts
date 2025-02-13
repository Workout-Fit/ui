export const getFileFromURL = async (url: string, fetch = window.fetch) => {
	const blob = await (await fetch(url)).blob();
	return new File([blob], 'avatar.webp', { type: blob.type });
};
