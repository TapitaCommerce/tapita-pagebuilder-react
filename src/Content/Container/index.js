import React from 'react';
import { useAttention } from '../../hooks/useAttention';

export const Container = (props) => {
	const { itemProps: _itemProps, children } = props;

	const { targetRef, hadAttention } = useAttention({
		requireAttention:
			_itemProps && _itemProps.style && _itemProps.style.backgroundImage,
	});

	const itemProps = {
		..._itemProps,
	};
	if (itemProps.style && itemProps.style.backgroundImage) {
		if (!hadAttention) {
			itemProps.style = { ...itemProps.style, backgroundImage: null };
		}
	}
	return (
		<div ref={targetRef} {...itemProps}>
			{children}
		</div>
	);
};
