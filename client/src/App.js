import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import { Redirect, Router } from 'react-router';
import browserHistory from './helpers/history'
import logo from './logo.svg';
// import Helmet from 'react-helmet';
import Header from './components/Header/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Team from './components/Team';
import AdminLogin from './components/Admin/AdminLogin';
import Owner from './components/Owner/Owner';
import AdminSearch from './components/Admin/AdminSearch';
import Service from './components/Service/Service';
import ServiceDetail from './components/Service/ServiceDetail';
<<<<<<< HEAD
import ServiceReservation from 'components/Service/ServiceReservation';
import Profile from './components/User/Proflle';
=======
// import ServiceReservation from 'components/Service/ServiceReservation';
import EditProfile from './components/User/EditProflle';
>>>>>>> 18b649a05405f5164e9cd72a20f39b5374473f11
import NotFound from './components/NotFound';
import * as JWT from 'jwt-decode';
import './theme.css';
import './App.css';

const GuestRoute = ()=>(
	<Switch>
	</Switch>
)

const CustomerRoute = ()=>(
	<Switch>
	</Switch>
)

const ServiceOwnerRoute = ()=>(
	<Switch>
	</Switch>
)

const AdminRoute = ()=>(
	<Switch>
	</Switch>
)

class Wrap extends React.Component {
	constructor (props) {
		super(props)
	}

	render() {
		return (
			<div className="App" style={{ fontFamily: 'Kanit' }}>
				{/* <Helmet title="Matchsage"/> */}
				<Header />
				{this.props.children}
				{/* <Footer/> */}
			</div>
		);
	}
}

class App extends React.Component {
	constructor(props) {
		super(props)
	}

	render(){
		const user = localStorage.getItem('user');
		const admin = localStorage.getItem('admin');
		return (
			<Router history={browserHistory}>
				<Wrap>
					<Switch>
					<Route exact path="/"
						component={user ? () => {
							const user_type = JWT(localStorage.getItem('user')).user_type;
							console.log(user_type)
<<<<<<< HEAD
							if(user_type == 'owner')
								return <Redirect to="/owner"/>
							else 
								return <Redirect to="/service/search"/>
						} : Home }
				/>
				<Route exact path="/owner" render={() => {
					if(!user) {
						return (<Redirect to="/" />)
					} else {
						return <Owner />
					}
				}}/>
				<Route exact path='/admin/login' render={() => {
					if (localStorage.admin) {
						return (<Redirect to='/admin/users/search' />)
					} else {
						return (<AdminLogin />)
					}
				}} />
				<Route exact path="/admin/users/search" render={() => {
					if (!localStorage.admin) {
						return (<Redirect to='/admin/login'/>)
					} else {
						return (<AdminSearch />)
					}
				}}/>
				<Route exact path="/team" component={Team}/>
				
				<Route exact path="/service/search/:filter?" component={user?Service:()=>{return <Redirect to="/"/>}}/>
				<Route exact path="/service/:id" component={user?ServiceDetail:()=>{return <Redirect to='/'/>}}/>
				<Route exact path="/Profile" component={user?Profile:()=>{return <Redirect to="/"/>}}/>
				{/* <Route exact path="/service/:id/reserve" component={user?ServiceReservation:()=>(<Redirect to='/'/>)}/> */}
				
				{/* <Route path="/posts/:id" component={}/> */}
				<Route component={NotFound}/>
				
			</Switch>
		</Router>
	);
}
=======
							if (user_type == 'owner')
								return <Redirect to="/owner" />
							else
								return <Redirect to="/service/search" />
						} : Home}
					/>
					<Route exact path="/owner" render={() => {
						if (!user) {
							return (<Redirect to="/" />)
						} else {
							return <Owner />
						}
					}} />
					<Route exact path='/admin/login' render={() => {
						if (localStorage.admin) {
							return (<Redirect to='/admin/users/search' />)
						} else {
							return (<AdminLogin />)
						}
					}} />
					<Route exact path="/admin/users/search" render={() => {
						if (!localStorage.admin) {
							return (<Redirect to='/admin/login' />)
						} else {
							return (<AdminSearch />)
						}
					}} />
					<Route exact path="/team" component={Team} />

					<Route exact path="/service/search/:filter?" component={user ? Service : () => { return <Redirect to="/" /> }} />
					<Route exact path="/service/:id" component={user ? ServiceDetail : () => { return <Redirect to='/' /> }} />
					<Route exact path="/userProfile" component={user ? EditProfile : () => { return <Redirect to="/" /> }} />
					{/* <Route exact path="/service/:id/reserve" component={user?ServiceReservation:()=>(<Redirect to='/'/>)}/> */}
>>>>>>> 18b649a05405f5164e9cd72a20f39b5374473f11

					{/* <Route path="/posts/:id" component={}/> */}
					<Route component={NotFound} />

				</Switch>
				</Wrap>
			</Router>
		)
	}
}

function mapStateToProps(state){
	return state;
}

export default connect(mapStateToProps)(App);