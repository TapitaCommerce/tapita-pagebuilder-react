# simi-pagebuilder-react

> SimiCart React PageBuilder Client

[![NPM](https://img.shields.io/npm/v/simi-pagebuilder-react.svg)](https://www.npmjs.com/package/simi-pagebuilder-react) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save simi-pagebuilder-react
```

## Usage

```jsx
import React, { Component } from 'react'

import { PageBuilderComponent } from 'simi-pagebuilder-react'
import 'simi-pagebuilder-react/dist/index.css'

class Example extends Component {
  render() {
    return <PageBuilderComponent endPoint={endPoint} maskedId={maskedId} />
  }
}
```

## Develop

```bash
git clone https://github.com/Simicart/simi-pagebuilder-react
cd simi-pagebuilder-react
yarn start
```

Then go to example directory, run another yarn start command

## License

MIT © [SimiCart](https://github.com/SimiCart)
