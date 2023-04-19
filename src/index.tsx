import { createRoot } from 'react-dom/client';
import { setAutoFreeze } from 'immer';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Providers from 'Providers';

// unfreeze the default behavior of Immer for redux store
setAutoFreeze(false);

// ensure cross-browser consistency
import 'normalize.css';
import 'antd/dist/antd.css';
import './index.scss';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <Providers>
    <App />
  </Providers>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
