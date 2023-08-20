import React, { useEffect, useMemo, useRef } from 'react';
import { listToTree } from '../Helper/Data';
import { useDeviceWidthPrefix } from '../hooks/useDeviceWidthPrefix';
import LayoutItem from './LayoutItem';

const PbContent = (props) => {
	const {
		data: { spb_item, spb_page },
		ProductList,
		ProductGrid,
		Category,
		formatMessage,
		ProductScroll,
		CategoryScroll,
		history,
		Link,
		lazyloadPlaceHolder,
		overRender,
		layoutFilter,
		filterRootChildrenOnly,
		translateParagraph,
		translatePlaceholder,
		mode,
	} = props;

	const selfRef = useRef(null);
	const deviceFilterKey = useDeviceWidthPrefix();
	const pageData =
		spb_page && spb_page.items && spb_page.items[0] ? spb_page.items[0] : false;
	const isRtl = pageData && pageData.is_rtl;

	const renderItem = (item, children, parent) => {
		return (
			<LayoutItem
				item={item}
				children={children}
				parent={parent}
				key={item.entity_id || 'noid'}
				{...{
					ProductList,
					ProductGrid,
					Category,
					formatMessage,
					ProductScroll,
					CategoryScroll,
					history,
					Link,
					lazyloadPlaceHolder,
					overRender,
					layoutFilter,
					filterRootChildrenOnly,
					translateParagraph,
					translatePlaceholder,
					mode,
					deviceFilterKey,
					isRtl,
				}}
			/>
		);
	};

	/*
    Recursive render
    */
	const recursiveRender = (childrenArray, parent) => {
		const returnedItems = [];
		if (childrenArray) {
			childrenArray.map((item) => {
				const children = recursiveRender(item.children, item);
				returnedItems.push(renderItem(item, children, parent));
				return null;
			});
		}
		return returnedItems;
	};

	const renderItems = (itemTree) => {
		const children = recursiveRender(itemTree.children);
		return renderItem({ root: true }, children);
	};

	const rootItem = {
		id: 'root',
	};
	let newTree;
	if (spb_item) {
		newTree = JSON.parse(JSON.stringify(spb_item.items));
	} else {
		newTree = JSON.parse(spb_page.items[0].publish_items);
	}
	newTree = listToTree(newTree);
	rootItem.children = newTree;

	const classNames = useMemo(() => {
		return ['smpb-container']
			.filter(Boolean)
			.join(' ');
	}, []);

	useEffect(() => {
		if (selfRef.current && global.window && global.URL && window.location) {
			const url = new global.URL(global.window.location);
			const hash = url.hash;
			if (hash) {
				try {
					const el = selfRef.current.querySelector(hash);
					if (el) {
						setImmediate(() => {
							el.scrollIntoView();
						});
					}
				} catch (e) {
					console.warn(e);
				}
			}
		}
	}, []);

	return (
		<div
			ref={selfRef}
			className={classNames}
			style={{ direction: isRtl ? 'rtl' : 'ltr' }}
		>
			{renderItems(rootItem)}
		</div>
	);
};

export default PbContent;
