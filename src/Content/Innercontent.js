import React, { Fragment, useEffect, useRef } from 'react';
import { HtmlVideo } from './HTMLVideo/HTMLVideo';
import { YoutubeVideo } from './YoutubeVideo/YoutubeVideo';
import { Tab } from './Tab';
import { LikeShareGeneric } from './LikeAndShare/LikeShare/LikeShareGeneric';
import { Instagram } from './Instagram';
import { icons } from './icons/icons.js';
import { randomString } from '../Helper/Data';
import { Dropdown } from './Dropdown';
import { FacebookPagePlugin } from './FacebookPagePlugin';
import { convertBoxShadowToTextShadow } from '../Helper/convertBoxShadowToTextShadow';
import { tryParseJSON } from '../Helper/tryParseJSON';
import { migratedBindingTypes } from './MigratedForm/bindingMatrix';
import { OverloadedBindingMigrationRenderer } from './MigratedForm/OverloadedBindingMigrationRenderer';

export const customIconDefKey = 'is-custom-icon';
export const customIcon = 'custom-icon';

const Innercontent = (props) => {
	const {
		item,
		ProductList,
		ProductGrid,
		Category,
		formatMessage,
		ProductScroll,
		CategoryScroll,
		deviceFilterKey,
		translateParagraph,
		translatePlaceholder,
		parentStyles,
		canLazyLoad,
		parent,
		liquidLookup,
	} = props;

	useEffect(() => {
		if (!window.tapitaBackupHtmlElements) {
			window.tapitaBackupHtmlElements = {};
		}

		if (
			item &&
			item.entity_id &&
			item.type &&
			(item.type === 'custom_html' || item.type === 'actual_statement')
		) {
			if (
				item &&
				item.entity_id &&
				window.tapitaBackupHtmlElements &&
				window.tapitaBackupHtmlElements[item.entity_id]
			) {
				const ourElRep = document.getElementById('pbitm-id-' + item.entity_id);
				if (
					ourElRep &&
					(!ourElRep.innerHTML || ourElRep.innerHTML.length < 10)
				) {
					// 0 maybe?
					window.tapitaBackupHtmlElements[item.entity_id].forEach((savedEl) => {
						ourElRep.appendChild(savedEl);
					});
				}
			}
		}
	}, []);

	if (
		item &&
		item.entity_id &&
		window.tapitaBackupHtmlElements &&
		window.tapitaBackupHtmlElements[item.entity_id]
	) {
		return '';
	}
	if (!item || !item.entity_id) return '';

	const backupHtml = () => {
		// this is the first time rendering, back it up if unmount

		if (
			item &&
			item.entity_id &&
			item.type &&
			(item.type === 'custom_html' || item.type === 'actual_statement')
		) {
			const ourElNow = document.getElementById('pbitm-id-' + item.entity_id);
			if (ourElNow) {
				NodeList.prototype.forEach = Array.prototype.forEach;
				let children = ourElNow.children;
				children = Array.from(children);
				const backupChildNodes = [];
				children.forEach(function (item) {
					backupChildNodes.push(item);
				});
				if (backupChildNodes.length)
					window.tapitaBackupHtmlElements[item.entity_id] = backupChildNodes;
			}
		}
	};
	[100, 1000, 3000, 5000].forEach((calval) => {
		// call it sometimes to make sure with some provider that take time
		setTimeout(backupHtml, calval);
	});
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
	const styles = tryParseJSON(parentStyles) || {};
	// fill border style
	if (parentStyles && !parentStyles.borderStyle) {
		const hasBorderProperty = Object.keys(parentStyles).some((key) => {
			return key.includes('borderWidth');
		});
		if (hasBorderProperty) {
			parentStyles.borderStyle = 'solid';
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
	const dataParsed = item.dataParsed || {};
	const nameSpace = useRef(dataParsed.name || randomString(5)).current;

	if (item.type === 'text') {
		const textValue = item.name ? item.name : 'Your Text Go Here';
		const translatedText = formatMessage({ val: textValue });
		if (item.dataParsed && item.dataParsed.textTag) {
			const TextTag = item.dataParsed.textTag;
			const textStyle = {};
			const {
				fontSize,
				fontStyle,
				textDecoration,
				fontWeight,
				fontFamily,
				lineHeight,
				letterSpacing,
				boxShadow,
				color,
			} = parentStyles;

			if (fontSize) textStyle.fontSize = fontSize;
			if (fontStyle) textStyle.fontStyle = fontStyle;
			if (textDecoration) textStyle.textDecoration = textDecoration;
			if (fontWeight) textStyle.fontWeight = fontWeight;
			if (fontFamily) textStyle.fontFamily = fontFamily;
			if (letterSpacing) textStyle.letterSpacing = letterSpacing;
			if (lineHeight) textStyle.lineHeight = lineHeight;
			if (color) textStyle.color = color;
			if (boxShadow)
				textStyle.textShadow = convertBoxShadowToTextShadow(boxShadow);
			return <TextTag style={textStyle}>{translatedText}</TextTag>;
		}
		return translatedText;
	} else if (item.type === 'tabs') {
		return (
			<Tab
				item={item}
				formatMessage={formatMessage}
				deviceFilterKey={deviceFilterKey}
			/>
		);
	} else if (item.type === 'dropdown') {
		return <Dropdown item={item} formatMessage={formatMessage} />;
	} else if (item.type === 'image') {
		if (data.image) {
			const alt = formatMessage({
				val: (data.alt !== undefined ? data.alt : 'Image') || '',
			});
			const title = formatMessage({
				val: (data.title !== undefined ? data.title : '') || '',
			});
			const loadStrategy =
				data && data.loadStrategy
					? data.loadStrategy
					: canLazyLoad
						? 'lazy'
						: '';
			const offhandImgOptimizationConfig = (data && data.optimization) || {};

			return (
				<img
					src={data.image}
					data-splide-lazy={data.image}
					alt={alt}
					title={title}
					loading={loadStrategy}
					style={{
						width: data.width || '100%',
						height: data.height || '100%',
						objectFit:
							parentStyles && parentStyles.objectFit
								? parentStyles.objectFit
								: 'cover',
						objectPosition:
							parentStyles && parentStyles.objectPosition
								? parentStyles.objectPosition
								: 'unset',
					}}
					{...offhandImgOptimizationConfig}
				/>
			);
		}
	} else if (item.type === 'category') {
		if (Category)
			return (
				<Category
					item={item}
					formatMessage={formatMessage}
					data={data}
					styles={styles}
				/>
			);
		else return '';
	} else if (item.type === 'product_scroll') {
		if (ProductList)
			return (
				<ProductList
					item={item}
					formatMessage={formatMessage}
					data={data}
					styles={styles}
				/>
			);
		else return '';
	} else if (item.type === 'product_grid') {
		if (ProductGrid)
			return (
				<ProductGrid
					item={item}
					formatMessage={formatMessage}
					data={data}
					styles={styles}
				/>
			);
		else return '';
	} else if (item.type === 'product_scroll_1') {
		if (ProductScroll)
			return (
				<ProductScroll
					item={item}
					formatMessage={formatMessage}
					data={data}
					styles={styles}
				/>
			);
		else return '';
	} else if (item.type === 'category_scroll_1') {
		if (CategoryScroll)
			return (
				<CategoryScroll
					item={item}
					formatMessage={formatMessage}
					data={data}
					styles={styles}
				/>
			);
		else return '';
	} else if (item.type === 'paragraph') {
		const wrapperStyle =
			parentStyles && parentStyles.boxShadow
				? {
					textShadow: convertBoxShadowToTextShadow(parentStyles.boxShadow),
				  }
				: null;

		if (data.paragraphContent) {
			const content = translateParagraph
				? formatMessage({ val: data.paragraphContent })
				: data.paragraphContent;
			return (
				<div
					dangerouslySetInnerHTML={{ __html: content }}
					style={wrapperStyle}
				/>
			);
		}
	} else if (['html_video', 'youtube_video'].includes(item.type)) {
		const imgCover = (data ? data.imageCover : null) || null;
		const size = (data ? data.size : null) || null;
		const width = (data ? data.width : null) || null;
		const videoURL = (data ? data.videoURL : null) || '';
		const showControl =
			data && data.showControl !== undefined ? data.showControl : true;
		const enableAutoplay =
			data && data.autoplay !== undefined ? data.autoplay : false;
		const enableLoop = data && data.loop !== undefined ? data.loop : false;
		const enableLazy = data && data.lazy !== undefined ? data.lazy : false;
		const shadowStyle =
			parentStyles && parentStyles.boxShadow
				? {
					boxShadow: parentStyles.boxShadow,
				  }
				: null;

		if (item.type === 'html_video') {
			return (
				<Fragment>
					<HtmlVideo
						width={width}
						size={size}
						showControl={showControl}
						imgCover={imgCover}
						videoURL={videoURL}
						formatMessage={formatMessage}
						style={shadowStyle}
						autoplay={enableAutoplay}
						loop={enableLoop}
					/>
				</Fragment>
			);
		} else if (item.type === 'youtube_video') {
			return (
				<YoutubeVideo
					width={width}
					size={size}
					showControl={showControl}
					imgCover={imgCover}
					videoURL={videoURL}
					formatMessage={formatMessage}
					style={shadowStyle}
					autoplay={enableAutoplay}
					loop={enableLoop}
					lazy={enableLazy}
				/>
			);
		}
	} else if (item.type === 'share_button') {
		return <LikeShareGeneric item={item} formatMessage={formatMessage} />;
	} else if (item.type === 'facebook_page_plugin') {
		return <FacebookPagePlugin item={item} formatMessage={formatMessage} />;
	} else if (item.type === 'instagram') {
		return <Instagram item={item} formatMessage={formatMessage} />;
	} else if (item.type === 'custom_html') {
		if (data.htmlContent) {
			const shadowStyle =
				parentStyles && parentStyles.boxShadow
					? {
						boxShadow: parentStyles.boxShadow,
					  }
					: null;
			return (
				<div
					dangerouslySetInnerHTML={{ __html: data.htmlContent }}
					style={shadowStyle}
				/>
			);
		}
	} else if (item.type === 'icon') {
		const shouldUseCustomIcon = data[customIconDefKey];
		const customIconValue = data[customIcon] || '';
		const shadowStyle =
			parentStyles && parentStyles.boxShadow
				? {
					boxShadow: parentStyles.boxShadow,
				  }
				: null;
		if (shouldUseCustomIcon) {
			return <i className={customIconValue} style={shadowStyle} />;
		}
		if (data.icon && icons[data.icon]) return icons[data.icon];
	} else if (item.type === 'text_input' || item.type === 'textarea_input') {
		const placeholder = data
			? formatMessage && translatePlaceholder
				? formatMessage({ val: data.placeholder })
				: data.placeholder
			: '';
		const applicableStyleAttr = [
			'padding',
			'paddingTop',
			'paddingBottom',
			'paddingLeft',
			'paddingRight',
			'fontWeight',
			'fontSize',
			'border',
			'borderRadius',
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
		// padding for input behave differently from others,
		// so the above style can not be used in outer container

		const miniStyle = Object.entries(styles)
			.filter(([k, v]) => {
				return applicableStyleAttr.includes(k);
			})
			.reduce((acc, [k, v]) => {
				acc[k] = v;
				return acc;
			}, {});

		if (miniStyle.widthPixel !== undefined) {
			miniStyle.width = miniStyle.widthPixel;
		}
		if (miniStyle.heightPixel !== undefined) {
			miniStyle.height = miniStyle.heightPixel;
		}
		miniStyle.border = 'none';

		return item.type === 'textarea_input' ? (
			<>
				<textarea
					placeholder={placeholder}
					style={{ ...miniStyle, height: '100%' }}
					name={nameSpace}
					id={data.input_id}
					defaultValue={data.default_value}
					required={data && data.isRequired ? data.isRequired : false}
					data-validation-matches-match={
						data && data.dataValidationMatchesMatch
							? data.dataValidationMatchesMatch
							: false
					}
					data-validation-matches-message={
						data && data.dataValidationMatchesMessage
							? data.dataValidationMatchesMessage
							: false
					}
					data-validation-required-message={
						data && data.dataValidationRequiredMessage
							? data.dataValidationRequiredMessage
							: false
					}
				/>
				<p className='help-block' />
			</>
		) : (
			<>
				<input
					type={data && data.inputType ? data.inputType : 'text'}
					placeholder={placeholder}
					id={data.input_id}
					style={{ ...miniStyle, height: '100%' }}
					name={nameSpace}
					defaultValue={data.default_value}
					required={data && data.isRequired ? data.isRequired : false}
					data-validation-matches-match={
						data && data.dataValidationMatchesMatch
							? data.dataValidationMatchesMatch
							: false
					}
					data-validation-matches-message={
						data && data.dataValidationMatchesMessage
							? data.dataValidationMatchesMessage
							: false
					}
					data-validation-required-message={
						data && data.dataValidationRequiredMessage
							? data.dataValidationRequiredMessage
							: false
					}
				/>
				<p className='help-block' />
			</>
		);
	} else if (migratedBindingTypes.includes(item.type)) {
		return (
			<OverloadedBindingMigrationRenderer
				item={item}
				type={item.type}
				liquidLookup={liquidLookup}
			/>
		);
	}
	return '';
};

export default Innercontent;
