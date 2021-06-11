import React from 'react';
import product_item_mockup from './images/product_item_mockup.png';
import HtmlParser from 'react-html-parser';
import { HtmlVideo } from './HTMLVideo/HTMLVideo';
import { YoutubeVideo } from './YoutubeVideo/YoutubeVideo';
import { LikeShareGeneric } from './LikeAndShare/LikeShare/LikeShareGeneric';

class Innercontent extends React.Component {
	render = () => {
		const item = this.props.item;

		if (!item || !item.entity_id) return '';
		let data = {};
		if (item.data && typeof item.data === 'object') {
			data = item.data;
		} else if (item.dataParsed) {
			data = item.dataParsed;
		}

		if (item.type === 'button') {
			return item.name ? item.name : 'Button Label';
		} else if (item.type === 'text') {
			return item.name ? item.name : 'Your Text Go Here';
		} else if (item.type === 'image') {
			if (data.image)
				return (
					<React.Fragment>
						<img
							src={data.image}
							alt={(data.alt !== undefined ? data.alt : 'pb img item') || ''}
							title={(data.title !== undefined ? data.title : '') || ''}
							style={{
								width: data.width || '100%',
								height: data.height || 'auto',
							}}
						/>
					</React.Fragment>
				);
		} else if (item.type === 'category') {
			return (
				<React.Fragment>
					{data.image ? (
						<img src={data.image} alt='pb img item' style={{ width: '100%' }} />
					) : (
						''
					)}
					{item.name && (
						<div style={{ textAlign: 'center', marginTop: 10 }}>
							{item.name}
						</div>
					)}
				</React.Fragment>
			);
		} else if (item.type === 'product_scroll') {
			return '';
			const products = [];
			for (let i = 0; i < 12; i++) {
				products.push(
					<div
						key={i}
						style={{
							width: 170,
							paddingTop: 250,
							backgroundRepeat: 'no-repeat',
							flexShrink: 0,
						}}
					>
						<img src={product_item_mockup} style={{ width: '100%' }} />
					</div>,
				);
			}
			return (
				<div style={{ display: 'flex', flexWrap: 'wrap', overflow: 'hidden' }}>
					<div
						style={{
							display: 'flex',
							width: '100%',
							marginBottom: 15,
							justifyContent: 'space-between',
						}}
					>
						{item.name}
						{/* eslint-disable-next-line */}
                        <a href="#">{`View more >>`}</a>
					</div>
					<div
						style={{
							display: 'flex',
							width: '100%',
							flexWrap: 'nowrap',
							overflow: 'auto',
						}}
					>
						{products}
					</div>
				</div>
			);
		} else if (item.type === 'product_grid') {
			return '';
			const products = [];
			for (let i = 0; i < 6; i++) {
				products.push(
					<div
						key={i}
						style={{
							background: `url("${product_item_mockup}")`,
							backgroundSize: 'contain',
							backgroundPosition: 'center top',
							minWidth: 170,
							width: '30%',
							paddingTop: '45%',
							backgroundRepeat: 'no-repeat',
							flexShrink: 0,
						}}
					/>,
				);
			}
			return (
				<div style={{ display: 'flex', flexWrap: 'wrap', overflow: 'hidden' }}>
					<div style={{ width: '100%', marginBottom: 10, textAlign: 'center' }}>
						{item.name}
					</div>
					<div
						style={{
							display: 'flex',
							width: '100%',
							flexWrap: 'wrap',
							justifyContent: 'center',
						}}
					>
						{products}
					</div>
				</div>
			);
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
		}
		return '';
	};
}

export default Innercontent;
