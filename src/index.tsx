import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { App } from './App';

ReactDOM.render(
  /* eslint-disable react/react-in-jsx-scope */
  <Router>
    <App />
  </Router>,
  /* eslint-enable react/react-in-jsx-scope */
  document.getElementById('root'),
);
