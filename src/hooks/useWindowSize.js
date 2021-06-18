import { useLayoutEffect, useState } from 'react';

export const useWindowSize = () => {
	const [size, setSize] = useState({ width: 0, height: 0 });
	useLayoutEffect(() => {
		function updateSize() {
			setSize({
				width: Math.max(
					document.documentElement.clientWidth || 0,
					window.innerWidth || 0,
				),
				height: window.innerHeight,
			});
		}
		window.addEventListener('resize', updateSize);
		updateSize();
		return () => window.removeEventListener('resize', updateSize);
	}, []);
	return size;
};
