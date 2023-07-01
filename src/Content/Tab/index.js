import React from 'react';
import { randomString } from '../../Helper/Data';

export const Tab = (props) => {
	const { item, formatMessage, deviceFilterKey } = props;
	const navId = 'tab_nav_ctn_' + randomString(10);
	const itemChildren =
		item && item.children && item.children.length ? item.children : [];

	const handleSwitchTab = (selectedTab) => {
		const currentNavItem = document.getElementById(navId);
		const tabNavtrs = Array.from(currentNavItem.children);
		tabNavtrs.map((childNode, childNodeIndx) => {
			const childItem = itemChildren[childNodeIndx];
			const itemStyle =
				childItem && childItem.stylesParsed ? childItem.stylesParsed : {};
			// add device styles
			Object.keys(itemStyle).forEach((key) => {
				if (key.includes(deviceFilterKey)) {
					const styleKey = key.replace(deviceFilterKey, '');
					itemStyle[styleKey] = itemStyle[key];
				}
			});

			if (childNodeIndx !== selectedTab) {
				childNode.classList.remove('active');
				childNode.classList.add('inactive');
				childNode.style.backgroundColor = 'initial';
				childNode.style.fontWeight = itemStyle.fontWeight;
			} else {
				childNode.classList.remove('inactive');
				childNode.classList.add('active');

				childNode.style.fontWeight = 'initial';
				childNode.style.backgroundColor = itemStyle.backgroundColor;
			}
		});
		const children = Array.from(currentNavItem.parentElement.children);
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
	};
	React.useEffect(() => {
		try {
			handleSwitchTab(0);
		} catch (err) {}
	}, []);

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
				const tabStyle = {};
				if (itemStyle.color) {
					tabStyle.color = itemStyle.color;
				}

				const content =
					formatMessage && childItem.name
						? formatMessage({ val: childItem.name })
						: childItem.name;
				return (
					<div
						key={childItem.entity_id}
						className={`spbitem-tab-nav-item ${
							childIndx === 0 ? 'active' : 'inactive'
						}`}
						style={tabStyle}
						onClick={(e) => handleSwitchTab(childIndx)}
					>
						{content}
					</div>
				);
			})}
		</div>
	);
};
