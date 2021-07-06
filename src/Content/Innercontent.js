import React from 'react';
import HtmlParser from 'react-html-parser';
import { HtmlVideo } from './HTMLVideo/HTMLVideo';
import { YoutubeVideo } from './YoutubeVideo/YoutubeVideo';
import { LikeShareGeneric } from './LikeAndShare/LikeShare/LikeShareGeneric';
import { icons } from './icons/icons.js';

const Innercontent = (props) => {
	const { item, parent, ProductList, ProductGrid, Category } = props;
	if (!item || !item.entity_id) return '';
	let data = {};
	if (item.data && typeof item.data === 'object') {
		data = item.data;
	} else if (item.dataParsed) {
		data = item.dataParsed;
	}
	if (item.type === 'text') {
		const textValue = item.name ? item.name : 'Your Text Go Here';
		if (item.dataParsed && item.dataParsed.textTag) {
			const TextTag = item.dataParsed.textTag;
			return <TextTag>{textValue}</TextTag>;
		}
		return textValue;
	} else if (item.type === 'image') {
		if (data.image)
			return (
				<img
					src={data.image}
					alt={(data.alt !== undefined ? data.alt : 'pb img item') || ''}
					title={(data.title !== undefined ? data.title : '') || ''}
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
	} else if (item.type === 'category') {
		if (Category) return <Category item={item} />;
		else return '';
	} else if (item.type === 'product_scroll') {
		if (ProductList) return <ProductList item={item} />;
		else return '';
	} else if (item.type === 'product_grid') {
		if (ProductGrid) return <ProductGrid item={item} />;
		else return '';
	} else if (item.type === 'paragraph') {
		if (data.paragraphContent) return HtmlParser(data.paragraphContent);
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
				/>
			);
		}
	} else if (item.type === 'share_button') {
		return <LikeShareGeneric item={item} />;
	} else if (item.type === 'custom_html') {
		if (data.htmlContent) return HtmlParser(data.htmlContent);
	} else if (item.type === 'icon') {
		if (data.icon && icons[data.icon]) return icons[data.icon];
	}
	return '';
};

export default Innercontent;
