import React, {Component, cloneElement, ReactElement, StatelessComponent} from 'react';
import {Route, BrowserRouter, useParams, useLocation, useNavigate} from "react-router-dom";
import Loadable from 'react-loadable';
import {Header} from './Components/Header';
import {ListPage} from './Pages/ListPage';
import {AuthProvider, User} from './Providers/AuthProvider';
import {DemoProvider, DemoListProvider} from './Providers/DemoProvider';
import './App.css';
import {Routes} from 'react-router';

export function Loading(props) {
	if (props.error) {
		console.error(props.error);
		return <div>Error!</div>;
	} else if (props.pastDelay) {
		return <div>Loading...</div>;
	} else {
		return null;
	}
}

export interface AppState {
	user: User | null;
}

export class App extends Component<{}, AppState> {
	auth = AuthProvider.instance;
	demoProvider = DemoProvider.instance;
	demoListProvider = DemoListProvider.instance;

	state: AppState = {
		user: null
	};

	async componentDidMount() {
		const user = await this.auth.getUser();
		this.setState({user});
	}

	logoutHandler = async () => {
		await this.auth.logout();
		this.componentDidMount();
	};

	render() {
		return (
			<div id="pagecontainer">
				<div className={`page`}>
					<AppRouter demoListProvider={this.demoListProvider} user={this.state.user} auth={this.auth}
							   demoProvider={this.demoProvider}
							   logoutHandler={this.logoutHandler.bind(this)}/>
				</div>
			</div>
		);
	}
}

interface AppRouterProps {
	demoListProvider: DemoListProvider,
	demoProvider: DemoProvider,
	user: User | null,
	auth: AuthProvider,
	logoutHandler: () => Promise<void>
}

function AppRouter({demoListProvider, demoProvider, user, auth, logoutHandler}: AppRouterProps) {
	return (<BrowserRouter>
		<div>
			<Header user={user}
					auth={auth}
					logoutHandler={logoutHandler}/>
			<Routes>
				<Route path='/upload' element={<UploadPageRoute user={user}/>}/>
				<Route path='/profiles/:steamid'
					   element={<ListPageRoute demoListProvider={demoListProvider}/>}/>
				<Route path='/uploads/:steamid'
					   element={<ListPageRoute demoListProvider={demoListProvider}/>}/>
				<Route path='/about'
					   element={<React.Suspense fallback={<Loading/>}><LoadableAboutPage
						   demoListProvider={demoListProvider}
						   user={user}/></React.Suspense>}/>
				<Route path='/api'
					   element={<React.Suspense fallback={<Loading/>}><LoadableApiPage user={user}/></React.Suspense>}/>
				<Route path='/viewer/:id' element={<AnalysePageRoute user={user}/>}/>
				<Route path='/viewer' element={<AnalysePageRoute user={user}/>}/>
				<Route path='/edit' element={<EditPageRoute user={user}/>}/>
				<Route path='/:id'
					   element={<DemoPageRoute demoProvider={demoProvider}/>}/>
				<Route path='/' element={<ListPageRoute demoListProvider={demoListProvider}/>}/>
			</Routes>
		</div>
	</BrowserRouter>);
}

function ListPageRoute({demoListProvider}: { demoListProvider: DemoListProvider }) {
	const navigate = useNavigate();
	const match = useParams();
	const location = useLocation();
	return (
		<React.Suspense fallback={<Loading/>}>
			<ListPage demoListProvider={demoListProvider} navigate={navigate} location={location} match={match}/>
		</React.Suspense>)
}

function UploadPageRoute({user}: { user: User | null }) {
	const navigate = useNavigate();
	return (
		<React.Suspense fallback={<Loading/>}>
			<LoadableUploadPage user={user} navigate={navigate}/>
		</React.Suspense>)
}

function AnalysePageRoute({user}: { user: User | null }) {
	const match = useParams();
	return (
		<React.Suspense fallback={<Loading/>}>
			<LoadableAnalysePage match={match}/>
		</React.Suspense>)
}

function EditPageRoute({user}: { user: User | null }) {
	const match = useParams();
	return (
		<React.Suspense fallback={<Loading/>}>
			<LoadableEditPage match={match}/>
		</React.Suspense>)
}

function DemoPageRoute({demoProvider}: { demoProvider: DemoProvider }) {
	const match = useParams();
	const location = useLocation();
	return (
		<React.Suspense fallback={<Loading/>}>
			<LoadableDemoPage demoProvider={demoProvider} match={match} location={location}/>
		</React.Suspense>)
}

const getDemoComponent = () => import('./Pages/DemoPage');
const getApiComponent = () => import('./Pages/APIPage');
const getAboutComponent = () => import('./Pages/AboutPage');
const getUploadComponent = () => import('./Pages/UploadPage');
const getAnalyseComponent = () => import('./Pages/AnalysePage');
const getEditComponent = () => import('./Pages/EditPage');

const getLoadable = (loader) => {
	return (<React.Suspense fallback={<Loading/>}>
		{React.lazy(loader)}
	</React.Suspense>)
}
const LoadableDemoPage = React.lazy(getDemoComponent);
const LoadableApiPage = React.lazy(getApiComponent);
const LoadableAboutPage = React.lazy(getAboutComponent);
const LoadableUploadPage = React.lazy(getUploadComponent);
const LoadableAnalysePage = React.lazy(getAnalyseComponent);
const LoadableEditPage = React.lazy(getEditComponent);

