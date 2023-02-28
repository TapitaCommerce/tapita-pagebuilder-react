import React, { useEffect, useRef } from 'react';
import { isAbsolutePath } from '../Helper/isAbsolutePath.js';
import Innercontent from './Innercontent';
import Button from './Button';
import { randomString, listToTree } from '../Helper/Data';
import { useDeviceWidthPrefix } from '../hooks/useDeviceWidthPrefix';
import LazyLoad from 'react-lazyload';
import { TreeDataProductDetailUtils } from '../Helper/treeDataUtils';
import { Splide, SplideSlide } from '@splidejs/react-splide';

export const buttonTypeFieldName = 'button-type';

export const formSubmitMethod = 'form-submit-method';
export const formSubmitTarget = 'form-submit-url';
export const formSubmitOnSubmit = 'form-submit-onSubmit';

const PbContent = (props) => {
    const {
        data: { spb_item, spb_page },
        ProductList,
        ProductGrid,
        Category,
        formatMessage,
        ProductScroll,
        CategoryScroll,
        history,
        Link,
        lazyloadPlaceHolder,
        overRender,
        layoutFilter,
        filterRootChildrenOnly,
        translateParagraph,
        translatePlaceholder,
        mode,
    } = props;

    const selfRef = useRef(null);
    const deviceFilterKey = useDeviceWidthPrefix();
    const pageData =
        spb_page && spb_page.items && spb_page.items[0] ? spb_page.items[0] : false;
    const isRtl = pageData && pageData.is_rtl;

    const renderItem = (item, children, parent) => {
        if (layoutFilter !== null) {
            if (filterRootChildrenOnly) {
                if (
                    TreeDataProductDetailUtils.isRootChildren(item) &&
                    !item.root &&
                    TreeDataProductDetailUtils.getCurrentMarker(item) !== layoutFilter
                ) {
                    return null;
                }
            } else if (
                !item.root &&
                TreeDataProductDetailUtils.getCurrentMarker(item) !== layoutFilter
            ) {
                return null;
            }
        }
        if (item.dataParsed) {
            if (deviceFilterKey === 'm_' && item.dataParsed.hideOnMobile) return '';
            else if (deviceFilterKey === 't_' && item.dataParsed.hideOnTablet)
                return '';
            else if (deviceFilterKey === 'l_' && item.dataParsed.hideOnDesktop)
                return '';
        }
        const itemType = item.type;
        const styles = prepareStyle(item, parent);
        const devicelessData = prepareData(item);
        item.stylesParsed = JSON.parse(JSON.stringify(styles));
        item.dataParsed = devicelessData;
        let aHref;
        if (
            item.dataParsed &&
            (item.dataParsed.openUrl ||
                item.dataParsed.sendEmail ||
                item.dataParsed.callNumber)
        ) {
            aHref = item.dataParsed.openUrl;
            if (item.dataParsed.sendEmail)
                aHref = 'mailto: ' + item.dataParsed.sendEmail;
            else if (item.dataParsed.callNumber)
                aHref = 'tel:' + item.dataParsed.callNumber;
            else if (mode === 'shopify' && window.Shopify && !isAbsolutePath(aHref)) {
                const locale = window.Shopify.locale;
                const root =
                    (window.Shopify.routes ? window.Shopify.routes.root : '/') || '/';
                if (root !== '/') {
                    aHref =
                        root +
                        (item.dataParsed.openUrl.charAt(0) === '/'
                            ? item.dataParsed.openUrl.slice(1)
                            : item.dataParsed.openUrl);
                }
            }
        }

        if (itemType === 'dropdown') {
            /**
             * Dropdown padding is for dropdown title
             * default padding for dropdown container is zero
             */
            styles.padding = 0;
            styles.paddingTop = 0;
            styles.paddingBottom = 0;
            styles.paddingLeft = 0;
            styles.paddingRight = 0;
        } else if (itemType === 'text_input' || itemType === 'textarea_input') {
            styles.padding = 0;
            styles.overflow = 'hidden';
        }

        if (item.type === 'partial_slider') {
            styles.flexDirection = 'row';
            styles.flexWrap = 'nowrap';
        }

        if (item && ['html_video', 'youtube_video'].includes(item.type)) {
            const _size = (item.dataParsed ? item.dataParsed.size : null) || null;
            const _width = (item.dataParsed ? item.dataParsed.width : null) || null;
            const height = 'auto';
            const width = _size || _width || '100%';
            styles.width = width;
            styles.height = height;
            // styles.display = 'block';
        }

        if (item.type === 'tabs') {
            styles.display = 'flex';
            styles.direction = 'ltr';
            if (item.dataParsed) {
                switch (item.dataParsed.tabTitleNavPos) {
                    case 'left':
                        styles.flexFlow = 'row';
                        break;
                    case 'right':
                        styles.flexFlow = 'row-reverse';
                        break;
                    case 'bottom':
                        styles.flexFlow = 'column-reverse';
                        break;
                    default:
                        styles.flexFlow = 'column';
                        break;
                }
            }
        }

        if (item.type === 'category_scroll_1') {
            styles.backgroundImage = 'none';
        }
        if (
            ['text', 'paragraph', 'html_video', 'youtube_video', 'icon'].includes(
                item.type,
            )
        ) {
            styles.boxShadow = 'none';
        }

        const noShadow = !styles.boxShadow || styles.boxShadow === 'none';
        if (!noShadow) {
            styles.overflow = 'visible';
        }

        const itemProps = {
            id: item && item.entity_id ? `pbitm-id-${item.entity_id}` : null,
            key: `${randomString(5)}${item.root ? 'root' : item.entity_id}`,
            style: styles,
            className: `spb-item ${item.root ? 'spb-item-root' : ''} ${item.class_name || ''
                } ${'type_' + (item.type || '')} ${item.entity_id ? 'spb-item-id_' + item.entity_id : ''
                } ${!noShadow ? 'spb-shadowed' : ''}`,
        };

        if (item.dataParsed && item.dataParsed.scrollTo) {
            styles.cursor = 'pointer';
            itemProps.onClick = () => {
                const elmnt = document.getElementsByClassName(item.dataParsed.scrollTo);
                if (elmnt && elmnt.length) elmnt[0].scrollIntoView();
            };
        }
        if (aHref && item.type !== 'text') {
            const openUrlInNewTab = parseInt(item.dataParsed.openUrlInNewTab) === 1;
            itemProps.onClick = () => {
                if (
                    history &&
                    !openUrlInNewTab &&
                    item.dataParsed.openUrl.indexOf('http') === -1
                )
                    history.push(aHref);
                else {
                    if (typeof window !== 'undefined') {
                        window.open(aHref, openUrlInNewTab ? '_blank' : '_self');
                    }
                }
            };
        }

        const innerContent = renderInnerContent(item, children, parent);

        if (overRender) {
            const overRendered = overRender(item, itemProps, innerContent);
            if (overRendered) return overRendered;
        }
        if (item.type === 'form_group') {
            const formMethod = item.dataParsed[formSubmitMethod] || 'GET';
            const formURL = item.dataParsed[formSubmitTarget] || '';
            return (
                <form
                    key={itemProps.key}
                    className='form-builder-artifact'
                    action={formURL}
                    onSubmit={() => {
                        try {
                            eval(item.dataParsed[formSubmitOnSubmit]);
                        } catch (err) { }
                    }}
                    method={formMethod}
                >
                    <div {...itemProps}>{innerContent}</div>
                </form>
            );
        }
        if (aHref) {
            if (
                item.type === 'text' ||
                item.type === 'button' ||
                item.type === 'container' ||
                item.type === 'form_button' ||
                item.type === 'image'
            ) {
                const openUrlInNewTab = parseInt(item.dataParsed.openUrlInNewTab) === 1;
                if (!itemProps.style.textDecoration)
                    itemProps.style.textDecoration = 'none';
                if (!itemProps.style.color) itemProps.style.color = 'initial';
                delete itemProps.onClick;
                if (item.dataParsed && item.dataParsed.nofollow)
                    itemProps.rel = 'nofollow';
                if (
                    Link &&
                    item.dataParsed.openUrl &&
                    item.dataParsed.openUrl.indexOf('http') === -1
                ) {
                    return (
                        <Link
                            to={aHref}
                            target={openUrlInNewTab ? '_blank' : '_self'}
                            {...itemProps}
                        >
                            {innerContent}
                        </Link>
                    );
                }
                return (
                    <a
                        href={aHref}
                        target={openUrlInNewTab ? '_blank' : '_self'}
                        {...itemProps}
                    >
                        {innerContent}
                    </a>
                );
            }
        }
        if (item.type === 'button' || item.type === 'form_button') {
            const buttonType = item.dataParsed
                ? item.dataParsed[buttonTypeFieldName]
                : 'button';
            return (
                <button type={buttonType} {...itemProps}>
                    {innerContent}
                </button>
            );
        } else if (
            item.type === 'image' &&
            lazyloadPlaceHolder &&
            item.dataParsed &&
            !item.dataParsed.openUrl &&
            !item.dataParsed.scrollTo
        ) {
            return (
                <LazyLoad {...itemProps} placeholder={lazyloadPlaceHolder} offset={532}>
                    {innerContent}
                </LazyLoad>
            );
        } else if (item.type === 'hidden_input') {
            if (!item.dataParsed) return '';
            return (
                <input
                    key={item.entity_id}
                    type='hidden'
                    name={item.dataParsed.name}
                    id={item.dataParsed.input_id}
                    value={item.dataParsed.default_value}
                />
            );
        }

        return <div {...itemProps}>{innerContent}</div>;
    };

    const renderInnerContent = (item, children, parent) => {
        const dataParsed = item.dataParsed ? item.dataParsed : {};
        if (item.type === 'slider') {
            console.log('isRtl', isRtl)
            console.log('isRtl', dataParsed)
            const slideSettings = {
                type: parseInt(dataParsed.sliderInfiniteLoop) !== 0 ? 'loop' : 'slide',
                autoplay: parseInt(dataParsed.sliderAutoSlide) === 1,
                arrows: parseInt(dataParsed.showSliderNavBtn) !== 0,
                lazyLoad: lazyloadPlaceHolder ? 'nearby' : false,
                pagination:
                    parseInt(dataParsed.showSliderIndicator) === 0
                        ? false
                        : !!(children.length && children.length !== 1),
                paginationDirection: 'ltr',
                speed: parseInt(dataParsed.sliderTransitionTime)
                    ? dataParsed.sliderTransitionTime
                    : 350,
                interval: parseInt(dataParsed.sliderInterval)
                    ? dataParsed.sliderInterval
                    : 3000,
            };
            if (isRtl) {
                slideSettings.direction = 'rtl';
                slideSettings.paginationDirection = 'rtl';
            }
            let cChild = children.filter((itm) => itm !== '');
            cChild = isRtl ? cChild.reverse() : cChild;
            console.log(slideSettings)
            slideSettings.pagination = true;
            return (
                <Splide options={slideSettings}>
                    {cChild.map((cChil) => (
                        <SplideSlide>{cChil}</SplideSlide>
                    ))}
                </Splide>
            );
        }
        if (item.type === 'partial_slider') {
            const showArrow = parseInt(dataParsed.showSliderNavBtn) !== 0;
            const showIndicators =
                parseInt(dataParsed.showSliderIndicator) === 0
                    ? false
                    : !!(children.length && children.length !== 1);
            const perPage = parseInt(dataParsed.partialPerPage) || 3
            const perMove = parseInt(dataParsed.partialPerMove) || 1

            const partialSSettings = {
                type: 'slide',
                pagination: showIndicators,
                arrows: showArrow,
                perPage,
                perMove
            };
            if (isRtl) {
                slideSettings.direction = 'rtl';
                slideSettings.paginationDirection = 'rtl';
            }
            let cChild = children.filter((itm) => itm !== '');
            cChild = isRtl ? cChild.reverse() : cChild;
            return (
                <Splide options={partialSSettings}>
                    {cChild.map((cChil) => (
                        <SplideSlide>{cChil}</SplideSlide>
                    ))}
                </Splide>
            );
        }

        if (item.type === 'button' || item.type === 'form_button') {
            return (
                <Button item={item} formatMessage={formatMessage}>
                    {children.length ? children : ''}
                </Button>
            );
        }

        return (
            <React.Fragment>
                <Innercontent
                    item={item}
                    parent={parent}
                    formatMessage={formatMessage}
                    ProductList={ProductList}
                    ProductGrid={ProductGrid}
                    Category={Category}
                    ProductScroll={ProductScroll}
                    CategoryScroll={CategoryScroll}
                    deviceFilterKey={deviceFilterKey}
                    translateParagraph={translateParagraph}
                    translatePlaceholder={translatePlaceholder}
                />
                {children.length ? children : ''}
            </React.Fragment>
        );
    };

    const prepareStyle = (item, parent) => {
        const defaultStyles = {
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            direction: isRtl ? 'rtl' : 'ltr',
        };
        let style = defaultStyles;
        if (item && item.stylesParsed) {
            try {
                const _itemStyle = JSON.parse(
                    JSON.stringify(item.stylesParsed) || '{}',
                );
                const itemStyle = { ..._itemStyle };

                // add device styles
                Object.keys(itemStyle).forEach((key) => {
                    if (key.includes(deviceFilterKey)) {
                        const styleKey = key.replace(deviceFilterKey, '');
                        itemStyle[styleKey] = itemStyle[key];
                    }
                });

                if (itemStyle.widthPercent) {
                    itemStyle.width = parseInt(itemStyle.widthPercent, 10) + '%';
                    delete itemStyle.widthPercent;
                }
                if (itemStyle.widthPixel) {
                    itemStyle.width = parseInt(itemStyle.widthPixel, 10) + 'px';
                    delete itemStyle.widthPixel;
                }
                if (itemStyle.heightPixel) {
                    if (itemStyle.heightPixel === 'auto')
                        itemStyle.height = itemStyle.heightPixel;
                    else itemStyle.height = parseInt(itemStyle.heightPixel, 10) + 'px';
                    delete itemStyle.heightPixel;
                }
                style = { ...style, ...itemStyle };
            } catch (err) {
                console.warn(err);
            }
        }
        if (parent && parent.type === 'slider') {
            const parentSliderHeight =
                parent.stylesParsed &&
                (parent.stylesParsed[deviceFilterKey + 'heightPixel'] ||
                    parent.stylesParsed.heightPixel);
            if (parentSliderHeight) {
                style.height = parseInt(parentSliderHeight) + 'px';
                // style.overflowY = 'hidden';
            }
        } else if (parent && parent.type === 'partial_slider' && style.width === '30%') {
            style.width = 'unset';
        }
        if (
            item &&
            item.type !== 'image' &&
            item.type !== 'category' &&
            item.type !== 'custom_html'
        ) {
            if (item.dataParsed) {
                const itemData = item.dataParsed;
                if (itemData && itemData.image) {
                    style.backgroundImage = `url("${itemData.image}")`;
                }
            }
        }
        if (item && item.type === 'slider') {
            style.direction = 'ltr';
        }

        return style;
    };

    const prepareData = (item) => {
        let data = {};
        if (item.data && typeof item.data === 'object') {
            data = { ...item.data };
        } else if (item.dataParsed) {
            data = { ...item.dataParsed };
        }
        Object.keys(data).forEach((key) => {
            if (key.includes(deviceFilterKey)) {
                const styleKey = key.replace(deviceFilterKey, '');
                data[styleKey] = data[key];
            }
        });
        return data;
    };
    /*
    Recursive render
    */

    const recursiveRender = (childrenArray, parent) => {
        const returnedItems = [];
        if (childrenArray) {
            childrenArray.map((item) => {
                const children = recursiveRender(item.children, item);
                returnedItems.push(renderItem(item, children, parent));
                return null;
            });
        }
        return returnedItems;
    };

    const renderItems = (itemTree) => {
        const children = recursiveRender(itemTree.children);
        return renderItem({ root: true }, children);
    };

    const rootItem = {
        id: 'root',
    };
    let newTree;
    if (spb_item) {
        newTree = JSON.parse(JSON.stringify(spb_item.items));
    } else {
        newTree = JSON.parse(spb_page.items[0].publish_items);
    }
    newTree = listToTree(newTree);
    rootItem.children = newTree;

    useEffect(() => {
        if (
            selfRef.current &&
            globalThis.window &&
            globalThis.URL &&
            window.location
        ) {
            const url = new globalThis.URL(globalThis.window.location);
            const hash = url.hash;
            if (hash) {
                try {
                    const el = selfRef.current.querySelector(hash);
                    if (el) {
                        setImmediate(() => {
                            el.scrollIntoView();
                        });
                    }
                } catch (e) {
                    console.warn(e);
                }
            }
        }
    }, []);

    return (
        <div
            ref={selfRef}
            className='smpb-container'
            style={{ direction: isRtl ? 'rtl' : 'ltr' }}
        >
            {renderItems(rootItem)}
        </div>
    );
};

export default PbContent;
