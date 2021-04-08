import React from 'react'
import { PageBuilderComponent } from 'simi-pagebuilder-react'
//import 'simi-pagebuilder-react/dist/index.css'

const get = (name) => {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(window.location.search))
        return decodeURIComponent(name[1]);
}

const App = () => {
    let endPoint = get('endPoint')
    let maskedId = get('maskedId')
    if (endPoint && maskedId) {
        return <PageBuilderComponent endPoint={endPoint} maskedId={maskedId} />
    }
    return (
        <form onSubmit={e => {
            e.preventDefault();
            endPoint = document.getElementById('endPoint_input').value;
            maskedId = document.getElementById('maskedId_input').value;
            window.location.href = `/?endPoint=${endPoint}&maskedId=${maskedId}`;
        }}>
            <label>
                End Point: <input type="text" name="endPoint" id="endPoint_input" placeholder="https://magento24.pwa-commerce.com/pb/graphql/"/>
            </label>
            <br/>
            <label>
                Masked Id: <input type="text" name="maskedId" id="maskedId_input" />
            </label>
            <br/>
            <input type="submit" value="Go!" />
        </form>
    )
}

export default App
