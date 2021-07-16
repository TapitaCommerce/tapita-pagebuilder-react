import React from 'react';
import HtmlParser from 'react-html-parser';
import { HtmlVideo } from './HTMLVideo/HTMLVideo';
import { YoutubeVideo } from './YoutubeVideo/YoutubeVideo';
import { LikeShareGeneric } from './LikeAndShare/LikeShare/LikeShareGeneric';
import { icons } from './icons/icons.js';

const Innercontent = (props) => {
	const { item, parent, ProductList, ProductGrid, Category, formatMessage } =
		props;
	if (!item || !item.entity_id) return '';
	let data = {};
	if (item.data && typeof item.data === 'object') {
		data = item.data;
	} else if (item.dataParsed) {
		data = item.dataParsed;
	}

	const HTMLTransform = (node) => {
		// comment out the line below to translate paragraph
		return node.data;
		if (node.type === 'text') {
			return formatMessage({ val: node.data });
		}
	};

	if (item.type === 'text') {
		const textValue = item.name ? item.name : 'Your Text Go Here';
		const translatedText = formatMessage({ val: textValue });
		if (item.dataParsed && item.dataParsed.textTag) {
			const TextTag = item.dataParsed.textTag;
			const textStyle = {};
			const {
				stylesParsed: {
					fontSize,
					fontStyle,
					textDecoration,
					fontWeight,
					fontFamily,
					lineHeight,
				},
			} = item;
			if (fontSize) textStyle.fontSize = fontSize;
			if (fontStyle) textStyle.fontStyle = fontStyle;
			if (textDecoration) textStyle.textDecoration = textDecoration;
			if (fontWeight) textStyle.fontWeight = fontWeight;
			if (fontFamily) textStyle.fontFamily = fontFamily;
			if (lineHeight) textStyle.lineHeight = lineHeight;
			return <TextTag style={textStyle}>{translatedText}</TextTag>;
		}
		return translatedText;
	} else if (item.type === 'image') {
		if (data.image) {
			const alt = formatMessage({
				val: (data.alt !== undefined ? data.alt : 'Image') || '',
			});
			const title = formatMessage({
				val: (data.title !== undefined ? data.title : '') || '',
			});
			return (
				<img
					src={data.image}
					alt={alt}
					title={title}
					style={{
						width: data.width || '100%',
						height: data.height || '100%',
						objectFit:
							item.stylesParsed && item.stylesParsed.objectFit
								? item.stylesParsed.objectFit
								: 'cover',
					}}
				/>
			);
		}
	} else if (item.type === 'category') {
		if (Category) return <Category item={item} formatMessage={formatMessage} />;
		else return '';
	} else if (item.type === 'product_scroll') {
		if (ProductList)
			return <ProductList item={item} formatMessage={formatMessage} />;
		else return '';
	} else if (item.type === 'product_grid') {
		if (ProductGrid)
			return <ProductGrid item={item} formatMessage={formatMessage} />;
		else return '';
	} else if (item.type === 'paragraph') {
		if (data.paragraphContent)
			return HtmlParser(data.paragraphContent, {
				transform: HTMLTransform,
			});
	} else if (['html_video', 'youtube_video'].includes(item.type)) {
		const imgCover = (data ? data.imageCover : null) || null;
		const size = (data ? data.size : null) || null;
		const width = (data ? data.width : null) || null;
		const videoURL = (data ? data.videoURL : null) || '';
		const showControl =
			data && data.showControl !== undefined ? data.showControl : true;

		if (item.type === 'html_video') {
			return (
				<HtmlVideo
					width={width}
					size={size}
					showControl={showControl}
					imgCover={imgCover}
					videoURL={videoURL}
					formatMessage={formatMessage}
				/>
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
				/>
			);
		}
	} else if (item.type === 'share_button') {
		return <LikeShareGeneric item={item} formatMessage={formatMessage} />;
	} else if (item.type === 'custom_html') {
		if (data.htmlContent)
			return HtmlParser(data.htmlContent, {
				transform: HTMLTransform,
			});
	} else if (item.type === 'icon') {
		if (data.icon && icons[data.icon]) return icons[data.icon];
	}
	return '';
};

export default Innercontent;
