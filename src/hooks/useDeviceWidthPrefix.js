import { useEffect, useLayoutEffect, useState } from 'react';

var smpbWindowWidth = false;

const getPrefix = (width) =>
	width >= 1280 ? 'l_' : width >= 1024 ? 't_' : 'm_';

// for future on resize responsiveness
export const useDeviceWidthPrefix = (props) => {
	if (!smpbWindowWidth) {
		smpbWindowWidth = Math.max(
			document.documentElement.clientWidth || 0,
			window.innerWidth || 0,
		);
	}
	const currentWidth =
		typeof window !== 'undefined'
			? smpbWindowWidth ||
			  Math.max(
					document.documentElement.clientWidth || 0,
					window.innerWidth || 0,
			  )
			: 1440;

	const [devicePref, setDevicePref] = useState(getPrefix(currentWidth));

	useLayoutEffect(() => {
		function updateSize() {
			if (typeof window !== 'undefined') {
				const newWidth = Math.max(
					document.documentElement.clientWidth || 0,
					window.innerWidth || 0,
				);
				smpbWindowWidth = newWidth;
				const newPrev = getPrefix(newWidth);
				setDevicePref(newPrev);
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

	return devicePref;
};
