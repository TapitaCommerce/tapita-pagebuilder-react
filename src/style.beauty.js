/* eslint-disable */
export const styleStringBeauty = process.env.TARGET_ENV !== 'shopify'?`
    .spb-item {
        overflow: auto;
        transition: transform 0.3s ease;
        position: relative;
        flex-shrink: 0;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: top left;
        padding: 15px;
        box-sizing: border-box;
    }
    .spb-item.spb-shadowed {
        overflow: visible;
    }
    .type_slider .carousel-root {
        max-width: 100%;
    }
    .spb-item-root {
        align-items: center;
        padding: 0px;
    }
    .spb-item .type_slider {
        padding: 0;
    }
    .spb-item.type_paragraph {
        color: #000;
    }
    .spb-item.type_paragraph * {
        color: inherit;
    }
    .spb-item.type_paragraph div,
    .spb-item.type_paragraph span,
    .spb-item.type_paragraph u,
    .spb-item.type_paragraph ul,
    .spb-item.type_paragraph li,
    .spb-item.type_paragraph a,
    .spb-item.type_paragraph b,
    .spb-item.type_paragraph em,
    .spb-item.type_paragraph del,
    .spb-item.type_paragraph ins,
    .spb-item.type_paragraph base,
    .spb-item.type_paragraph td,
    .spb-item.type_paragraph tr,
    .spb-item.type_paragraph th,
    .spb-item.type_paragraph thead,
    .spb-item.type_paragraph p {
        color: inherit;
    }
    button.spb-item {
        cursor: pointer;
    }
    .spb-item.type_button {
        padding: 10px 20px;
        cursor: pointer;
        border: none;
        background-color: #ffffff;
    }
    .spb-item.type_button:hover {
        opacity: 0.8;
    }
    .spb-item.type_image {
        padding: 0;
    }
    .spb-item.type_dropdown.collapsed > .spb-item {
        display: none !important;
    }
    .spb-item.type_dropdown .smpb-dropdown-title {
        cursor: pointer;
        display: flex;
        padding: 15px;
        justify-content: space-between;
    }
    .spb-item.type_dropdown .smpb-dropdown-title svg,
    .spb-item.type_dropdown .smpb-dropdown-title img {
        width: 21px;
        height: 21px;
    }
    .spb-item > h1,
    .spb-item > h2,
    .spb-item > h3,
    .spb-item > h4,
    .spb-item > h5,
    .spb-item > h6 {
        margin-top: 0;
        margin-bottom: 0;
        font-weight: 500;
        line-height: 1.2;
    }
    .spb-item > h1 {
        font-size: 2.1875rem;
    }
    .spb-item > h2 {
        font-size: 1.75rem;
    }
    .spb-item > h3 {
        font-size: 1.53125rem;
    }
    .spb-item > h4 {
        font-size: 1.3125rem;
    }
    .spb-item > h5 {
        font-size: 1.09375rem;
    }
    .spb-item > h6 {
        font-size: 0.875rem;
    }
    .spb-item.type_instagram .simipb-insta-item {
        display: block;
    }
    .spb-item.type_instagram .simipb-insta-item img,
    .spb-item.type_instagram .simipb-insta-item video {
        max-width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .spb-item.type_tabs .spbitem-tab-nav {
        direction: ltr;
        padding: 0px 15px;
        display: flex;
        justify-content: center;
    }
    @media (max-width: 1023px) {
        .spb-item.type_tabs .spbitem-tab-nav {
            justify-content: start;
            overflow-x: auto;
        }
    }
    .spb-item.type_tabs > .spb-item {
        flex-shrink: initial;
    }
    .spb-item.type_tabs .spbitem-tab-nav .spbitem-tab-nav-item {
        cursor: pointer;
        margin-inline-end: 10px;
        padding: 10px 15px;
    }
    .spb-item.type_tabs .spbitem-tab-nav.horizontal .spbitem-tab-nav-item {
        white-space: nowrap;
    }
    .spb-item.type_tabs .spbitem-tab-nav .spbitem-tab-nav-item.active {
        background-color: #ffffff;
        font-weight: 600;
    }
    .spb-item.type_tabs .spbitem-tab-nav.vertical {
        display: inline-block;
        flex-shrink: inherit;
        padding: 0;
    }
    .spb-item.type_tabs .spbitem-tab-nav.vertical .spbitem-tab-nav-item {
        width: 100%;
        margin-bottom: 5px;
        box-sizing: border-box;
    }
    .spb-item .splide:not(.is-overflow) .splide__pagination {
        display: flex;
    }
    .spb-item .splide {
        max-width: 100%;
        height: 100%;
    }
    .spb-item.type_paragraph .fr-emoticon.fr-emoticon-img {
        min-width: 20px;
        min-height: 20px;
        display: inline-block;
        background-repeat: no-repeat !important;
    }
`:'';
