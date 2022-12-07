import {DOMElement} from "react";

export enum TreeDataProductDetailMarkerEnum {
	PAGE_COMPONENT = 0,
	TOP = 1,
	BOTTOM = 2,
}

export interface PbFinderProps {
	endPoint?: string;
	integrationToken?: string;
	storeCode?: string;
}

export type PageMaskIdType = string;
export type PageMaskIdUndeterminedType = 'notfound' | PageMaskIdType;
type PbScopeLV1 = 'page' | 'catalog';
type PbScopeLV2 = 'home' | 'n_page' | 'product' | 'collection' | 'blog';
export type PageBuilderMode = 'default' | 'shopify' | 'magento';
export type PageBuilderPlacement = 'default' | 'section' | 'half-screen';
export type PbScope = PbScopeLV1 | PbScopeLV2;

export interface FindPageAdditionalParameters {
	hint?: string;
	scope?: PbScope;
}

export type FindPage = (
	pathName: string,
	minimized?: boolean,
	args?: FindPageAdditionalParameters,
) => void;

type PageTypeId = number;
type NumberBinary = 0 | 1;
type PageStatus = NumberBinary;
type PageRTL = NumberBinary;
type MaybeEmptyString = string | null;

type SpbPage = {
	url_path: string;
	original_url_path: string;
	type_id: PageTypeId;
	priority: number;
	entity_id: number;
	name: MaybeEmptyString;
	status: PageStatus;
	masked_id: string;
	custom_css: MaybeEmptyString;
	custom_js: MaybeEmptyString;
	keywords: MaybeEmptyString;
	title: MaybeEmptyString;
	desc: MaybeEmptyString;
	is_rtl: PageRTL;
	storeview_visibility: string;
	publish_items: MaybeEmptyString;
	updated_at: string;
};

type CatalogPage = SpbPage & { apply_to: string };

type PbEndpointData = {
	data: {
		spb_page?: {
			items: SpbPage[] | null;
			total_count: number;
		};
		catalog_builder_page?: {
			items: CatalogPage[] | null;
			total_count: number;
		};
	};
};

export interface PbFinderOutput {
	loading: boolean;
	pageMaskedId: PageMaskIdUndeterminedType;
	findPage: FindPage;
	pathToFind: string | false;
	pageData: SpbPage | undefined;
	allPages: PbEndpointData | false;
}

declare function CustomElement(...args: any): JSX.Element;

type TranslateProps = {
	val?: string;
	id?: string;
	defaultMessage?: string;
};

declare function TranslateText(props: TranslateProps): string;

export interface PBComponentProps {
	endPoint?: string;
	maskedId?: PageMaskIdUndeterminedType;
	pageData?: SpbPage | CatalogPage;
	toPreview?: boolean;
	ProductList?: typeof CustomElement;
	ProductGrid?: typeof CustomElement;
	Category?: typeof CustomElement;
	ProductScroll?: typeof CustomElement;
	CategoryScroll?: typeof CustomElement;
	Link?: typeof CustomElement;
	lazyloadPlaceHolder?: typeof CustomElement;
	formatMessage?: typeof TranslateText;
	history?: any;
	overRender?: any;
	layoutFilter?: TreeDataProductDetailMarkerEnum;
	filterRootChildrenOnly?: boolean;
	mode: PageBuilderMode;
	type: PageBuilderPlacement;
	_translateParagraph?: boolean;
	_translatePlaceholder?: boolean;
	_translateSEO?: boolean;
}

declare function usePbFinder(props: PbFinderProps): PbFinderOutput;

declare function PageBuilderComponent(props: PBComponentProps): JSX.Element;

// declare function renderForIdWithProps(
// 	elId: string,
// 	pbProps: PBComponentProps,
// 	rootFinder: { 'getElementById': (id)=>DOMElement<any, any>}
// ): void;

export { usePbFinder, PageBuilderComponent };
