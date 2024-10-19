import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { CartProvider } from './context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import './index.css';

const stripePromise = loadStripe('pk_test_51QBHWEFCS409SMMCkDLKoCUw5v9awtoXxadNazsXZYg7wk2aArkkhRzbIWRirYBLM1EbM8QSEniYWn5M1XsCNiE700bUHCoBeO');

ReactDOM.render(
  <React.StrictMode>
    <CartProvider>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </CartProvider>,
  </React.StrictMode>,
  document.getElementById('root')
);
