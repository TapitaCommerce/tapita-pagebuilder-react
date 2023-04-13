import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import App from './AppWithRouter'
import {IntlProvider} from "react-intl";


const messagesInJP = {
	fish:'魚',
    Image: 'Gazō',
    'Your Text Go Here': 'Your Text Go Here',
    'Button Label': 'Button Label',
    'Heading': 'Heading'
}

ReactDOM.render(
	<IntlProvider messages={messagesInJP} locale="fr" defaultLocale="en">
        <div style={{backgroundColor: '#eaeaea'}}>
		    <App />
        </div>
	</IntlProvider>
	, document.getElementById('root'))
