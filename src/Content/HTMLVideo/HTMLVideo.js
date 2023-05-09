import React, { Fragment } from 'react';

const NO_SUPPORT = 'Your browser does not support the video tag.';

export const _HtmlVideo = (props) => {
	const {
		width,
		size,
		showControl,
		imgCover,
		videoURL,
		formatMessage,
		style,
		autoplay,
		loop,
	} = props;

	if (!videoURL) {
		return '';
	}

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<video
				width='100%'
				height='auto'
				controls={showControl || false}
				poster={imgCover || undefined}
				style={style}
				autoPlay={autoplay || false}
				muted={autoplay || false}
				loop={loop || false}
			>
				<source src={videoURL} />
				{formatMessage({ val: NO_SUPPORT })}
			</video>
		</div>
	);
};

export const HtmlVideo = React.memo(_HtmlVideo, (prevProps, nextProps) => {
	return JSON.stringify(prevProps) === JSON.stringify(nextProps);
});
