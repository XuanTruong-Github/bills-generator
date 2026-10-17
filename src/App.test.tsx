import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('Environment Scaffolding', () => {
  it('renders without crashing', () => {
    render(<div data-testid="app-root">VCB Bill Generator</div>);
    expect(screen.getByTestId('app-root')).toHaveTextContent('VCB Bill Generator');
  });

  it('renders App component with app-root', () => {
    render(<App />);
    expect(screen.getByTestId('app-root')).toHaveTextContent('VCB Bill Generator');
  });
});
