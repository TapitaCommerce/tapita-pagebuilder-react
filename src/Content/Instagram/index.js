import React, { useCallback, useState } from 'react';
import { tryParseJSON } from '../../Helper/tryParseJSON';
import { sendRequest } from '../../Network/GraphQl';

export const Instagram = (props) => {
	const { item } = props;

	const [data, setData] = useState(false);
	let requestUrl =
		'https://graph.instagram.com/me/media?fields=media_count,media_type,permalink,media_url&';
	const parsedStyle = tryParseJSON(item.styles, {});
	const type = parsedStyle.type;
	const parsedData = item.dataParsed
		? item.dataParsed
		: tryParseJSON(item.data, {});

	const { instaAccessToken, instaItemCount } = parsedData;
	if (!instaAccessToken) {
		return '';
	} else {
		requestUrl += '&access_token=' + instaAccessToken;
	}
	const limit = instaItemCount ? parseInt(instaItemCount) : 10;

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
	if (data && data.length) {
		const returnedItm = [];
		data.map((insItem) => {
			if (
				limit > returnedItm.length &&
				insItem &&
				(insItem.media_type === 'IMAGE' || insItem.media_type === 'VIDEO')
			) {
				returnedItm.push(
					<a
						key={insItem.id}
						className='simipb-insta-item'
						href={insItem.permalink}
					>
						{insItem.media_type === 'IMAGE' ? (
							<img src={insItem.media_url} />
						) : (
							<video src={insItem.media_url} />
						)}
					</a>,
				);
			}
		});
		return <React.Fragment>{returnedItm}</React.Fragment>;
	}

	return '';
};
