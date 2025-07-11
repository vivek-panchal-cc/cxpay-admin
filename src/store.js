// import { createStore, applyMiddleware, compose  } from 'redux'
// import thunkMiddleware from 'redux-thunk';
// import { createLogger } from 'redux-logger';
// import rootReducer from './reducers';

// const loggerMiddleware = createLogger();
// const composeEnhancers =
//   typeof window === 'object' &&
//   window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
//       // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
//     }) : compose;


// const store = createStore(rootReducer,composeEnhancers(
//   applyMiddleware(
//       thunkMiddleware,
//       loggerMiddleware
//   )))
// export default store

import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';

const middlewares = [thunkMiddleware];

// Only include redux-logger in development
if (process.env.NODE_ENV === 'development') {
  const { createLogger } = require('redux-logger');
  const loggerMiddleware = createLogger();
  middlewares.push(loggerMiddleware);
}

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middlewares))
);

export default store;
