import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BoardsPage } from '../../pages/BoardsPage'

describe('BoardsPage', () => {
  it('should render page title', () => {
    render(<BoardsPage />)
    
    const title = screen.getByRole('heading', { level: 1 })
    expect(title).toBeTruthy()
    expect(title.textContent).toBe('Task Tiles')
  })
  
  it('should render page description', () => {
    render(<BoardsPage />)
    
    const description = screen.getByText('Visual project management boards')
    expect(description).toBeTruthy()
  })
  
  it('should render create board button', () => {
    render(<BoardsPage />)
    
    const createButton = screen.getByText('Create New Board')
    expect(createButton).toBeTruthy()
  })
  
  it('should render create board description', () => {
    render(<BoardsPage />)
    
    const createDescription = screen.getByText('Start organizing your tasks')
    expect(createDescription).toBeTruthy()
  })
}) 