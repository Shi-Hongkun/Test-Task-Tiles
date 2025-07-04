import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'

// Test wrapper for components that need router
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('App Component', () => {
  it('should render without crashing', () => {
    render(<App />, { wrapper: TestWrapper })
    
    // The app should render the main container
    const appContainer = screen.getByRole('main') || document.querySelector('.min-h-screen')
    expect(appContainer).toBeTruthy()
  })
  
  it('should have the correct base styling', () => {
    render(<App />, { wrapper: TestWrapper })
    
    // Check if the main container has the correct background class
    const mainContainer = document.querySelector('.min-h-screen.bg-gray-50')
    expect(mainContainer).toBeTruthy()
  })
}) 