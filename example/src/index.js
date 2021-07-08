import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {IntlProvider} from "react-intl";


const messagesInFrench = {
	fish:'sanaka',
}

ReactDOM.render(
	<IntlProvider messages={messagesInFrench} locale="fr" defaultLocale="en">
		<App />
	</IntlProvider>
	, document.getElementById('root'))
