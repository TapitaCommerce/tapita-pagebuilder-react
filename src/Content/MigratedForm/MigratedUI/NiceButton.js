import React, { useState } from 'react';
import { mergeObj } from '../utils/mergeObj';

export const NiceButton = (props) => {
	const { style = {}, hoverStyle = {}, ...rest } = props;
	const [isHover, setHover] = useState(false);

	const trueStyle = isHover ? mergeObj(style, hoverStyle) : style;

	return (
		<button
			{...rest}
			style={trueStyle}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
		/>
	);
};
