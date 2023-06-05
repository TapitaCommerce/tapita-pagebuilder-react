import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAttention } from '../../hooks/useAttention';

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
	const {
		width,
		size,
		showControl,
		videoURL,
		formatMessage,
		style,
		autoplay,
		loop,
		lazy,
	} = props;
	const [currentVideoHeight, setCurrentVideoHeight] = useState(null);
	const containerRef = useRef(null);

	const { targetRef, hadAttention } = useAttention({
		requireAttention: !!videoURL,
	});

	useLayoutEffect(() => {
		if (containerRef.current) {
			const { width } = containerRef.current.getBoundingClientRect();
			setCurrentVideoHeight((width * 2) / 3);
		}
	}, [containerRef.current, hadAttention, videoURL]);

	if (!videoURL) {
		return '';
	}
	const customControlArgs = {
		controls: showControl ? 1 : 0,
		autoplay: autoplay ? 1 : 0,
		mute: autoplay ? 1 : 0,
		loop: loop ? 1 : 0,
		playlist: loop ? extractVideoId(videoURL) : null,
	};

	const urlObj = new URL(changeShareURLToEmbedded(videoURL));
	Object.keys(customControlArgs).forEach(function (key) {
		const v = customControlArgs[key];
		if (v !== null) {
			urlObj.searchParams.set(key, v);
		}
	});

	const coreComponent =
		videoURL && !hadAttention ? (
			<span />
		) : (
			<iframe
				loading={lazy ? 'lazy' : 'eager'}
				height={currentVideoHeight || 'auto'}
				width='100%'
				allowFullScreen
				frameBorder='0'
				src={urlObj.toString()}
				ref={containerRef}
				style={style}
			/>
		);

	return (
		<React.Fragment>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
				}}
				className={`magic-yt-video-container-${size || width || '100%'}`}
				ref={targetRef}
			>
				{coreComponent}
			</div>
		</React.Fragment>
	);
};

export const YoutubeVideo = React.memo(
	_YoutubeVideo,
	(prevProps, nextProps) => {
		const { width, size, showControl, videoURL, imgCover, style } =
			prevProps || {};
		const { width1, size1, showControl1, videoURL1, imgCover1, style1 } =
			nextProps || {};

		return (
			width === width1 &&
			size === size1 &&
			showControl === showControl1 &&
			videoURL === videoURL1 &&
			imgCover === imgCover1 &&
			JSON.stringify(style) === JSON.stringify(style1)
		);
	},
);
