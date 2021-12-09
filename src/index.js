import React, { useState } from 'react';
import { sendRequest } from './Network/GraphQl';
import Content from './Content';
import { Helmet } from 'react-helmet';
import { styleString } from './style.css';

const itemFields = `
    entity_id
    page_id
    parent_id
    styles
    data
    name
    class_name
    type
    status
    visibility
    storeview_visibility
    sort_order
`;

const pageFields = `
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
`;

const PREVIEW_ITEM_QUERY = `
    query getPbItem($pageMaskedId: String) {
        spb_page(pageMaskedId: $pageMaskedId) {
            total_count
            items {
                ${pageFields}
            }
        }
        spb_item(pageMaskedId: $pageMaskedId) {
            total_count
            items {
                ${itemFields}
            }
        }
        catalog_builder_page(pageMaskedId: $pageMaskedId) {
            total_count
            items {
                ${pageFields}
            }
        }
        catalog_builder_item(pageMaskedId: $pageMaskedId) {
            total_count
            items {
                ${itemFields}
            }
        }
    }
`;

const GET_ITEM_QUERY = `
    query getPbItem($pageMaskedId: String) {
        spb_page(pageMaskedId: $pageMaskedId) {
            total_count
            items {
                ${pageFields}
                publish_items
            }
        }
        catalog_builder_page(pageMaskedId: $pageMaskedId) {
            total_count
            items {
                ${pageFields}
                publish_items
            }
        }
    }
`;

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
		lazyloadPlaceHolder,
		overRender,
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
	let contentData = data.data;
	if (
		data &&
		data.data &&
		data.data.spb_page &&
		data.data.spb_page.items[0] &&
		(data.data.spb_page.items[0].publish_items ||
			(data.data.spb_item && data.data.spb_item.items))
	) {
		spgData = data.data.spb_page.items[0];
	} else if (
		data &&
		data.data &&
		data.data.catalog_builder_page &&
		data.data.catalog_builder_page.items[0] &&
		(data.data.catalog_builder_page.items[0].publish_items ||
			(data.data.catalog_builder_item && data.data.catalog_builder_item.items))
	) {
		spgData = data.data.catalog_builder_page.items[0];
		contentData = {
			spb_page: data.data.catalog_builder_page,
			spb_item: data.data.catalog_builder_item,
		};
	}

	if (spgData && (spgData.status || toPreview)) {
		return (
			<React.Fragment>
				<Helmet
					style={[
						{
							cssText: styleString,
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
					data={contentData}
					ProductList={ProductList}
					ProductGrid={ProductGrid}
					Category={Category}
					ProductScroll={ProductScroll}
					CategoryScroll={CategoryScroll}
					formatMessage={formatMessage}
					lazyloadPlaceHolder={lazyloadPlaceHolder}
					overRender={overRender}
				/>
			</React.Fragment>
		);
	}
	return '';
};

export const usePbFinder = (props) => {
	const { endPoint, integrationToken, storeCode } = props;
	const [pbData, setPbData] = useState(false);
	const [loading, setLoading] = useState(false);
	const [pathToFind, setPathFoFind] = useState(false);
	let pageMaskedId;
	let pageData;
	let pbUrl = endPoint.replace('/graphql', '/publishedpb');
	if (!pbUrl.endsWith('/')) pbUrl += '/';
	if (pbUrl.indexOf('?') !== -1)
		pbUrl += '&integrationToken=' + integrationToken;
	else pbUrl += '?integrationToken=' + integrationToken;
	const findPage = (pathName) => {
		setPathFoFind(pathName);
		if (typeof window !== 'undefined' && window.smPbPagesByToken) {
			setPbData(window.smPbPagesByToken);
		} else {
			if (!loading) {
				setLoading(true);
				sendRequest(
					pbUrl,
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
					'',
					{ integrationToken },
					'getPbPage',
				);
			}
		}
	};

	if (pbData && pbData.data) {
		if (pathToFind && pbData.data.spb_page) {
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
	}

	return {
		loading,
		pageMaskedId,
		findPage,
		pathToFind,
		pageData,
		allPages: pbData,
	};
};
