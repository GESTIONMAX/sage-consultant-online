import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import HomePage from '@/pages/HomePage'

describe('HomePage', () => {
  it('renders without crashing', () => {
    render(<HomePage />)
    expect(screen.getByText(/expert sage 100/i)).toBeInTheDocument()
  })

  it('displays the main call-to-action button', () => {
    render(<HomePage />)
    expect(screen.getByText(/prendre rendez-vous gratuit/i)).toBeInTheDocument()
  })

  it('displays consultant certification badge', () => {
    render(<HomePage />)
    expect(screen.getByText(/consultant sage certifié/i)).toBeInTheDocument()
  })
})