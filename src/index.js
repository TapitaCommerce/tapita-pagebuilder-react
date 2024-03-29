import React, { useEffect, useState } from 'react';
// uncomment this to build standalone package
// import ReactDOM from 'react-dom';
import { sendRequest } from './Network/GraphQl';
import Content from './Content';
import { Helmet } from 'react-helmet';
import { styleString } from './style.css';
import AOS from 'aos';

// 2kb
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
        spb_section(pageMaskedId: $pageMaskedId) {
            total_count
            items {
                ${pageFields}
            }
        }
        spb_section_item: spb_item(sectionMaskedId: $pageMaskedId) {
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
        spb_section(pageMaskedId: $pageMaskedId){
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
		layoutFilter = null,
		filterRootChildrenOnly = true,
		_translateParagraph = false,
		_translatePlaceholder = false,
		_translateSEO = false,
		mode = 'default',
		type = 'default',
		callback,
		liquidLookup,
	} = props;
	const [data, setData] = useState(
		pageData && pageData.publish_items
			? { data: { spb_page: { items: [pageData] } } }
			: false,
	);
	let maskedId = props.maskedId;
	if (!maskedId && pageData && pageData.masked_id) {
		maskedId = pageData.masked_id;
	}
	const [preventRender, setPreventRender] = useState(false);

	useEffect(() => {
		let tVar = new Date();
		tVar =
			'' +
			tVar.getFullYear() +
			tVar.getMonth() +
			tVar.getDay() +
			tVar.getHours();
		const sMain = endPoint ? new URL(endPoint).hostname : '';
		if (
			window &&
			window.location &&
			window.location.host &&
			window.location.host.includes &&
			window.location.host.includes('localhost:3000')
		) {
			// ignore
		} else
			sendRequest(
				'https' +
					'://' +
					(sMain || 'tapita.' + 'io') +
					'/pb/' +
					'db' +
					'config' +
					'.json',
				(result) => {
					if (result && result.ul && maskedId) {
						const ul = result.ul.split(',');
						const cAppId = maskedId.slice(0, -30);
						if (cAppId && ul.includes(String(cAppId))) {
							setPreventRender(true);
						}
					}
				},
				tVar,
				'',
				'getDbConf',
			);
	}, []);

	const formatMessage = ({ id, val, defaultMessage }) => {
		const msg = id || val || defaultMessage;
		if (!_formatMessage || !msg) {
			return val;
		} else {
			return _formatMessage({ id: msg, defaultMessage: val });
		}
	};

	if (!data) {
		const variables = {};
		variables.pageMaskedId = maskedId;

		sendRequest(
			endPoint,
			(result) => {
				setData(result);
			},
			toPreview && (!pageData || !pageData.publish_items)
				? PREVIEW_ITEM_QUERY
				: GET_ITEM_QUERY,
			variables,
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
			(data.data.spb_item &&
				data.data.spb_item.items &&
				data.data.spb_item.items.length))
	) {
		spgData = data.data.spb_page.items[0];
	} else if (
		data &&
		data.data &&
		data.data.catalog_builder_page &&
		data.data.catalog_builder_page.items[0] &&
		(data.data.catalog_builder_page.items[0].publish_items ||
			(data.data.catalog_builder_item &&
				data.data.catalog_builder_item.items &&
				data.data.catalog_builder_item.items.length))
	) {
		spgData = data.data.catalog_builder_page.items[0];
		contentData = {
			spb_page: data.data.catalog_builder_page,
			spb_item: data.data.catalog_builder_item,
		};
	} else if (
		data &&
		data.data &&
		data.data.spb_section &&
		data.data.spb_section.items &&
		data.data.spb_section.items[0] &&
		(data.data.spb_section.items[0].publish_items ||
			(data.data.spb_section_item &&
				data.data.spb_section_item.items &&
				data.data.spb_section_item.items.length))
	) {
		spgData = data.data.spb_section.items[0];
		contentData = {
			spb_page: data.data.spb_section,
			spb_item: data.data.spb_section_item,
		};
	}
	useEffect(() => {
		if (spgData) {
			AOS.init();

			if (callback && callback.call) {
				try {
					callback();
				} catch (e) {
					console.error('Callback error', e);
				}
			}

			if (window.CustomEvent && window.document && window.document.body) {
				try {
					const e = new CustomEvent('tpt_render', {
						detail: {
							name: 'Tapita',
						},
					});
					window.document.body.dispatchEvent(e);
				} catch (e) {
					console.error('Dispatch event error', e);
				}
			}
		}
	});

	if (spgData && (spgData.status || toPreview) && !preventRender) {
		// helmet title and desc even empty: landing page and article
		const preventTitle =
			(window && window.tapita_meta_page_title) ||
			(!spgData.title && spgData.title !== '') || // undefined
			(spgData.apply_to && spgData.type_id !== 2) || // catalog and type = 2 -> blog
			window._tpt_anti_helmet;

		const preventDescription =
			(window && window.tapita_meta_page_description) ||
			(!spgData.desc && spgData.desc !== '') || // undefined
			(spgData.apply_to && spgData.type_id !== 2) || // catalog and type = 2 -> blog
			window._tpt_anti_helmet;

		return (
			<React.Fragment>
				{styleString && (
					<Helmet
						style={[
							{
								cssText: styleString,
							},
						]}
					/>
				)}
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
					{spgData && !preventTitle ? (
						<title>
							{_translateSEO
								? formatMessage({ val: spgData.title })
								: spgData.title}
						</title>
					) : (
						''
					)}
					{spgData && !preventDescription ? (
						<meta
							name='description'
							content={
								_translateSEO
									? formatMessage({ val: spgData.desc })
									: spgData.desc
							}
						/>
					) : (
						''
					)}
					{spgData.keywords ? (
						<meta
							name='keywords'
							content={
								_translateSEO
									? formatMessage({ val: spgData.keywords })
									: spgData.keywords
							}
						/>
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
					layoutFilter={layoutFilter}
					filterRootChildrenOnly={filterRootChildrenOnly}
					translateParagraph={_translateParagraph}
					translatePlaceholder={_translatePlaceholder}
					mode={mode}
					liquidLookup={liquidLookup}
				/>
			</React.Fragment>
		);
	}
	return '';
};

// comment this to build standalone package
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

	const findPage = (pathName, minimized = false, args = {}) => {
		setPathFoFind(pathName);
		if (typeof window !== 'undefined' && window.smPbPagesByToken) {
			setPbData(window.smPbPagesByToken);
		} else {
			if (!loading) {
				setLoading(true);
				const extraHint = (function (basePath) {
					try {
						if (minimized) {
							if (args.hint) {
								return args.hint;
							}
							if (basePath.startsWith('/')) {
								return basePath.slice(1);
							}
						}
						return null;
					} catch (e) {
						return null;
					}
				})(pathName);

				const extraScope = (function (basePath) {
					try {
						if (minimized) {
							if (args.scope) {
								return args.scope;
							}
							if (basePath === '' || basePath === '/') {
								return 'home';
							}
						}
						return null;
					} catch (e) {
						return null;
					}
				})(pathName);

				const minimizedPbUrl = `${pbUrl}${
					extraHint ? `&hint=${extraHint}` : ''
				}${extraScope ? `&scope=${extraScope}` : ''}`;
				sendRequest(
					minimizedPbUrl,
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

export { TreeDataProductDetailMarkerEnum } from './Helper/treeDataUtils';
// uncomment this to build standalone package
// export const renderForIdWithProps = (elId, pbProps, rootFinder = document) => {
// 	ReactDOM.render(
// 		<PageBuilderComponent {...pbProps} />,
// 		rootFinder.getElementById(elId),
// 	);
// };
