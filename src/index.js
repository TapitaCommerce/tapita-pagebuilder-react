import React, { useEffect, useState } from 'react';
import { sendRequest } from './Network/GraphQl';
import Content from './Content';

const GET_ITEM_QUERY = `
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
                class_name
                type
                visibility
                storeview_visibility
                sort_order
            }
        }
    }
`;

export const PageBuilderComponent = ({ endPoint, maskedId }) => {
	const [data, setData] = useState(false);
	if (!data) {
		sendRequest(
			endPoint,
			(result) => {
				setData(result);
			},
			GET_ITEM_QUERY,
			{ pageMaskedId: maskedId },
			'getPbItem',
		);
	}
	if (
		data &&
		data.data &&
		data.data.spb_item &&
		data.data.spb_item.items &&
		data.data.spb_page
	) {
		return <Content data={data.data} />;
	}
	return '';
};
