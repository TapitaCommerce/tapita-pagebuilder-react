import React, { Fragment } from 'react';
import { useAttention } from '../../hooks/useAttention';
import { isMobileIos, sleep } from '../../Helper/isMobileIos';

export const SurroundLink = (props) => {
	const { item, itemProps: _itemProps, aHref, Link, children } = props;
	const { targetRef, hadAttention } = useAttention({
		requireAttention:
			_itemProps && _itemProps.style && _itemProps.style.backgroundImage,
	});

	const itemProps = {
		..._itemProps,
		onClick: null,
	};
	try {
		delete itemProps.onClick;
		// DO NOT REMOVE - this is to fix ios problem when it requires touching twice
		if (isMobileIos() && aHref) {
			itemProps.onMouseEnter = async () => {
				await sleep(150);
			};
		}
	} catch (err) {}
	if (itemProps.style && itemProps.style.backgroundImage) {
		if (!hadAttention) {
			itemProps.style = { ...itemProps.style, backgroundImage: null };
		}
	}

	const openUrlInNewTab = parseInt(item.dataParsed.openUrlInNewTab) === 1;
	const openUrlSEOTitle = item.dataParsed.openUrlSEOTitle || '';

	if (!itemProps.style.textDecoration) itemProps.style.textDecoration = 'none';
	if (!itemProps.style.color) itemProps.style.color = 'initial';
	if (item.dataParsed && item.dataParsed.nofollow) itemProps.rel = 'nofollow';

	const sharedProps = {};
	if (openUrlSEOTitle) {
		sharedProps.title = openUrlSEOTitle;
	}

	if (
		Link &&
		item.dataParsed.openUrl &&
		item.dataParsed.openUrl.indexOf('http') === -1
	) {
		return (
			<Link
				ref={targetRef}
				to={aHref}
				target={openUrlInNewTab ? '_blank' : '_self'}
				{...sharedProps}
				{...itemProps}
			>
				{children}
			</Link>
		);
	}

	const target = openUrlInNewTab ? '_blank' : '_self';

	return (
		<a
			ref={targetRef}
			href={aHref}
			target={target}
			rel={target === '_blank' ? 'noopener' : ''}
			{...sharedProps}
			{...itemProps}
		>
			{children}
		</a>
	);
};
