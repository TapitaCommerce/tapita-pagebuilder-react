import React from 'react';
import { tryParseJSON } from '../../../Helper/tryParseJSON';
import InstagramFeed from 'react-ig-feed';
import 'react-ig-feed/dist/index.css';

export const Instagram = (props) => {
	const { item } = props;

	const parsedStyle = tryParseJSON(item.styles, {});
	const type = parsedStyle.type;
	const parsedData = item.dataParsed
		? item.dataParsed
		: tryParseJSON(item.data, {});

	const { instaUserId, accessToken } = parsedData;

	if (!instaUserId || !accessToken) {
		return '';
	}

	return (
		<div>
			<InstagramFeed token={accessToken} counter='12' />
		</div>
	);
};
