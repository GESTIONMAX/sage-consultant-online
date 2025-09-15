import '@testing-library/jest-dom'
import { beforeAll, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Setup global test environment
beforeAll(() => {
  // Mock environment variables
  Object.defineProperty(import.meta, 'env', {
    value: {
      VITE_SUPABASE_URL: 'https://test.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'test-key',
    },
    writable: true,
  })
})

// Cleanup after each test
afterEach(() => {
  cleanup()
})