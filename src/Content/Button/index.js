import React from 'react';

const Button = props => {
	const { item } = props
	const { icon_position } = item.dataParsed
	const hasIcon = item.children.length ? true : false

	return (
		<div style={{
			display: 'flex',
			flexDirection:  icon_position === 'top' ? 'column' : 'row',
			justifyContent: 'center',
			alignItems: 'center'
		}}>
			{['left','top'].includes(icon_position) && props.children}
			<span style={{
				margin: 
					(hasIcon && icon_position === 'left') ? '0 0 0 5px'
					: (hasIcon && icon_position === 'right') ? '0 5px 0 0'
					: hasIcon ? '5px 0 0 0' : '' 
			}}>{item.name || 'Button Label'}</span>
			{icon_position === 'right' && props.children}
		</div>
	)
}

export default Button