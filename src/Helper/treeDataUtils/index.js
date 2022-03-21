export const TreeDataProductDetailMarkerEnum = Object.freeze({
	UNKNOWN: -1,
	PAGE_COMPONENT: 0,
	TOP: 1,
	BOTTOM: 2,
});

export class TreeDataProductDetailUtils {
	constructor(treeDataBase) {
		this.treeFormat = treeDataBase[0];
		this.sortOrder = treeDataBase[1];
		this.listFormat = treeDataBase[2];
	}

	static getDataMarkerPropertyName() {
		return 'layoutMarker';
	}

	static isPageComponent(item) {
		return !!item && !!item.dataParsed && !!item.dataParsed.isPageComponent;
	}

	static isRootChildren(item) {
		return item.parent_id === 0;
	}

	static getCurrentMarker(item) {
		return item.dataParsed
			? item.dataParsed[this.getDataMarkerPropertyName()]
			: TreeDataProductDetailMarkerEnum.UNKNOWN;
	}

	getRootChildren() {
		return this.treeFormat.children || [];
	}

	getSortedChildren() {
		return [...this.getRootChildren()].sort((a, b) => {
			return this.sortOrder[a.entity_id] - this.sortOrder[b.entity_id];
		});
	}

	isComponentTop(item) {
		if (this.constructor.isPageComponent(item)) {
			return false;
		}
		const targetId = item.entity_id;
		const targetSortOrder =
			targetId !== undefined && this.sortOrder[targetId] !== undefined
				? this.sortOrder[targetId]
				: item.sort_order;

		const sortedRootChildren = this.getSortedChildren();
		const targetNextIndexInSortedList = sortedRootChildren.findIndex(
			(p) => this.sortOrder[p.entity_id] > targetSortOrder,
		);
		if (targetNextIndexInSortedList === -1) {
			// no suitable target even in list sorted by sortOrder => bottom components
			return false;
		}

		for (
			let i = targetNextIndexInSortedList;
			i < sortedRootChildren.length;
			i++
		) {
			if (this.constructor.isPageComponent(sortedRootChildren[i])) {
				return true;
			}
		}
		return false;
	}

	getComponentMarker(item) {
		if (this.constructor.isPageComponent(item)) {
			return TreeDataProductDetailMarkerEnum.PAGE_COMPONENT;
		} else if (this.isComponentTop(item)) {
			return TreeDataProductDetailMarkerEnum.TOP;
		} else {
			return TreeDataProductDetailMarkerEnum.BOTTOM;
		}
	}
}
