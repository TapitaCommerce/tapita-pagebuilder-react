import React, { useEffect, useState, useMemo, useRef } from 'react';
import { ReactComponent as ChevronUpIcon } from '../images/icons/chevron-up.svg';
import { ReactComponent as ChevronDownIcon } from '../images/icons/chevron-down.svg';
import { ReactComponent as AddIcon } from '../images/icons/add-outline.svg';
import { ReactComponent as RemoveIcon } from '../images/icons/remove-outline.svg';
import { ReactComponent as CaretupIcon } from '../images/icons/caret-up-outline.svg';
import { ReactComponent as CaretdownIcon } from '../images/icons/caret-down-outline.svg';

export const Dropdown = (props) => {
	const { item, formatMessage } = props;
	const { stylesParsed } = item;
	const titleRef = useRef(null);
	const [showing, setShowing] = useState(
		item.dataParsed && item.dataParsed.dropdownDefaultExpanded,
	);
	const titleStyle = {};
	if (stylesParsed.padding) titleStyle.padding = stylesParsed.padding;
	if (stylesParsed.paddingTop) titleStyle.paddingTop = stylesParsed.paddingTop;
	if (stylesParsed.paddingBottom)
		titleStyle.paddingBottom = stylesParsed.paddingBottom;
	if (stylesParsed.paddingLeft)
		titleStyle.paddingLeft = stylesParsed.paddingLeft;
	if (stylesParsed.paddingRight)
		titleStyle.paddingRight = stylesParsed.paddingRight;
	const toggleShow = (e) => {
		if (item.children && item.children[0]) {
			setShowing(!showing);
		}
	};
	const dropdownIcon =
		item.dataParsed && item.dataParsed.dropdownIcon
			? item.dataParsed.dropdownIcon
			: 'arrow';
	const [upIc, downIc] = useMemo(() => {
		switch (dropdownIcon) {
			case 'arrow':
				return [<ChevronDownIcon key='down' />, <ChevronUpIcon key='up' />];
			case 'plusminus':
				return [<AddIcon key='down' />, <RemoveIcon key='up' />];
			case 'triangle':
				return [<CaretdownIcon key='down' />, <CaretupIcon key='up' />];
			case 'none':
				return [null, null];
			case 'custom':
				if (item.dataParsed)
					return [
						item.dataParsed.dropdownExpandIcon,
						item.dataParsed.dropdownCollapseIcon,
					];
				return [<ChevronDownIcon key='down' />, <ChevronUpIcon key='up' />];
			default:
				return [<ChevronDownIcon key='down' />, <ChevronUpIcon key='up' />];
		}
	}, [dropdownIcon]);

	useEffect(() => {
		const childrens = Array.from(titleRef.current.parentElement.children);
		if (showing) {
			const childrentItm = item.children[0];
			const newDisplayVal =
				childrentItm.stylesParsed && childrentItm.stylesParsed.display
					? childrentItm.stylesParsed.display
					: 'flex';
			childrens.map((children, childIndx) => {
				if (childIndx > 0) children.style.display = newDisplayVal;
			});
		} else {
			childrens.map((children, childIndx) => {
				if (childIndx > 0) children.style.display = 'none';
			});
		}
	}, [showing]);
	let title = item.name ? item.name : 'Your Dropdown Title';
	title = formatMessage({
		val: title,
	});
	return (
		<div
			className='smpb-dropdown-title'
			onClick={toggleShow}
			style={titleStyle}
			ref={titleRef}
		>
			<div className='smpb-dropdown-title-text'>{title}</div>
			<div className='smpb-dropdown-title-icon'>
				{dropdownIcon !== 'none' ? (
					dropdownIcon !== 'custom' ? (
						showing ? (
							downIc
						) : (
							upIc
						)
					) : (
						<img src={showing ? downIc : upIc} alt='dropdown-icon' />
					)
				) : (
					''
				)}
			</div>
		</div>
	);
};
