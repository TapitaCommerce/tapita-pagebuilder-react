import { useLayoutEffect, useState } from 'react';

var smpbWindowWidth = false;
var smpbWindowHeight = false;

export const useWindowSize = () => {
	if (!smpbWindowWidth) {
		smpbWindowWidth = Math.max(
			document.documentElement.clientWidth || 0,
			window.innerWidth || 0,
		);
	}
	const [size, setSize] = useState({
		width:
			typeof window !== 'undefined'
				? smpbWindowWidth ||
				  Math.max(
						document.documentElement.clientWidth || 0,
						window.innerWidth || 0,
				  )
				: 1440,
		height:
			typeof window !== 'undefined'
				? smpbWindowHeight || window.innerHeight
				: 1440,
	});
	useLayoutEffect(() => {
		function updateSize() {
			if (typeof window !== 'undefined') {
				const newWidth = Math.max(
					document.documentElement.clientWidth || 0,
					window.innerWidth || 0,
				);
				const newHeight = window.innerHeight;
				if (newWidth !== smpbWindowWidth) {
					smpbWindowWidth = newWidth;
					smpbWindowHeight = newHeight;
					setSize({
						width: newWidth,
						height: newHeight,
					});
				}
			}
		}
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
