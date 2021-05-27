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
            }
        }
    }
`;

export const PageBuilderComponent = props => {
    const { endPoint, maskedId, toPreview, ProductList, ProductGrid } = props;
    const [data, setData] = useState(false);
    if (!data) {
        sendRequest(
            endPoint,
            (result) => {
                setData(result);
            },
            toPreview ? PREVIEW_ITEM_QUERY : GET_ITEM_QUERY,
            { pageMaskedId: maskedId },
            'getPbItem',
        );
    }

    if (
        data &&
        data.data &&
        data.data.spb_page &&
        (
            //live
            (data.data.spb_item && data.data.spb_item.items && data.data.spb_page && data.data.spb_page.items[0]) ||
            //preview
            (data.data.spb_page &&
                data.data.spb_page.items &&
                data.data.spb_page.items[0] &&
                data.data.spb_page.items[0].publish_items)
        )
    ) {
        const spgData = data.data.spb_page.items[0];
        if (!spgData || !spgData.status)
            return ''
        return (
            <React.Fragment>
                <Helmet
                    style={[{
                        "cssText": `
                            .spb-item {
                                background-color: white;
                                overflow: auto;
                                transition: transform 0.3s ease;
                                position: relative;
                                flex-shrink: 0;
                                background-size: cover;
                                background-repeat: no-repeat;
                                background-position: top left;
                                padding: 15px;
                            }
                            .spb-item-root {
                                align-items: center;
                                padding: 0px;
                            }

                            .spb-item .slide {
                                background-color: white;
                            }

                            .spb-item.type_button {
                                padding: 10px 20px;
                                cursor: pointer;
                            }

                            .spb-item.type_button:hover {
                                opacity: 0.8;
                            }
                        `
                    }]}
                />
                {
                    (spgData && spgData.custom_css) ?
                        <Helmet
                            style={[{
                                "cssText": custom_css
                            }]}
                        /> : ''
                }
                <Helmet>
                    {spgData.title ? <title>{spgData.title}</title> : ''}
                    {spgData.desc ? <meta name="description" content={spgData.desc} /> : ''}
                    {spgData.keywords ? <meta name="keywords" content={spgData.keywords} /> : ''}
                </Helmet>
                <Content data={data.data} ProductList={ProductList} ProductGrid={ProductGrid} />
            </React.Fragment >
        );
    }
    return '';
};
