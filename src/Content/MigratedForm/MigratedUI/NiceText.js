import React, { useState } from 'react';
import { mergeObj } from '../utils/mergeObj';

export const NiceText = (props) => {
	const { style = {}, placeholderStyle = {}, type, ...rest } = props;
	const [val, setVal] = useState('');

	const trueStyle = !val ? mergeObj(style, placeholderStyle) : style;
	const onChange = (e) => setVal(e.target.value || '');

	if (type === 'text-area') {
		return <textarea {...rest} style={trueStyle} onChange={onChange} />;
	}

	return <input {...rest} style={trueStyle} onChange={onChange} type={type} />;
};
