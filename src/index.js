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
		ProductScroll,
		CategoryScroll,
		formatMessage: _formatMessage,
		history,
		Link,
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

	if (spgData && (spgData.status || toPreview)) {
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
                                border: none;
                                background-color: #ffffff;
                            }
                            
                            .spb-item.type_button:hover {
                                opacity: 0.8;
                            }

                            .spb-item.type_image {
                                padding: 0;
                            }
                            .spb-item.type_dropdown.collapsed > .spb-item {
                                display: none !important;
                            }
                            .spb-item.type_dropdown .smpb-dropdown-title {
                                cursor: pointer;
                                display: flex;
                                padding: 15px;
                                justify-content: space-between;
                            }

                            .spb-item.type_dropdown .smpb-dropdown-title svg,
                            .spb-item.type_dropdown .smpb-dropdown-title img {
                                width: 21px;
                                height: 21px;
                            }

                            .spb-item h1,
                            .spb-item h2,
                            .spb-item h3,
                            .spb-item h4,
                            .spb-item h5,
                            .spb-item h6 {
                                margin-top: 0;
                                margin-bottom: 0;
                                font-weight: 500;
                                line-height: 1.2;
                            }
                            .spb-item h1 {
                                font-size: 2.1875rem;
                            }
                            .spb-item h2 {
                                font-size: 1.75rem;
                            }
                            .spb-item h3 {
                                font-size: 1.53125rem;
                            }
                            .spb-item h4 {
                                font-size: 1.3125rem;
                            }
                            .spb-item h5 {
                                font-size: 1.09375rem;
                            }
                            .spb-item h6 {
                                font-size: 0.875rem;
                            }

                            .spb-item.type_instagram .simipb-insta-item {
                                display: block;
                            }
                            .spb-item.type_instagram .simipb-insta-item img,
                            .spb-item.type_instagram .simipb-insta-item video {    
                                max-width: 100%;
                                height: 100%;
                                object-fit: cover;
                            }
                            
                            //react-responsive-carousel/lib/styles/carousel.min.css
                            .carousel .control-arrow,.carousel.carousel-slider .control-arrow{-webkit-transition:all .25s ease-in;-moz-transition:all .25s ease-in;-ms-transition:all .25s ease-in;-o-transition:all .25s ease-in;transition:all .25s ease-in;opacity:.4;filter:alpha(opacity=40);position:absolute;z-index:2;top:20px;background:none;border:0;font-size:32px;cursor:pointer}.carousel .control-arrow:focus,.carousel .control-arrow:hover{opacity:1;filter:alpha(opacity=100)}.carousel .control-arrow:before,.carousel.carousel-slider .control-arrow:before{margin:0 5px;display:inline-block;border-top:8px solid transparent;border-bottom:8px solid transparent;content:''}.carousel .control-disabled.control-arrow{opacity:0;filter:alpha(opacity=0);cursor:inherit;display:none}.carousel .control-prev.control-arrow{left:0}.carousel .control-prev.control-arrow:before{border-right:8px solid #fff}.carousel .control-next.control-arrow{right:0}.carousel .control-next.control-arrow:before{border-left:8px solid #fff}.carousel-root{outline:none}.carousel{position:relative;width:100%}.carousel *{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.carousel img{width:100%;display:inline-block;pointer-events:none}.carousel .carousel{position:relative}.carousel .control-arrow{outline:0;border:0;background:none;top:50%;margin-top:-13px;font-size:18px}.carousel .thumbs-wrapper{margin:20px;overflow:hidden}.carousel .thumbs{-webkit-transition:all .15s ease-in;-moz-transition:all .15s ease-in;-ms-transition:all .15s ease-in;-o-transition:all .15s ease-in;transition:all .15s ease-in;-webkit-transform:translate3d(0, 0, 0);-moz-transform:translate3d(0, 0, 0);-ms-transform:translate3d(0, 0, 0);-o-transform:translate3d(0, 0, 0);transform:translate3d(0, 0, 0);position:relative;list-style:none;white-space:nowrap}.carousel .thumb{-webkit-transition:border .15s ease-in;-moz-transition:border .15s ease-in;-ms-transition:border .15s ease-in;-o-transition:border .15s ease-in;transition:border .15s ease-in;display:inline-block;margin-right:6px;white-space:nowrap;overflow:hidden;border:3px solid #fff;padding:2px}.carousel .thumb:focus{border:3px solid #ccc;outline:none}.carousel .thumb.selected,.carousel .thumb:hover{border:3px solid #333}.carousel .thumb img{vertical-align:top}.carousel.carousel-slider{position:relative;margin:0;overflow:hidden}.carousel.carousel-slider .control-arrow{top:0;color:#fff;font-size:26px;bottom:0;margin-top:0;padding:5px}.carousel.carousel-slider .control-arrow:hover{background:rgba(0,0,0,0.2)}.carousel .slider-wrapper{overflow:hidden;margin:auto;width:100%;-webkit-transition:height .15s ease-in;-moz-transition:height .15s ease-in;-ms-transition:height .15s ease-in;-o-transition:height .15s ease-in;transition:height .15s ease-in}.carousel .slider-wrapper.axis-horizontal .slider{-ms-box-orient:horizontal;display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-moz-flex;display:-webkit-flex;display:flex}.carousel .slider-wrapper.axis-horizontal .slider .slide{flex-direction:column;flex-flow:column}.carousel .slider-wrapper.axis-vertical{-ms-box-orient:horizontal;display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-moz-flex;display:-webkit-flex;display:flex}.carousel .slider-wrapper.axis-vertical .slider{-webkit-flex-direction:column;flex-direction:column}.carousel .slider{margin:0;padding:0;position:relative;list-style:none;width:100%}.carousel .slider.animated{-webkit-transition:all .35s ease-in-out;-moz-transition:all .35s ease-in-out;-ms-transition:all .35s ease-in-out;-o-transition:all .35s ease-in-out;transition:all .35s ease-in-out}.carousel .slide{min-width:100%;margin:0;position:relative;text-align:center}.carousel .slide img{width:100%;vertical-align:top;border:0}.carousel .slide iframe{display:inline-block;width:calc(100% - 80px);margin:0 40px 40px;border:0}.carousel .slide .legend{-webkit-transition:all .5s ease-in-out;-moz-transition:all .5s ease-in-out;-ms-transition:all .5s ease-in-out;-o-transition:all .5s ease-in-out;transition:all .5s ease-in-out;position:absolute;bottom:40px;left:50%;margin-left:-45%;width:90%;border-radius:10px;background:#000;color:#fff;padding:10px;font-size:12px;text-align:center;opacity:0.25;-webkit-transition:opacity .35s ease-in-out;-moz-transition:opacity .35s ease-in-out;-ms-transition:opacity .35s ease-in-out;-o-transition:opacity .35s ease-in-out;transition:opacity .35s ease-in-out}.carousel .control-dots{position:absolute;bottom:0;margin:10px 0;padding:0;text-align:center;width:100%;z-index:1}@media (min-width: 960px){.carousel .control-dots{bottom:0}}.carousel .control-dots .dot{-webkit-transition:opacity .25s ease-in;-moz-transition:opacity .25s ease-in;-ms-transition:opacity .25s ease-in;-o-transition:opacity .25s ease-in;transition:opacity .25s ease-in;opacity:.3;filter:alpha(opacity=30);box-shadow:1px 1px 2px rgba(0,0,0,0.9);background:#fff;border-radius:50%;width:8px;height:8px;cursor:pointer;display:inline-block;margin:0 8px}.carousel .control-dots .dot.selected,.carousel .control-dots .dot:hover{opacity:1;filter:alpha(opacity=100)}.carousel .carousel-status{position:absolute;top:0;right:0;padding:5px;font-size:10px;text-shadow:1px 1px 1px rgba(0,0,0,0.9);color:#fff}.carousel:hover .slide .legend{opacity:1}
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
					history={history}
					Link={Link}
					data={data.data}
					ProductList={ProductList}
					ProductGrid={ProductGrid}
					Category={Category}
					ProductScroll={ProductScroll}
					CategoryScroll={CategoryScroll}
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
		if (typeof window !== 'undefined' && window.smPbPagesByToken) {
			setPbData(window.smPbPagesByToken);
		} else {
			if (!loading) {
				setLoading(true);
				sendRequest(
					endPoint,
					(result) => {
						setLoading(false);
						if (
							result &&
							result.data &&
							result.data.spb_page &&
							typeof window !== 'undefined'
						)
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
