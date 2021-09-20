import { useLayoutEffect, useState } from 'react';

export const useWindowSize = () => {
	const [size, setSize] = useState({
		width: typeof window !== 'undefined' ? 0 : 1280,
		height: typeof window !== 'undefined' ? 0 : 1280,
	});
	useLayoutEffect(() => {
		function updateSize() {
			if (typeof window !== 'undefined') {
				const newWidth = Math.max(
					document.documentElement.clientWidth || 0,
					window.innerWidth || 0,
				);
				const newHeight = window.innerHeight;
				if (
					newWidth !== window.smpbWindowWidth ||
					Math.abs(newHeight - window.smpbWindowHeight) > 160
				) {
					window.smpbWindowWidth = newWidth;
					window.smpbWindowHeight = newHeight;
					setSize({
						width: newWidth,
						height: newHeight,
					});
				}
			}
		}
		if (typeof window !== 'undefined') {
			window.addEventListener('resize', updateSize);
			updateSize();
		}
		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('resize', updateSize);
			}
		};
	}, []);
	return size;
};
