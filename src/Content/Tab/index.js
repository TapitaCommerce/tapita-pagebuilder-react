import React, { useEffect, useState } from 'react';
import { randomString } from '../../Helper/Data';
import { Helmet } from 'react-helmet';

export const Tab = (props) => {
	const { item } = props;
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
			<Helmet
				style={[
					{
						cssText: `
                            .spb-item.type_tabs .spbitem-tab-nav {
                                direction: ltr;
                                padding: 0px 15px;
                                display: flex;
                                justify-content: center;
                            }

                            .spb-item.type_tabs > .spb-item {
                                flex-shrink: initial;
                            }

                            .spb-item.type_tabs .spbitem-tab-nav .spbitem-tab-nav-item {
                                cursor: pointer;
                                margin-inline-end: 10px;
                                padding: 10px 15px;
                            }
                            .spb-item.type_tabs .spbitem-tab-nav .spbitem-tab-nav-item.active {
                                background-color: #ffffff;
                                font-weight: 600;
                            }

                            .spb-item.type_tabs .spbitem-tab-nav.vertical {
                                display: inline-block;
                                flex-shrink: inherit;
                                padding: 0;
                            }

                            .spb-item.type_tabs .spbitem-tab-nav.vertical .spbitem-tab-nav-item {
                                width: 100%;
                                margin-bottom: 5px;
                                box-sizing: border-box;
                            }

                            `,
					},
				]}
			/>
			{itemChildren.map((childItem, childIndx) => {
				return (
					<div
						key={childItem.entity_id}
						className={`spbitem-tab-nav-item ${
							selectedTab === childIndx ? 'active' : 'inactive'
						}`}
						onClick={(e) => setSelectedTab(childIndx)}
					>
						{childItem.name}
					</div>
				);
			})}
		</div>
	);
};
