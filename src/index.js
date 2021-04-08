import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { sendRequest } from './Network/GraphQl'

const GET_ITEM_QUERY = `
    query getPbItem($pageMaskedId: String) {
        spb_item(pageMaskedId: $pageMaskedId) {
            total_count
            items {
                entity_id
                name
            }
        }
    }
`;

export const PageBuilderComponent = ({ endPoint, maskedId }) => {
    const [data, setData] = useState(false);
    if (!data) {
        console.log('a')
        sendRequest(
            endPoint,
            data => {
                console.log(data);
                setData(data);
            },
            GET_ITEM_QUERY,
            { pageMaskedId: maskedId },
            "getPbItem"
        )
    }
    return <div className={styles.test}>PageBuilder Component for: endPoint: {endPoint}, maskedId: {maskedId}</div>
}
