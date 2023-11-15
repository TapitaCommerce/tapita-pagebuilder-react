import React, { useMemo } from 'react';
import { bindingMatrix } from './bindingMatrix';

export const OverloadedBindingMigrationRenderer = (props) => {
	const { type, item, liquidLookup } = props;
	// return type
	const matchingTypeData = bindingMatrix[type];

	// if (!matchingTypeData || mode !== 'shopify') {
	// 	return null;
	// }
	const RenderComponent = matchingTypeData.component;

	const { dataParsed } = item;

	const { inputConfig, dynamicInputConfig } = dataParsed || {};

	const formattedData = useMemo(() => {
		const obj = {
			id: item.entity_id,
			// TODO: handle this
			ident_1: '',
			ident_2: '',
		};
		Object.keys(inputConfig || {}).forEach((key) => {
			if (inputConfig[key].type === 'clone') {
				obj[key] = inputConfig[key].objectValue;
			} else {
				obj[key] = inputConfig[key].value;
			}
		});
		Object.keys(dynamicInputConfig || {}).forEach((key) => {
			if (
				liquidLookup &&
				Object.prototype.hasOwnProperty.call(liquidLookup, key)
			) {
				// TODO: handle this
				obj[key] = liquidLookup[key];
			} else {
				obj[key] = 'placeholder text';
			}
		});
		return obj;
	}, [inputConfig, dynamicInputConfig, item]);

	// return (
	// 	<p>{JSON.stringify(formattedData||{})}</p>
	// )
	return <RenderComponent shopify={formattedData || {}} disableFunction />;
};
