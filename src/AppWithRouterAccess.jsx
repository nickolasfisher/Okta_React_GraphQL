import React from 'react';
import { Route, useHistory, } from 'react-router-dom';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';

import ExchangeRates from './Pages/ExchangeRate'
import Home from './Pages/Home'
import Login from './Pages/Login'

const AppWithRouterAccess = () => {
    const history = useHistory();
    const onAuthRequired = () => {
        history.push('/login');
    };

    const baseDomain = process.env.REACT_APP_OKTA_URL_BASE;
    const issuer = baseDomain + '/oauth2/default'
    const clientId = process.env.REACT_APP_OKTA_CLIENTID;
    const redirect = process.env.REACT_APP_OKTA_APP_BASE_URL + '/implicit/callback';

    const loggedIn = true;

    return (
        <Security issuer={issuer}
            clientId={clientId}
            redirectUri={redirect}
            onAuthRequired={onAuthRequired}
            pkce={true} >
            <Route path='/' exact={true} component={Home} >
            </Route>
            <SecureRoute path='/ExchangeRates' component={ExchangeRates} />
            <Route path='/login' render={() => <Login baseUrl={baseDomain} issuer={issuer} />} />
            <Route path='/implicit/callback' component={LoginCallback} />
        </Security>
    );
};
export default AppWithRouterAccess;