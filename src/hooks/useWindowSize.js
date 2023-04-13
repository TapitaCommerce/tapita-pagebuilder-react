import { useLayoutEffect, useState } from 'react';

export const useWindowSize = () => {
	if (!window.smpbWindowWidth) {
		window.smpbWindowWidth = Math.max(
			document.documentElement.clientWidth || 0,
			window.innerWidth || 0,
		);
	}
	const [size, setSize] = useState({
		width:
			typeof window !== 'undefined'
				? window.smpbWindowWidth ||
				  Math.max(
				  	document.documentElement.clientWidth || 0,
				  	window.innerWidth || 0,
				  )
				: 1440,
		height:
			typeof window !== 'undefined'
				? window.smpbWindowHeight || window.innerHeight
				: 1440,
	});

	useLayoutEffect(() => {
		const updateSize = () => {
			if (typeof window !== 'undefined') {
				const newWidth = Math.max(
					document.documentElement.clientWidth || 0,
					window.innerWidth || 0,
				);
				const newHeight = window.innerHeight;
				window.smpbWindowWidth = newWidth;
				window.smpbWindowHeight = newHeight;
				setSize({
					width: newWidth,
					height: newHeight,
				});
			}
		};

		if (typeof window !== 'undefined') {
			window.addEventListener('resize', updateSize);
		}
		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('resize', updateSize);
			}
		};
	}, []);

	return size;
};
