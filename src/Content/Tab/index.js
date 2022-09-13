import React, { useEffect, useState } from 'react';
import { randomString } from '../../Helper/Data';

export const Tab = (props) => {
	const { item, formatMessage, deviceFilterKey } = props;
	const [selectedTab, setSelectedTab] = useState(0);
	const navId = 'tab_nav_ctn_' + randomString(10);
	const itemChildren =
		item && item.children && item.children.length ? item.children : [];
	useEffect(() => {
		try {
			const children = Array.from(
				document.getElementById(navId).parentElement.children,
			);
			children.map((childNode, childNodeIndx) => {
				if (childNodeIndx === 0) {
					// itself
				} else if (childNodeIndx - 1 !== selectedTab) {
					childNode.style.display = 'none';
				} else {
					const childItem = itemChildren[selectedTab];
					let newDisplayStyle = 'flex';
					if (
						childItem &&
						childItem.stylesParsed &&
						childItem.stylesParsed.display
					)
						newDisplayStyle = childItem.stylesParsed.display;
					childNode.style.display = newDisplayStyle;
				}
			});
		} catch (err) {}
	}, [item, selectedTab]);
	return (
		<div
			id={navId}
			className={`spbitem-tab-nav ${
				item.dataParsed &&
				(item.dataParsed.tabTitleNavPos === 'left' ||
					item.dataParsed.tabTitleNavPos === 'right')
					? 'vertical'
					: 'horizontal'
			}`}
		>
			{itemChildren.map((childItem, childIndx) => {
				const itemStyle = childItem.stylesParsed || {};
				// add device styles
				Object.keys(itemStyle).forEach((key) => {
					if (key.includes(deviceFilterKey)) {
						const styleKey = key.replace(deviceFilterKey, '');
						itemStyle[styleKey] = itemStyle[key];
					}
				});
				const isActiveTab = selectedTab === childIndx;
				const tabStyle = {};
				if (itemStyle.color) {
					tabStyle.color = itemStyle.color;
				}
				if (isActiveTab) {
					if (itemStyle.backgroundColor) {
						tabStyle.backgroundColor = itemStyle.backgroundColor;
					}
				} else {
					if (itemStyle.fontWeight) {
						tabStyle.fontWeight = itemStyle.fontWeight;
					}
				}
				const content =
					formatMessage && childItem.name
						? formatMessage({ val: childItem.name })
						: childItem.name;
				return (
					<div
						key={childItem.entity_id}
						className={`spbitem-tab-nav-item ${
							isActiveTab ? 'active' : 'inactive'
						}`}
						style={tabStyle}
						onClick={(e) => setSelectedTab(childIndx)}
					>
						{content}
					</div>
				);
			})}
		</div>
	);
};
