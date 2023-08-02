import React, { useMemo, useState } from 'react';
import { tryParseJSON } from '../../Helper/tryParseJSON';
import { sendRequest } from '../../Network/GraphQl';
import { InstagramGrid } from './InstagramGrid';

const STARTLE_URL =
	'https://graph.instagram.com/me/media?fields=media_count,media_type,permalink,media_url,thumbnail_url';

export const Instagram = (props) => {
	const { item } = props;

	const [data, setData] = useState(false);

	const parsedData = item.dataParsed
		? item.dataParsed
		: tryParseJSON(item.data, {});

	const {
		instaAccessToken,
		instaItemCount,
		disabledTypes = [],
		videoDisplayChoice,
	} = parsedData;

	const limit = instaItemCount ? parseInt(instaItemCount) : 10;

	const requestUrl = useMemo(() => {
		const urlObj = new URL(STARTLE_URL);
		urlObj.searchParams.set('limit', limit);
		if (instaAccessToken) {
			urlObj.searchParams.set('access_token', instaAccessToken);
		}
		return urlObj.href;
	}, [instaAccessToken, limit]);

	if (!instaAccessToken) {
		return null;
	}

	if (!data) {
		sendRequest(
			requestUrl,
			(result) => {
				if (result && result.data) {
					setData(result.data);
				}
			},
			'',
			{},
			'getInstaFeed',
		);
	}

	return (
		<InstagramGrid
			token={instaAccessToken}
			data={data}
			limit={limit}
			disabledTypes={disabledTypes}
			videoDisplayChoice={videoDisplayChoice}
		/>
	);
};
