import React, { Fragment } from 'react';

const NO_SUPPORT = 'Your browser does not support the video tag.';

export const _HtmlVideo = (props) => {
	const { width, size, showControl, imgCover, videoURL, formatMessage } = props;

	if (!videoURL) {
		return '';
	}

	return (
		<Fragment>
			<video
				width={size || width || '100%'}
				height={size || 'auto'}
				controls={showControl || false}
				poster={imgCover || undefined}
			>
				<source src={videoURL} />
				{formatMessage({ val: NO_SUPPORT })}
			</video>
		</Fragment>
	);
};

export const HtmlVideo = React.memo(_HtmlVideo, (prevProps, nextProps) => {
	const { width, size, showControl, videoURL } = prevProps || {};
	const { width1, size1, showControl1, videoURL1 } = nextProps || {};

	return (
		width === width1 &&
		size === size1 &&
		showControl === showControl1 &&
		videoURL === videoURL1
	);
});
