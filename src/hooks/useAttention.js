import { useEffect, useRef, useState } from 'react';

const hasIntersectionObserver = !!window.IntersectionObserver;

export const useAttention = (props) => {
	const { distance = '100px', requireAttention } = props || {};

	const options = {
		root: null,
		rootMargin: distance,
		threshold: 0.1,
	};

	const [hadAttention, setAttention] = useState(false);
	const targetRef = useRef(null);

	useEffect(() => {
		let intersectionObserver = null;
		if (
			targetRef.current &&
			hasIntersectionObserver &&
			!hadAttention &&
			requireAttention
		) {
			intersectionObserver = new IntersectionObserver((entries) => {
				if (entries.length > 0 && entries[0].intersectionRatio > 0) {
					setAttention(true);
					intersectionObserver.unobserve(targetRef.current);
					intersectionObserver = null;
				}
			}, options);
			intersectionObserver.observe(targetRef.current);
		}
		return () => {
			if (intersectionObserver) {
				intersectionObserver.unobserve(targetRef.current);
			}
		};
	}, [targetRef.current]);

	return {
		targetRef,
		hadAttention,
	};
};
