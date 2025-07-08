import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  it('should render without crashing', () => {
    render(<App />);

    // The app should render the main container
    const appContainer = document.querySelector('.min-h-screen');
    expect(appContainer).toBeTruthy();
  });

  it('should have the correct base styling', () => {
    render(<App />);

    // Check if the main container has the correct background class
    const mainContainer = document.querySelector('.min-h-screen.bg-gray-50');
    expect(mainContainer).toBeTruthy();
  });
});
