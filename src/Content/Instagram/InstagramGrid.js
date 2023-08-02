import React from 'react';
import { MEDIA_TYPE } from '../../Helper/detectMediaType';

const INSTAGRAM_MEDIA_MAP = {
	IMAGE: MEDIA_TYPE.IMAGE,
	CAROUSEL_ALBUM: MEDIA_TYPE.IMAGE,
	VIDEO: MEDIA_TYPE.VIDEO,
};

const VIDEO_DISPLAY = {
	NO_POSTER: 1,
	SHOW_POSTER_AND_VIDEO: 2,
	SHOW_POSTER_AND_LINK: 3,
};

export const InstagramGrid = (props) => {
	const {
		data,
		limit,
		disabledTypes = [],
		videoDisplayChoice = VIDEO_DISPLAY.SHOW_POSTER_AND_VIDEO,
	} = props;

	if (!data || data.length === 0) {
		return null;
	}

	return data
		.filter((t) => {
			return (
				t &&
				INSTAGRAM_MEDIA_MAP[t.media_type] &&
				!disabledTypes.includes(t.media_type)
			);
		})
		.slice(0, limit)
		.map((insItem) => {
			const mediaType = INSTAGRAM_MEDIA_MAP[insItem.media_type];
			let mediaCore = null;
			if (mediaType === MEDIA_TYPE.IMAGE) {
				mediaCore = (
					<img src={insItem.media_url} loading='lazy' alt='instagram-image' />
				);
			} else {
				switch (videoDisplayChoice) {
					case VIDEO_DISPLAY.SHOW_POSTER_AND_LINK: {
						mediaCore = (
							<img
								src={insItem.thumbnail_url}
								loading='lazy'
								alt='instagram-video'
							/>
						);
						break;
					}
					case VIDEO_DISPLAY.SHOW_POSTER_AND_VIDEO:
					case VIDEO_DISPLAY.NO_POSTER: {
						const videoConfig = {
							controls: 1,
							preload: 'none',
						};
						if (videoDisplayChoice === VIDEO_DISPLAY.SHOW_POSTER_AND_VIDEO) {
							videoConfig.poster = insItem.thumbnail_url;
						}
						mediaCore = (
							<video {...videoConfig}>
								<source src={insItem.media_url} type='video/mp4' />
								Your browser does not support the video tag.
							</video>
						);
						break;
					}
				}
			}
			if (!mediaCore) {
				return null;
			}

			return (
				<a
					key={insItem.id}
					className='simipb-insta-item'
					href={insItem.permalink}
				>
					{mediaCore}
				</a>
			);
		});
};
