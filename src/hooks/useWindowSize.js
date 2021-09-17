import { useLayoutEffect, useState } from 'react';

export const useWindowSize = () => {
	const [size, setSize] = useState({ width: 0, height: 0 });
	useLayoutEffect(() => {
		function updateSize() {
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
		window.addEventListener('resize', updateSize);
		updateSize();
		return () => window.removeEventListener('resize', updateSize);
	}, []);
	return size;
};
