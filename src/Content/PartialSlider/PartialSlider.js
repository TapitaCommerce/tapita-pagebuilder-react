import React, { Component, useRef, useState } from 'react';
import Slider from 'react-slick';
import { FashionableDotPagination } from './FashionableDotPagination';

export const PartialSlider = (props) => {
	const { item } = props || {};
	const dataParsed = item.dataParsed || {};
	const sliderRefContainer = useRef(null);
	const [sliderIndex, setSliderIndex] = useState(0);

	const numberOfExpectedChild =
		dataParsed.numberOfChild !== undefined ? dataParsed.numberOfChild : 3;
	const currentNumberOfChild = item.children ? item.children.length : 0;

	if (numberOfExpectedChild > currentNumberOfChild) {
		// TODO: add
	} else if (numberOfExpectedChild < currentNumberOfChild) {
		// TODO: remove
	}

	const settings = {
		arrows: false,
		dots: false,
		infinite: false,
		speed: 500,
		// slidesToShow: currentNumberOfChild,
		slidesToShow: 2,
		slidesToScroll: 1,
		beforeChange: (current, next) => setSliderIndex(next),
	};
	const subRows = React.Children.toArray(props.children).filter((child, i) => {
		// return true
		return !child.props.className.includes('simi-buffer');
	});

	// Maybe disable this on pagebuilder?
	const changeIndex = (index) => {
		if (sliderRefContainer.current && index !== sliderIndex) {
			sliderRefContainer.current.slickGoTo(index);
		}
	};

	return (
		<React.Fragment>
			<div className='partial-slider-container'>
				<Slider ref={sliderRefContainer} {...settings}>
					{subRows}
				</Slider>
			</div>
			<FashionableDotPagination
				numberOfPages={currentNumberOfChild - 1}
				currentIndex={sliderIndex}
				onChangeIndex={changeIndex}
			/>
		</React.Fragment>
	);
};
