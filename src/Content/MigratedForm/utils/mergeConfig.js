import { MERGE_MODE, mergeObj } from './mergeObj';

export const mergeConfig = (
	defaultShopifyVar,
	allConfig,
	namespace = 'shopify',
) => {
	return mergeObj({ [namespace]: defaultShopifyVar }, allConfig || {}, {
		mode: MERGE_MODE.NO_EMPTY,
	})?.[namespace];
};
