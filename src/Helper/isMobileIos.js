export const isMobileIos = () => {
	return (
		[
			'iPad Simulator',
			'iPhone Simulator',
			'iPod Simulator',
			'iPad',
			'iPhone',
			'iPod',
		].includes(navigator.platform) ||
		(navigator.userAgent.includes('Mac') && 'ontouchend' in document)
	);
};

export const sleep = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};
