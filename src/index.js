import React from 'react'
import styles from './styles.module.css'

export const PageBuilderComponent = ({ endPoint, maskedId }) => {
    return <div className={styles.test}>PageBuilder Component for: endPoint: {endPoint}, maskedId: {maskedId}</div>
}
