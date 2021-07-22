import React, { useEffect, useState } from 'react';
import { sendRequest } from './Network/GraphQl';
import Content from './Content';
import { Helmet } from 'react-helmet';

const PREVIEW_ITEM_QUERY = `
    query getPbItem($pageMaskedId: String) {
        spb_page(pageMaskedId: $pageMaskedId) {
            total_count
            items {
                entity_id
                name
                status
                masked_id
                custom_css
                custom_js
                keywords
                title
                desc
                is_rtl
                storeview_visibility
            }
        }
        spb_item(pageMaskedId: $pageMaskedId) {
            total_count
            items {
                entity_id
                page_id
                parent_id
                styles
                data
                name
                tag_id
                class_name
                type
                status
                visibility
                storeview_visibility
                sort_order
            }
        }
    }
`;

const GET_ITEM_QUERY = `
    query getPbItem($pageMaskedId: String) {
        spb_page(pageMaskedId: $pageMaskedId) {
            total_count
            items {
                entity_id
                name
                status
                masked_id
                custom_css
                custom_js
                keywords
                title
                desc
                publish_items
                is_rtl
                storeview_visibility
            }
        }
    }
`;

const getPbPageQuery = (getPageItems) => {
	return `
        query getPagesByToken($integrationToken: String) {
            spb_page(integrationToken: $integrationToken) {
                total_count
                items {
                    url_path
                    priority
                    entity_id
                    name
                    status
                    masked_id
                    custom_css
                    custom_js
                    keywords
                    title
                    desc
                    is_rtl
                    storeview_visibility
                    ${getPageItems ? 'publish_items' : ''}
                }
            }
        }
    `;
};

export const PageBuilderComponent = (props) => {
	const {
		endPoint,
		maskedId,
		pageData,
		toPreview,
		ProductList,
		ProductGrid,
		Category,
		formatMessage: _formatMessage,
	} = props;
	const [data, setData] = useState(
		pageData && pageData.publish_items
			? { data: { spb_page: { items: [pageData] } } }
			: false,
	);

	const formatMessage = ({ id, val, defaultMessage }) => {
		const msg = id || val || defaultMessage;
		if (!_formatMessage || !msg) {
			return val;
		} else {
			return _formatMessage({ id: msg, defaultMessage: val });
		}
	};

	if (!data) {
		sendRequest(
			endPoint,
			(result) => {
				setData(result);
			},
			toPreview && (!pageData || !pageData.publish_items)
				? PREVIEW_ITEM_QUERY
				: GET_ITEM_QUERY,
			{ pageMaskedId: maskedId },
			'getPbItem',
		);
	}
	let spgData;
	if (
		(data &&
			data.data &&
			data.data.spb_page &&
			// live
			data.data.spb_item &&
			data.data.spb_item.items &&
			data.data.spb_page &&
			data.data.spb_page.items[0]) ||
		// preview
		(data &&
			data.data &&
			data.data.spb_page &&
			data.data.spb_page.items &&
			data.data.spb_page.items[0] &&
			data.data.spb_page.items[0].publish_items)
	) {
		spgData = data.data.spb_page.items[0];
	}

	if (spgData && spgData.status) {
		return (
			<React.Fragment>
				<Helmet
					style={[
						{
							cssText: `
                            .spb-item {
                                overflow: auto;
                                transition: transform 0.3s ease;
                                position: relative;
                                flex-shrink: 0;
                                background-size: cover;
                                background-repeat: no-repeat;
                                background-position: top left;
                                padding: 15px;
                                box-sizing: border-box;
                            }

                            .type_slider .carousel-root {
                                max-width: 100%;
                            }

                            .spb-item-root {
                                align-items: center;
                                padding: 0px;
                            }

                            .spb-item .type_slider {
                                background-color: white;
                                padding: 0;
                            }

                            .spb-item.type_button {
                                padding: 10px 20px;
                                cursor: pointer;
                            }

                            .spb-item.type_button:hover {
                                opacity: 0.8;
                            }

                            .spb-item.type_image {
                                padding: 0;
                            }
                            
                            h1,
                            h2,
                            h3,
                            h4,
                            h5,
                            h6 {
                                margin-top: 0;
                                margin-bottom: 0;
                                font-weight: 500;
                                line-height: 1.2;
                            }
                            h1 {
                                font-size: 2.1875rem;
                            }
                            h2 {
                                font-size: 1.75rem;
                            }
                            h3 {
                                font-size: 1.53125rem;
                            }
                            h4 {
                                font-size: 1.3125rem;
                            }
                            h5 {
                                font-size: 1.09375rem;
                            }
                            h6 {
                                font-size: 0.875rem;
                            }
                            
                            .slick-slider{position:relative;display:block;box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-touch-callout:none;-khtml-user-select:none;-ms-touch-action:pan-y;touch-action:pan-y;-webkit-tap-highlight-color:transparent}.slick-list{position:relative;display:block;overflow:hidden;margin:0;padding:0}.slick-list:focus{outline:0}.slick-list.dragging{cursor:pointer;cursor:hand}.slick-slider .slick-list,.slick-slider .slick-track{-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);-ms-transform:translate3d(0,0,0);-o-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}.slick-track{position:relative;top:0;left:0;display:block;margin-left:auto;margin-right:auto}.slick-track:after,.slick-track:before{display:table;content:''}.slick-track:after{clear:both}.slick-loading .slick-track{visibility:hidden}.slick-slide{display:none;float:left;height:100%;min-height:1px}[dir=rtl] .slick-slide{float:right}.slick-slide img{display:block}.slick-slide.slick-loading img{display:none}.slick-slide.dragging img{pointer-events:none}.slick-initialized .slick-slide{display:block}.slick-loading .slick-slide{visibility:hidden}.slick-vertical .slick-slide{display:block;height:auto;border:1px solid transparent}.slick-arrow.slick-hidden{display:none}

                            @charset 'UTF-8';.slick-loading .slick-list{background:#fff url(ajax-loader.gif) center center no-repeat}@font-face{font-family:slick;font-weight:400;font-style:normal;src:url(fonts/slick.eot);src:url(fonts/slick.eot?#iefix) format('embedded-opentype'),url(fonts/slick.woff) format('woff'),url(fonts/slick.ttf) format('truetype'),url(fonts/slick.svg#slick) format('svg')}.slick-next,.slick-prev{font-size:0;line-height:0;position:absolute;top:50%;display:block;width:20px;height:20px;padding:0;-webkit-transform:translate(0,-50%);-ms-transform:translate(0,-50%);transform:translate(0,-50%);cursor:pointer;color:transparent;border:none;outline:0;background:0 0}.slick-next:focus,.slick-next:hover,.slick-prev:focus,.slick-prev:hover{color:transparent;outline:0;background:0 0}.slick-next:focus:before,.slick-next:hover:before,.slick-prev:focus:before,.slick-prev:hover:before{opacity:1}.slick-next.slick-disabled:before,.slick-prev.slick-disabled:before{opacity:.25}.slick-next:before,.slick-prev:before{font-family:slick;font-size:20px;line-height:1;opacity:.75;color:#fff;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.slick-prev{left:-25px}[dir=rtl] .slick-prev{right:-25px;left:auto}.slick-prev:before{content:'←'}[dir=rtl] .slick-prev:before{content:'→'}.slick-next{right:-25px}[dir=rtl] .slick-next{right:auto;left:-25px}.slick-next:before{content:'→'}[dir=rtl] .slick-next:before{content:'←'}.slick-dotted.slick-slider{margin-bottom:30px}.slick-dots{position:absolute;bottom:-25px;display:block;width:100%;padding:0;margin:0;list-style:none;text-align:center}.slick-dots li{position:relative;display:inline-block;width:20px;height:20px;margin:0 5px;padding:0;cursor:pointer}.slick-dots li button{font-size:0;line-height:0;display:block;width:20px;height:20px;padding:5px;cursor:pointer;color:transparent;border:0;outline:0;background:0 0}.slick-dots li button:focus,.slick-dots li button:hover{outline:0}.slick-dots li button:focus:before,.slick-dots li button:hover:before{opacity:1}.slick-dots li button:before{font-family:slick;font-size:6px;line-height:20px;position:absolute;top:0;left:0;width:20px;height:20px;content:'•';text-align:center;opacity:.25;color:#000;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.slick-dots li.slick-active button:before{opacity:.75;color:#000}
                            
                        `,
						},
					]}
				/>
				{spgData && spgData.custom_css ? (
					<Helmet
						style={[
							{
								cssText: spgData.custom_css,
							},
						]}
					/>
				) : (
					''
				)}
				{spgData && spgData.custom_js ? (
					<Helmet
						script={[
							{
								type: 'text/javascript',
								innerHTML: spgData.custom_js,
							},
						]}
					/>
				) : (
					''
				)}
				<Helmet>
					{spgData.title ? <title>{spgData.title}</title> : ''}
					{spgData.desc ? (
						<meta name='description' content={spgData.desc} />
					) : (
						''
					)}
					{spgData.keywords ? (
						<meta name='keywords' content={spgData.keywords} />
					) : (
						''
					)}
				</Helmet>
				<Content
					data={data.data}
					ProductList={ProductList}
					ProductGrid={ProductGrid}
					Category={Category}
					formatMessage={formatMessage}
				/>
			</React.Fragment>
		);
	}
	return '';
};

