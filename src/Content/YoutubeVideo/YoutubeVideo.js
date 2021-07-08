import React, { useLayoutEffect, useRef, useState } from 'react';

const defaultVideoLink = 'OrzMIhLpVps';

const extractVideoId = (shareURL) => {
	try {
		const uOb = new URL(shareURL);
		const vParams = uOb.searchParams.get('v');
		if (vParams) {
			// case copy from link
			return vParams;
		} else {
			return uOb.pathname.slice(1);
		}
	} catch (e) {
		return defaultVideoLink;
	}
};

const changeShareURLToEmbedded = (shareURL) => {
	const videoId = extractVideoId(shareURL);
	return `https://www.youtube.com/embed/${videoId}`;
};

export const _YoutubeVideo = (props) => {
	const { width, size, showControl, videoURL, formatMessage } = props;
	const [currentVideoHeight, setCurrentVideoHeight] = useState(null);
	const containerRef = useRef(null);

	useLayoutEffect(() => {
		if (containerRef.current) {
			const { width } = containerRef.current.getBoundingClientRect();
			setCurrentVideoHeight((width * 2) / 3);
		}
	}, []);

	if (!videoURL) {
		return '';
	}

	return (
		<div
			ref={containerRef}
			className={`magic-yt-video-container-${size || width || '100%'}`}
		>
			<iframe
				height={currentVideoHeight || size || 'auto'}
				width={size || width || '100%'}
				allowFullScreen=''
				frameBorder='0'
				src={
					changeShareURLToEmbedded(videoURL) +
					`?controls=${showControl ? 1 : 0}`
				}
			/>
		</div>
	);
};

export const YoutubeVideo = React.memo(
	_YoutubeVideo,
	(prevProps, nextProps) => {
		const { width, size, showControl, videoURL } = prevProps || {};
		const { width1, size1, showControl1, videoURL1 } = nextProps || {};

		return (
			width === width1 &&
			size === size1 &&
			showControl === showControl1 &&
			videoURL === videoURL1
		);
	},
);
