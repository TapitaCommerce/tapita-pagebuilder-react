import React from 'react';
import Innercontent from './Innercontent';
import { Carousel } from 'react-responsive-carousel';
import Button from './Button';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { randomString, listToTree } from '../Helper/Data';
import { useDeviceWidthPrefix } from '../hooks/useDeviceWidthPrefix';
import { PartialSlider } from './PartialSlider/PartialSlider';

export const buttonTypeFieldName = 'button-type';

export const formSubmitMethod = 'form-submit-method';
export const formSubmitTarget = 'form-submit-url';

const PbContent = (props) => {
	const {
		data: { spb_item, spb_page },
		ProductList,
		ProductGrid,
		Category,
		formatMessage,
		ProductScroll,
		CategoryScroll,
	} = props;
	const deviceFilterKey = useDeviceWidthPrefix();
	const pageData =
		spb_page && spb_page.items && spb_page.items[0] ? spb_page.items[0] : false;
	const isRtl = pageData && pageData.is_rtl;

	const renderItem = (item, children, parent) => {
		if (item.dataParsed) {
			if (deviceFilterKey === 'm_' && item.dataParsed.hideOnMobile) return '';
			else if (deviceFilterKey === 't_' && item.dataParsed.hideOnTablet)
				return '';
			else if (deviceFilterKey === 'l_' && item.dataParsed.hideOnDesktop)
				return '';
		}
		const itemType = item.type;
		const shouldNotHavePadding = itemType === 'text_input';
		const _styles = prepareStyle(item, parent);
		const passingAttrKeys = [
			'padding',
			'paddingTop',
			'paddingBottom',
			'paddingLeft',
			'paddingRight',
			'fontWeight',
			'fontSize',
			'lineHeight',
			'color',
			'fontFamily',
			'width',
			'height',
			'widthPixel',
			'heightPixel',
			'maxWidth',
			'maxHeight',
			'minWidth',
			'minHeight',
		];
		const _stylesWithoutPadding = Object.entries(_styles)
			.filter(([k, v]) => {
				return !passingAttrKeys.includes(k);
			})
			.reduce((acc, [k, v]) => {
				acc[k] = v;
				return acc;
			}, {});

		_stylesWithoutPadding.padding = '0px'; // override default
		_stylesWithoutPadding.borderRadius = '0px'; // override default

		const finalStyle = shouldNotHavePadding ? _stylesWithoutPadding : _styles;

		const styles = finalStyle;

		if (styles.display && itemType === 'slider_1') {
			styles.display = 'block';
		}

		if (item.type === 'tabs') {
			styles.display = 'flex';
			styles.direction = 'ltr';
			if (item.dataParsed) {
				switch (item.dataParsed.tabTitleNavPos) {
					case 'left':
						styles.flexFlow = 'row';
						break;
					case 'right':
						styles.flexFlow = 'row-reverse';
						break;
					case 'bottom':
						styles.flexFlow = 'column-reverse';
						break;
					default:
						styles.flexFlow = 'column';
						break;
				}
			}
		}

		const itemProps = {
			key: `${randomString(5)}${item.root ? 'root' : item.entity_id}`,
			style: styles,
			className: `spb-item ${item.root ? 'spb-item-root' : ''} ${
				item.class_name
			} ${'type_' + item.type}`,
		};
		if (item.dataParsed && item.dataParsed.scrollTo) {
			itemProps.onClick = () => {
				const elmnt = document.getElementsByClassName(item.dataParsed.scrollTo);
				if (elmnt && elmnt.length) elmnt[0].scrollIntoView();
			};
		}
		if (item.dataParsed && item.dataParsed.openUrl) {
			itemProps.onClick = () => window.open(item.dataParsed.openUrl, '_blank');
		}
		if (item.type === 'form_group') {
			const formMethod = item.dataParsed[formSubmitMethod] || 'GET';
			const formURL = item.dataParsed[formSubmitTarget] || '';
			return (
				<form
					className='form-builder-artifact'
					action={formURL}
					method={formMethod}
				>
					<div {...itemProps}>{renderInnerContent(item, children, parent)}</div>
				</form>
			);
		}
		if (item.type === 'button' || item.type === 'form_button') {
			const buttonType = item.dataParsed
				? item.dataParsed[buttonTypeFieldName]
				: 'button';

			return (
				<button type={buttonType} {...itemProps}>
					<Button item={item} formatMessage={formatMessage}>
						{children.length ? children : ''}
					</Button>
				</button>
			);
		}

		return (
			<div {...itemProps}>
				{item.dataParsed?.openUrl && (
					<a href={item.dataParsed?.openUrl} rel='noreferrer' target='_blank'>
						<span
							style={{
								height: '100%',
								width: '100%',
								left: 0,
								top: 0,
								position: 'absolute',
								zIndex: 1,
							}}
						/>
					</a>
				)}
				{renderInnerContent(item, children, parent)}
			</div>
		);
	};

	const renderInnerContent = (item, children, parent) => {
		const dataParsed = item.dataParsed ? item.dataParsed : {};
		if (item.type === 'slider') {
			const slideSettings = {
				autoPlay: parseInt(dataParsed.sliderAutoSlide) === 1,
				showArrows: parseInt(dataParsed.showSliderNavBtn) !== 0,
				showThumbs: false,
				showIndicators:
					parseInt(dataParsed.showSliderIndicator) === 0
						? false
						: !!(children.length && children.length !== 1),
				showStatus: false,
				infiniteLoop: parseInt(dataParsed.sliderInfiniteLoop) !== 0,
				lazyLoad: true,
				transitionTime: !parseInt(dataParsed.sliderTransitionTime)
					? dataParsed.sliderTransitionTime
					: 350,
			};
			if (isRtl) {
				slideSettings.selectedItem = children.length - 1;
				slideSettings.autoPlay = false;
			}
			return (
				<Carousel {...slideSettings}>
					{isRtl ? children.reverse() : children}
				</Carousel>
			);
		}
		if (item.type === 'button' || item.type === 'form_button') {
			return (
				<Button item={item} formatMessage={formatMessage}>
					{children.length ? children : ''}
				</Button>
			);
		}

		return (
			<React.Fragment>
				<Innercontent
					item={item}
					parent={parent}
					formatMessage={formatMessage}
					ProductList={ProductList}
					ProductGrid={ProductGrid}
					Category={Category}
					ProductScroll={ProductScroll}
					CategoryScroll={CategoryScroll}
				/>
				{children.length && item.type !== 'slider_1' ? children : ''}
				{item.type === 'slider_1' && (
					<PartialSlider item={item} isRtl={isRtl}>
						{children}
					</PartialSlider>
				)}
			</React.Fragment>
		);
	};

	const prepareStyle = (item, parent) => {
		const defaultStyles = {
			display: 'flex',
			flexDirection: 'column',
			flexWrap: 'wrap',
			direction: isRtl ? 'rtl' : 'ltr',
		};
		let style = defaultStyles;
		if (item && item.stylesParsed) {
			try {
				const itemStyle = JSON.parse(JSON.stringify(item.stylesParsed));
				if (itemStyle.widthPercent) {
					itemStyle.width = parseInt(itemStyle.widthPercent, 10) + '%';
					delete itemStyle.widthPercent;
				}
				if (itemStyle.widthPixel) {
					itemStyle.width = parseInt(itemStyle.widthPixel, 10) + 'px';
					delete itemStyle.widthPixel;
				}
				if (itemStyle.heightPixel) {
					if (itemStyle.heightPixel === 'auto')
						itemStyle.height = itemStyle.heightPixel;
					else itemStyle.height = parseInt(itemStyle.heightPixel, 10) + 'px';
					delete itemStyle.heightPixel;
				}
				style = { ...style, ...itemStyle };
			} catch (err) {
				console.warn(err);
			}

			// add device styles
			Object.keys(style).forEach((key) => {
				if (key.includes(deviceFilterKey)) {
					const styleKey = key.replace(deviceFilterKey, '');
					style[styleKey] = style[key];
				}
			});
		}
		if (parent && parent.type === 'slider') {
			const parentSliderHeight =
				parent.stylesParsed &&
				(parent.stylesParsed.heightPixel ||
					parent.stylesParsed[deviceFilterKey + 'heightPixel']);
			if (parentSliderHeight) {
				style.height = parseInt(parentSliderHeight) + 'px';
				// style.overflowY = 'hidden';
			}
		}
		if (item && item.type !== 'image' && item.type !== 'category') {
			if (item.dataParsed) {
				const itemData = item.dataParsed;
				if (itemData && itemData.image) {
					style.backgroundImage = `url("${itemData.image}")`;
				}
			}
		}
		if (item && item.type === 'slider') {
			style.direction = 'ltr';
		}
		return style;
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
	return (
		<div
			className='smpb-container'
			style={{ direction: isRtl ? 'rtl' : 'ltr' }}
		>
			{renderItems(rootItem)}
		</div>
	);
};

export default PbContent;