export const usePbFinder = (props) => {
	const { endPoint, integrationToken, storeCode, getPageItems } = props;
	const [pbData, setPbData] = useState(false);
	const [loading, setLoading] = useState(false);
	const [pathToFind, setPathFoFind] = useState(false);
	let pageMaskedId;
	let pageData;

	const findPage = (pathName) => {
		setPathFoFind(pathName);
		if (window.smPbPagesByToken) {
			setPbData(window.smPbPagesByToken);
		} else {
			if (!loading) {
				setLoading(true);
				sendRequest(
					endPoint,
					(result) => {
						setLoading(false);
						if (result && result.data && result.data.spb_page)
							window.smPbPagesByToken = result;
						setPbData(result);
					},
					getPbPageQuery(getPageItems),
					{ integrationToken },
					'getPbPage',
				);
			}
		}
	};

	if (pbData && pbData.data && pbData.data.spb_page && pathToFind) {
		const { spb_page } = pbData.data;
		pageMaskedId = 'notfound';
		if (spb_page.items && spb_page.items.length) {
			const pbPages = JSON.parse(JSON.stringify(spb_page.items));
			pbPages.sort(
				(el1, el2) => parseInt(el2.priority) - parseInt(el1.priority),
			);
			const pageToFind = pbPages.find((item) => {
				if (storeCode && item.storeview_visibility) {
					const storeViews = item.storeview_visibility.trim().split(',');
					if (!storeViews.includes(storeCode)) return false;
				}
				return item.url_path === pathToFind;
			});
			if (pageToFind && pageToFind.masked_id) {
				pageData = pageToFind;
				pageMaskedId = pageToFind.masked_id;
			}
		}
	}

	return {
		loading,
		pageMaskedId,
		findPage,
		pathToFind,
		pageData,
	};
};
