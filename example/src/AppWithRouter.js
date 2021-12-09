import React, { useEffect } from 'react';
import { PageBuilderComponent, usePbFinder } from 'simi-pagebuilder-react';
import {
	Route,
	Switch,
	useLocation,
	BrowserRouter,
	Link,
	useHistory,
} from 'react-router-dom';

const endPoint = 'https://tapita.io/pb/graphql';
const integrationToken = '14FJiubdB8n3Byig2IkpfM6OiS6RTO801622446444';

const AppWithRouter = () => {
	const location = useLocation();
	const history = useHistory();
	const pbFinderProps = usePbFinder({
		endPoint,
		integrationToken,
	});
	const { loading: pbLoading, findPage, pathToFind } = pbFinderProps;
	let { pageMaskedId, pageData } = pbFinderProps;
	useEffect(() => {
		if (location && location.pathname) {
			if (!pageMaskedId || location.pathname !== pathToFind)
				findPage(location.pathname);
		}
	}, [location, pageMaskedId, pathToFind, findPage]);
	if (pageMaskedId && pageMaskedId !== 'notfound') {
		const pbcProps = {
			Link: Link,
			history: history,
			endPoint,
			lazyloadPlaceHolder: <div />,
		};
		return (
			<PageBuilderComponent
				{...pbcProps}
				key={pageMaskedId}
				maskedId={pageMaskedId}
				pageData={pageData && pageData.publish_items ? pageData : false}
			/>
		);
	}
	return <div>loading ...</div>;
};
const HOAppWithRouter = () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route render={(props) => <AppWithRouter {...props} />} />
			</Switch>
		</BrowserRouter>
	);
};
export default HOAppWithRouter;
