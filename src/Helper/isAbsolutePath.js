export const isAbsolutePath = (urlString) =>
	urlString.indexOf('http://') === 0 || urlString.indexOf('https://') === 0;
