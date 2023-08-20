import React, { Fragment } from 'react';
import { useAttention } from '../../hooks/useAttention';
import { isMobileIos } from '../../Helper/isMobileIos';

const sleep = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

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
		// DONOT REMOVE - this is to fix ios problem when it requires touching twice
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
	if (!itemProps.style.textDecoration) itemProps.style.textDecoration = 'none';
	if (!itemProps.style.color) itemProps.style.color = 'initial';
	if (item.dataParsed && item.dataParsed.nofollow) itemProps.rel = 'nofollow';

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
				{...itemProps}
			>
				{children}
			</Link>
		);
	}

	return (
		<a
			ref={targetRef}
			href={aHref}
			target={openUrlInNewTab ? '_blank' : '_self'}
			{...itemProps}
		>
			{children}
		</a>
	);
};
