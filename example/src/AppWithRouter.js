import React, { useEffect } from 'react';
import { PageBuilderComponent, usePbFinder } from 'tapita-pagebuilder-react';
import {
	Route,
	Switch,
	useLocation,
	BrowserRouter,
	Link,
	useHistory,
} from 'react-router-dom';

const endPoint = 'https://tapita.io/pb/graphql';
const integrationToken = '3844V6rujCkeijQMq696HiHSiS1kIlhxq31658743735';

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
				findPage(location.pathname, true);
		}
	}, [location, pageMaskedId, pathToFind, findPage]);

	if (pageMaskedId && pageMaskedId !== 'notfound') {
		const pbcProps = {
			Link: Link,
			history: history,
			endPoint,
			lazyloadPlaceHolder: <div />,
			pageData
		};

		return (
			<PageBuilderComponent
				{...pbcProps}
				key={pageMaskedId}
				maskedId={pageMaskedId}
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
