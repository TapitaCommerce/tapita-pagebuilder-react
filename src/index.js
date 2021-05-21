import React, { useEffect, useState } from 'react';
import { sendRequest } from './Network/GraphQl';
import Content from './Content';

const PREVIEW_ITEM_QUERY = `
    query getPbItem($pageMaskedId: String) {
        spb_page(pageMaskedId: $pageMaskedId) {
            total_count
            items {
                entity_id
                name
                masked_id
                custom_css
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
                masked_id
                custom_css
                publish_items
            }
        }
    }
`;

export const PageBuilderComponent = (props) => {
	const { endPoint, maskedId, toPreview } = props;
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
		((data.data.spb_item && data.data.spb_item.items) ||
			(data.data.spb_page &&
				data.data.spb_page.items &&
				data.data.spb_page.items[0] &&
				data.data.spb_page.items[0].publish_items))
	) {
		return <Content data={data.data} />;
	}
	return '';
};
