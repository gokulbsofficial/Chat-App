import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { reducer } from './reducers'

const userTokenFromStorage = localStorage.getItem('userToken')
    ? JSON.parse(localStorage.getItem('userToken'))
    : null;

const initialState = {
    authInfo: { token: userTokenFromStorage }
}

const middleware = [thunk];
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store;