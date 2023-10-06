const DEFAULT_MAX_MERGE_DEPTH = 5;
export const MERGE_MODE = {
	DEFAULT: 1,
	NO_EMPTY: 2,
};
// use mode NO_EMPTY to keep default value, if value in b is empty
export const mergeObj = (
	a,
	b,
	{
		mode = MERGE_MODE.DEFAULT,
		depth = 0,
		maxDepth = DEFAULT_MAX_MERGE_DEPTH,
	} = {},
) => {
	if (depth > maxDepth) {
		console.warn('Obj merge exceeds maximum depth');
		return null;
	}
	if (!(a instanceof Object && b instanceof Object)) {
		return b;
	}
	if (b instanceof Array) {
		return b;
	}
	const newObj = { ...a, ...b };
	Object.entries(b).forEach(([key, val]) => {
		if (val instanceof Object && a[key] instanceof Object) {
			newObj[key] = mergeObj(a[key], b[key], {
				mode,
				depth: depth + 1,
				maxDepth,
			});
		}
		if (mode === MERGE_MODE.NO_EMPTY && !val) {
			newObj[key] = a[key];
		}
	});
	return newObj;
};
