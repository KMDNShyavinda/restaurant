import { render } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

describe('App Component', () => {
  it('renders without crashing', () => {
    // This is a simple smoke test
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  });
});
