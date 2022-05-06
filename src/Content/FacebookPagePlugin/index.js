import React from 'react';

// implemented according to https://developers.facebook.com/docs/plugins/page-plugin/

const DEFAULT_SHARE_URL = 'https://www.facebook.com/simicart';
export const FacebookPagePlugin = (props) => {
	const { item } = props;

	const {
		shareUrl,
		tabs,
		hideCover = false,
		hideCta = false,
		smallHeader = false,
		showFacepile = true,
		fLazy = false, // lazy as in facebook term
		height: dataHeight = '340',
	} = item.dataParsed || {};

	// default from facebook site
	const { height = dataHeight, width = '340' } = item.stylesParsed;

	const iframeSrc = new URL('https://www.facebook.com/plugins/page.php');
	iframeSrc.searchParams.append('href', shareUrl || DEFAULT_SHARE_URL);
	iframeSrc.searchParams.append('appId', '');
	iframeSrc.searchParams.append('tabs', tabs || '');

	iframeSrc.searchParams.append('hide_cover', hideCover);
	iframeSrc.searchParams.append('hide_cta', hideCta);
	iframeSrc.searchParams.append('small_header', smallHeader);
	iframeSrc.searchParams.append('show_facepile', showFacepile);
	iframeSrc.searchParams.append('lazy', fLazy);

	return (
		<iframe
			src={iframeSrc.href}
			width={width}
			height={height}
			style={{ border: 'none', overflow: 'hidden' }}
			scrolling='no'
			frameBorder='0'
			allowFullScreen='true'
			allow='autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share'
		></iframe>
	);
};
