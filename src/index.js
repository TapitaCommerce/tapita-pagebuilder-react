import React, { useEffect, useState } from 'react';
import { sendRequest } from './Network/GraphQl';
import Content from './Content';
import { Helmet } from 'react-helmet';
import { styleString } from './style.css';

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
		lazyloadPlaceHolder,
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
					data={data.data}
					ProductList={ProductList}
					ProductGrid={ProductGrid}
					Category={Category}
					ProductScroll={ProductScroll}
					CategoryScroll={CategoryScroll}
					formatMessage={formatMessage}
					lazyloadPlaceHolder={lazyloadPlaceHolder}
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
