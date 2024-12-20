import React, { useMemo, useState, useEffect } from 'react';
import { SurroundLink } from './SurroundLink';
import { Container } from './Container';
import LazyLoad from 'react-lazyload';
import { TreeDataProductDetailUtils } from '../Helper/treeDataUtils';
import { randomString } from '../Helper/Data';
import { isAbsolutePath } from '../Helper/isAbsolutePath.js';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import Innercontent from './Innercontent';
import Button from './Button';
import { isMobileIos, sleep } from '../Helper/isMobileIos';

export const buttonTypeFieldName = 'button-type';

export const formSubmitMethod = 'form-submit-method';
export const formSubmitTarget = 'form-submit-url';
export const formSubmitOnSubmit = 'form-submit-onSubmit';

const HOVER_PREFIX = 'hover_';

const LayoutItem = (props) => {
	const {
		item,
		children,
		parent,
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
		canLazyLoad,
		index,
		liquidLookup,
	} = props;

	const [hovered, setHovered] = useState(false);

	const prepareData = (item) => {
		let data = {};
		if (item.data && typeof item.data === 'object') {
			data = { ...item.data };
		} else if (item.dataParsed) {
			data = { ...item.dataParsed };
		}
		Object.keys(data).forEach((key) => {
			if (key.includes(deviceFilterKey)) {
				const styleKey = key.replace(deviceFilterKey, '');
				data[styleKey] = data[key];
			}
		});
		return data;
	};

	const renderInnerContent = (item, children, parent, styles) => {
		const dataParsed = item.dataParsed ? item.dataParsed : {};
		if (item.type === 'slider') {
			const showIndicators =
				parseInt(dataParsed.showSliderIndicator) === 0
					? false
					: !!(children.length && children.length !== 1);

			const rewindMode = !!parseInt(dataParsed.rewind);

			let slideSettings = {
				type:
					parseInt(dataParsed.sliderInfiniteLoop) !== 0 && !rewindMode
						? 'loop'
						: 'slide',
				autoplay: parseInt(dataParsed.sliderAutoSlide) === 1,
				arrows: parseInt(dataParsed.showSliderNavBtn) !== 0,
				lazyLoad: lazyloadPlaceHolder ? (
					'nearby'
				) : canLazyLoad ? (
					<div />
				) : (
					false
				),
				pagination: showIndicators,
				paginationDirection: 'ltr',
				speed: parseInt(dataParsed.sliderTransitionTime)
					? dataParsed.sliderTransitionTime
					: 350,
				interval: parseInt(dataParsed.sliderInterval)
					? dataParsed.sliderInterval
					: 3000,
				pauseOnHover: dataParsed.sliderPauseOnHover
					? dataParsed.sliderPauseOnHover
					: false,
				reducedMotion: false,
				arrowPath: dataParsed.arrowPath || false,
			};

			if (isRtl) {
				slideSettings.direction = 'rtl';
				slideSettings.paginationDirection = 'rtl';
			}
			let cChild = children.filter((itm) => itm !== '');
			cChild = isRtl ? cChild.reverse() : cChild;

			if (slideSettings.type === 'loop' || rewindMode) {
				slideSettings.clones = 0;
			} else {
				slideSettings.clones = cChild.length;
			}
			if (rewindMode) {
				slideSettings.rewind = true;
				slideSettings.rewindByDrag = true;
			}
			try {
				if (dataParsed && dataParsed.customSplideConf) {
					const customSplideConf = JSON.parse(dataParsed.customSplideConf);
					if (customSplideConf) {
						slideSettings = { ...slideSettings, ...customSplideConf };
					}
				}
			} catch (err) {
				console.warn(err);
			}
			return (
				<Splide options={slideSettings}>
					{cChild.map((cChil, indx) => (
						<SplideSlide data-index={indx} key={indx}>
							{cChil}
						</SplideSlide>
					))}
				</Splide>
			);
		}
		if (item.type === 'partial_slider') {
			const showArrow = parseInt(dataParsed.showSliderNavBtn) !== 0;
			const showIndicators =
				parseInt(dataParsed.showSliderIndicator) === 0
					? false
					: !!(children.length && children.length !== 1);
			let perPage = 3;
			let perMove = 1;
			if (dataParsed) {
				if (dataParsed[deviceFilterKey + 'partialPerPage']) {
					perPage = parseInt(dataParsed[deviceFilterKey + 'partialPerPage']);
				} else if (dataParsed.partialPerPage) {
					perPage = parseInt(dataParsed.partialPerPage);
				}
				if (dataParsed[deviceFilterKey + 'partialPerMove']) {
					perMove = parseInt(dataParsed[deviceFilterKey + 'partialPerMove']);
				} else if (dataParsed.partialPerMove) {
					perMove = parseInt(dataParsed.partialPerMove);
				}
			}

			let cChild = children.filter((itm) => itm !== '');
			cChild = isRtl ? cChild.reverse() : cChild;
			const imageNumber = cChild.length;
			if (imageNumber < perPage + perMove) {
				perMove = imageNumber - perPage;
			}

			const rewindMode = !!parseInt(dataParsed.rewind);

			let partialSSettings = {
				type:
					parseInt(dataParsed.sliderInfiniteLoop) !== 0 && !rewindMode
						? 'loop'
						: 'slide',
				autoplay: parseInt(dataParsed.sliderAutoSlide) === 1,
				speed: parseInt(dataParsed.sliderTransitionTime)
					? dataParsed.sliderTransitionTime
					: 350,
				interval: parseInt(dataParsed.sliderInterval)
					? dataParsed.sliderInterval
					: 3000,
				pagination: showIndicators,
				arrows: showArrow,
				perPage,
				perMove,
				reducedMotion: false,
				arrowPath: dataParsed.arrowPath || false,
			};
			if (isRtl) {
				partialSSettings.direction = 'rtl';
				partialSSettings.paginationDirection = 'rtl';
			}
			if (partialSSettings.type === 'loop' || rewindMode) {
				partialSSettings.clones = 0;
			} else {
				partialSSettings.clones = cChild.length;
			}
			if (rewindMode) {
				partialSSettings.rewind = true;
				partialSSettings.rewindByDrag = true;
			}

			try {
				if (dataParsed && dataParsed.customSplideConf) {
					const customSplideConf = JSON.parse(dataParsed.customSplideConf);
					if (customSplideConf) {
						partialSSettings = { ...partialSSettings, ...customSplideConf };
					}
				}
			} catch (err) {
				console.warn(err);
			}
			return (
				<HOSplide partialSSettings={partialSSettings}>
					{cChild.map((cChil, indx) => (
						<SplideSlide key={indx}>{cChil}</SplideSlide>
					))}
				</HOSplide>
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
					parentStyles={styles}
					formatMessage={formatMessage}
					ProductList={ProductList}
					ProductGrid={ProductGrid}
					Category={Category}
					ProductScroll={ProductScroll}
					CategoryScroll={CategoryScroll}
					deviceFilterKey={deviceFilterKey}
					translateParagraph={translateParagraph}
					translatePlaceholder={translatePlaceholder}
					canLazyLoad={canLazyLoad}
					parent={parent}
					index={index}
					liquidLookup={liquidLookup}
				/>
				{children.length ? children : ''}
			</React.Fragment>
		);
	};

	if (layoutFilter !== null) {
		if (filterRootChildrenOnly) {
			if (
				TreeDataProductDetailUtils.isRootChildren(item) &&
				!item.root &&
				TreeDataProductDetailUtils.getCurrentMarker(item) !== layoutFilter
			) {
				return null;
			}
		} else if (
			!item.root &&
			TreeDataProductDetailUtils.getCurrentMarker(item) !== layoutFilter
		) {
			return null;
		}
	}
	if (item.dataParsed) {
		if (deviceFilterKey === 'm_' && item.dataParsed.hideOnMobile) return '';
		else if (deviceFilterKey === 't_' && item.dataParsed.hideOnTablet)
			return '';
		else if (deviceFilterKey === 'l_' && item.dataParsed.hideOnDesktop)
			return '';
		if (
			item.dataParsed.showOnLocale &&
			item.dataParsed.showOnLocale !== 'false' &&
			item.dataParsed.showOnLocale.split
		) {
			const currentLange = document.documentElement.lang;
			const localeToShow = item.dataParsed.showOnLocale.split(',');
			if (
				localeToShow &&
				localeToShow.includes &&
				!localeToShow.includes(currentLange)
			) {
				return '';
			}
		}
	}
	const itemType = item.type;
	const styles = useMemo(() => {
		const defaultStyles = {
			display: 'flex',
			flexDirection: 'column',
			flexWrap: 'wrap',
			direction: isRtl ? 'rtl' : 'ltr',
		};
		let style = defaultStyles;
		if (item && item.stylesParsed) {
			try {
				const _itemStyle = JSON.parse(
					JSON.stringify(item.stylesParsed) || '{}',
				);
				const itemStyle = { ..._itemStyle };

				// add device styles
				Object.keys(itemStyle).forEach((key) => {
					let styleKey = key;
					if (key.includes(deviceFilterKey)) {
						styleKey = key.replace(deviceFilterKey, '');
						itemStyle[styleKey] = itemStyle[key];
					}

					if (hovered) {
						if (itemStyle[HOVER_PREFIX + styleKey]) {
							itemStyle[styleKey] = itemStyle[HOVER_PREFIX + styleKey];
						} else if (styleKey.indexOf(HOVER_PREFIX) !== -1) {
							itemStyle[styleKey.replace(HOVER_PREFIX, '')] = itemStyle[key];
						}
					}
				});

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
		}
		if (parent && parent.type === 'slider') {
			const parentSliderHeight =
				parent.stylesParsed &&
				(parent.stylesParsed[deviceFilterKey + 'heightPixel'] ||
					parent.stylesParsed.heightPixel ||
					parent.stylesParsed[deviceFilterKey + 'height'] ||
					parent.stylesParsed.height);
			if (parentSliderHeight) {
				if (
					parentSliderHeight.includes &&
					(parentSliderHeight.includes('vw') ||
						parentSliderHeight.includes('vh'))
				)
					style.height = parentSliderHeight;
				else style.height = parseInt(parentSliderHeight) + 'px';
				// style.overflowY = 'hidden';
			}
		} else if (parent && parent.type === 'partial_slider') {
			style.width = 'unset';
		}
		if (
			item &&
			item.type !== 'image' &&
			item.type !== 'category' &&
			item.type !== 'custom_html'
		) {
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
	}, [item, hovered, deviceFilterKey]);

	const devicelessData = prepareData(item);
	if (styles && !styles.borderStyle) {
		const hasBorderProperty = Object.keys(styles).some((key) => {
			return key.includes('borderWidth');
		});
		if (hasBorderProperty) {
			styles.borderStyle = 'solid';
		}
	}
	if (styles && !styles.borderStyle) {
		const hasBorderProperty = Object.keys(styles).some((key) => {
			return key.includes('borderWidth');
		});
		if (hasBorderProperty) {
			styles.borderStyle = 'solid';
		}
	}
	item.dataParsed = devicelessData;
	let aHref;
	if (
		item.dataParsed &&
		(item.dataParsed.openUrl ||
			item.dataParsed.sendEmail ||
			item.dataParsed.callNumber)
	) {
		aHref = item.dataParsed.openUrl;
		if (item.dataParsed.sendEmail)
			aHref = 'mailto: ' + item.dataParsed.sendEmail;
		else if (item.dataParsed.callNumber)
			aHref = 'tel:' + item.dataParsed.callNumber;
		else if (mode === 'shopify' && window.Shopify && !isAbsolutePath(aHref)) {
			const locale = window.Shopify.locale;
			const root =
				(window.Shopify.routes ? window.Shopify.routes.root : '/') || '/';
			if (root !== '/') {
				aHref =
					root +
					(item.dataParsed.openUrl.charAt(0) === '/'
						? item.dataParsed.openUrl.slice(1)
						: item.dataParsed.openUrl);
			}
		}
	}

	if (itemType === 'dropdown') {
		/**
		 * Dropdown padding is for dropdown title
		 * default padding for dropdown container is zero
		 */
		styles.padding = 0;
		styles.paddingTop = 0;
		styles.paddingBottom = 0;
		styles.paddingLeft = 0;
		styles.paddingRight = 0;
	} else if (itemType === 'text_input' || itemType === 'textarea_input') {
		styles.padding = 0;
		styles.overflow = 'hidden';
	}

	if (item.type === 'partial_slider') {
		styles.flexDirection = 'row';
		styles.flexWrap = 'nowrap';
	}

	if (item && ['html_video', 'youtube_video'].includes(item.type)) {
		const _size = (item.dataParsed ? item.dataParsed.size : null) || null;
		const _width = (item.dataParsed ? item.dataParsed.width : null) || null;
		const height = 'auto';
		const width = _size || _width || '100%';
		styles.width = width;
		styles.height = height;
		// styles.display = 'block';
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

	if (item.type === 'category_scroll_1') {
		styles.backgroundImage = 'none';
	}

	const itemID =
		(item && item.dataParsed && item.dataParsed.custom_id) ||
		(item && item.entity_id ? `pbitm-id-${item.entity_id}` : null);

	// create inner styles from item styles
	const innerStyles = JSON.parse(JSON.stringify(styles));
	const innerContent = renderInnerContent(item, children, parent, innerStyles);

	// alter current styles as our wish
	if (
		['text', 'paragraph', 'html_video', 'youtube_video', 'icon'].includes(
			item.type,
		)
	) {
		styles.boxShadow = 'none';
	}

	const noShadow = !styles.boxShadow || styles.boxShadow === 'none';
	if (!noShadow) {
		styles.overflow = 'visible';
	}

	let itemClassName = `spb-item ${item.root ? 'spb-item-root' : ''} ${
		item.class_name || ''
	} ${'type_' + (item.type || '')} ${
		item.entity_id ? 'spb-item-id_' + item.entity_id : ''
	} ${!noShadow ? 'spb-shadowed' : ''}`;

	const existingItem = document.getElementById(itemID);
	// preserve existing element classname - for now for aos
	if (
		existingItem &&
		existingItem.classList &&
		existingItem.classList.contains
	) {
		if (existingItem.classList.contains('reveal')) itemClassName += ' reveal ';
		if (existingItem.classList.contains('active')) itemClassName += ' active ';
	}
	const itemProps = {
		id: itemID,
		key: `${randomString(5)}${item.root ? 'root' : item.entity_id}`,
		style: styles,
		className: itemClassName,
	};
	if (!isMobileIos()) {
		if (['text', 'button', 'form_button'].includes(item.type)) {
			itemProps.onMouseEnter = (e) => {
				if (!hovered) setHovered(true);
			};
			itemProps.onMouseLeave = (e) => {
				if (hovered) setHovered(false);
			};
		}
	}

	if (item.dataParsed && item.dataParsed.customProps) {
		try {
			const customProps = JSON.parse(item.dataParsed.customProps);
			if (customProps) {
				Object.keys(customProps).map((name) => {
					itemProps[name] = customProps[name];
				});
			}
		} catch (err) {}
	}
	if (item.dataParsed && item.dataParsed.scrollTo) {
		styles.cursor = 'pointer';
		itemProps.onClick = () => {
			const elmnt = document.getElementsByClassName(item.dataParsed.scrollTo);
			if (elmnt && elmnt.length) elmnt[0].scrollIntoView();
		};
		// DONOT REMOVE - this is to fix ios problem when it requires touching twice
		if (isMobileIos()) {
			itemProps.onMouseEnter = async () => {
				await sleep(150);
			};
		}
	}
	if (aHref && item.type !== 'text') {
		const openUrlInNewTab = parseInt(item.dataParsed.openUrlInNewTab) === 1;
		itemProps.onClick = () => {
			if (
				history &&
				!openUrlInNewTab &&
				item.dataParsed.openUrl.indexOf('http') === -1
			)
				history.push(aHref);
			else {
				if (typeof window !== 'undefined') {
					window.open(aHref, openUrlInNewTab ? '_blank' : '_self');
				}
			}
		};
	}

	if (overRender) {
		const overRendered = overRender(item, itemProps, innerContent);
		if (overRendered) return overRendered;
	}
	if (item.type === 'form_group') {
		const formMethod = item.dataParsed[formSubmitMethod] || 'GET';
		const formURL = item.dataParsed[formSubmitTarget] || '';
		return (
			<form
				key={itemProps.key}
				className='form-builder-artifact'
				action={formURL}
				onSubmit={(e) => {
					try {
						eval(item.dataParsed[formSubmitOnSubmit]);
					} catch (err) {}
					if (item.dataParsed.preventFormSubmit) e.preventDefault();
				}}
				method={formMethod}
			>
				<div {...itemProps}>{innerContent}</div>
			</form>
		);
	}
	if (aHref) {
		if (
			item.type === 'text' ||
			item.type === 'container' ||
			item.type === 'form_button' ||
			item.type === 'image'
		) {
			return (
				<SurroundLink
					key={item.entity_id + hovered}
					item={item}
					itemProps={itemProps}
					aHref={aHref}
					Link={Link}
				>
					{innerContent}
				</SurroundLink>
			);
		}
	}
	if (item.type === 'button' || item.type === 'form_button') {
		const buttonType = item.dataParsed
			? item.dataParsed[buttonTypeFieldName]
			: 'button';
		return (
			<button key={item.entity_id + hovered} type={buttonType} {...itemProps}>
				{innerContent}
			</button>
		);
	} else if (
		item.type === 'image' &&
		lazyloadPlaceHolder &&
		item.dataParsed &&
		!item.dataParsed.openUrl &&
		!item.dataParsed.scrollTo &&
		(!parent || parent.type !== 'slider') // slider already lazy load
	) {
		return (
			<LazyLoad
				key={item.entity_id}
				{...itemProps}
				placeholder={lazyloadPlaceHolder}
				offset={532}
			>
				{innerContent}
			</LazyLoad>
		);
	} else if (item.type === 'hidden_input') {
		if (!item.dataParsed) return '';
		return (
			<input
				key={item.entity_id}
				type='hidden'
				name={item.dataParsed.name}
				id={item.dataParsed.input_id}
				value={item.dataParsed.default_value}
			/>
		);
	}
	return (
		<Container key={item.entity_id + hovered} itemProps={itemProps}>
			{innerContent}
		</Container>
	);
};
export default LayoutItem;

const HOSplide = ({ partialSSettings, children }) => {
	const [clones, setClones] = useState(partialSSettings.clones || 0);
	const slideOptions = JSON.parse(JSON.stringify(partialSSettings));
	slideOptions.clones = clones;
	// this is the trick to fix Splide error when clones is zero : https://snipboard.io/mr4Wwp.jpg
	useEffect(() => {
		if (clones === 0 && children.length) setClones(children.length);
	}, []);
	return <Splide options={slideOptions}>{children}</Splide>;
};
