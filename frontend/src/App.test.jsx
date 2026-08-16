import { render } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('renders without crashing', () => {
    // This is a simple smoke test
    render(<App />);
  });
});
