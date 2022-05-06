export const convertBoxShadowToTextShadow = (boxShadowStyleText) => {
	// current implementation of shadow style selector always have full options:
	// ie: box-shadow: w h blur span color
	if (!boxShadowStyleText) {
		return 'none';
	}
	const splittedStyle = boxShadowStyleText.split(' ');

	// style string need to have at least 5 slots to fill span property
	if (splittedStyle < 5) {
		// implementation changed
		return boxShadowStyleText;
	} else {
		// remove span
		return splittedStyle.slice(0, 3).concat(splittedStyle.slice(4)).join(' ');
	}
};
