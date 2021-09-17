import React from 'react'
import { PageBuilderComponent } from 'simi-pagebuilder-react'
import { useIntl } from "react-intl";

const get = (name) => {
    let exist = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(window.location.search);
    if (exist)
        return decodeURIComponent(exist[1]);
}

const App = () => {
    let endPoint = get('endPoint');
    let maskedId = get('maskedId');

    const {formatMessage} = useIntl()
    if (endPoint && maskedId) {
        return <PageBuilderComponent endPoint={endPoint} maskedId={maskedId} toPreview={false} formatMessage={formatMessage}/>
    }
    return (
        <form onSubmit={e => {
            e.preventDefault();
            endPoint = document.getElementById('endPoint_input').value;
            maskedId = document.getElementById('maskedId_input').value;
            window.location.href = `/?endPoint=${endPoint}&maskedId=${maskedId}`;
        }}>
            <label>
                End Point: <input type="text" name="endPoint" id="endPoint_input" defaultValue="https://tapita.io/pb/graphql" />
            </label>
            <br/>
            <label>
                Masked Id: <input type="text" name="maskedId" id="maskedId_input" defaultValue="48mLip5LwVQpjX9ZJaIDan1631181384" />
            </label>
            <br/>
            <input type="submit" value="Go!" />
        </form>
    )
}

export default App
