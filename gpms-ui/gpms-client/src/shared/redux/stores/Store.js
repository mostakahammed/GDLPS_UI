import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import combineReducers from '../reducers/ReducersCombiner';


export const store=createStore(
    combineReducers, //<= combine reducer  
    //composeWithDevTools(applyMiddleware(logger,thunk))
    //composeWithDevTools(applyMiddleware(thunk))
    applyMiddleware(thunk)
)