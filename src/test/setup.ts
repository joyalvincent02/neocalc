import '@testing-library/jest-dom/vitest'

// jsdom doesn't implement matchMedia; ThemeProvider relies on it.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => {
    return {
      matches: false, // default to system light in tests
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }
  },
})

