import React from 'react';
import product_item_mockup from './images/product_item_mockup.png';
import HtmlParser from 'react-html-parser';

class Innercontent extends React.Component {
	render = () => {
		const item = this.props.item;
		if (!item || !item.entity_id) return '';
		let data = {};
		if (item.data && typeof item.data === 'string') {
			try {
				data = JSON.parse(item.data);
			} catch (err) {}
		} else if (item.data && typeof item.data === 'object') {
			data = item.data;
		}
		if (item.type === 'button') {
			return item.name ? item.name : 'Button Label';
		} else if (item.type === 'text') {
			return item.name ? item.name : 'Your Text Go Here';
		} else if (item.type === 'image') {
			if (data.image)
				return (
					<img src={data.image} alt='pb img item' style={{ width: '100%' }} />
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
		}
		return '';
	};
}

export default Innercontent;
