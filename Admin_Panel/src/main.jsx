import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './output.css'

import { store,persistor } from '../Redux/Store.jsx';
import {Provider} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
ReactDOM.createRoot(document.getElementById('root')).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
    <React.StrictMode>
    <App />
  </React.StrictMode>,
    </Provider>
  </PersistGate>

)
