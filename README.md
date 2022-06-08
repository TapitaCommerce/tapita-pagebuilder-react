# tapita-pagebuilder-react

> Tapita React PageBuilder Client

[![NPM](https://img.shields.io/npm/v/tapita-pagebuilder-react.svg)](https://www.npmjs.com/package/tapita-pagebuilder-react) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save tapita-pagebuilder-react
```

## Usage

```jsx
import React, { Component } from 'react'

import { PageBuilderComponent } from 'tapita-pagebuilder-react'

class Example extends Component {
  render() {
    return <PageBuilderComponent endPoint={endPoint} maskedId={maskedId} />
  }
}
```

## Develop

```bash
git clone https://github.com/TapitaCommerce/tapita-pagebuilder-react
cd tapita-pagebuilder-react
yarn install && cd example && yarn install && cd ..
yarn start
```

Then go to example directory, run another `yarn start` command.

## Props

- __endPoint__ - String
- __maskedId__ - String
- __toPreview__ - Boolean
- __ProductList__ - ReactComponent - _which would receive item data as props_
- __ProductGrid__ - ReactComponent - _which would receive item data as props_
- __ProductScroll__ - ReactComponent - _which would receive item data as props_
- __CategoryScroll__ - ReactComponent - _which would receive item data as props_
- __Link__ - ReactComponent - _For internal linking_
- __history__ - Object - _For history push inside pagebuilder component_
- __formatMessage__ - Function - _For Localization Purpose_
- __lazyloadPlaceHolder__ - ReactComponent - _Place holder for lazyload Image, if false/ no lazyload applied_
- __overRender__ - Function - _Function to override render function for each Item_
- __layoutFilter__ - Int - _Add filter to render the item: UNKNOWN: -1, PAGE\_COMPONENT: 0, TOP: 1, BOTTOM: 2_
- __filterRootChildrenOnly__ - _Boolean - Only apply layoutFilter to highest level elements_

## usePbFinder

usePbFinder is a hook to help you find your page from the pages you created on Pagebuilder dashboard.

```
// storeCode is optional
const pbFinderProps = usePbFinder({
    endPoint,
    integrationToken,
    storeCode
});
const {
    loading,
    pageMaskedId,
    findPage,
    pathToFind,
    pageData,
    allPages
} = pbFinderProps;

with findPage(pathname) and use pageData and pageMaskedId to find your page with path_name

and findPage() to getData and check `allPages` to get page with your own condition.

```


## License

MIT © [Tapita](https://github.com/TapitaCommerce)
