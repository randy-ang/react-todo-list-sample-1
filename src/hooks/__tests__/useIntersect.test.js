import { render } from '@testing-library/react'
import { useRef } from 'react'
import useIntersect from '../useIntersect'

global.IntersectionObserver = jest.fn()
const mockIntersectionObserver = {
  observe: jest.fn(),
  disconnect: jest.fn(),
}

describe('useIntersect', () => {
  it('detects intersection with viewport', async () => {
    global.IntersectionObserver.mockImplementation(function (callback) {
      callback([{ isIntersecting: true }])

      return mockIntersectionObserver
    })

    const TestComponent = () => {
      const ref = useRef(null)
      const isIntersecting = useIntersect(ref)

      return (
        <div ref={ref} style={{ height: '1000px' }}>
          {isIntersecting ? 'Intersecting' : 'Not Intersecting'}
        </div>
      )
    }

    const { findByText } = render(<TestComponent />)
    const intersectingText = await findByText('Intersecting')

    expect(intersectingText).toBeInTheDocument()
    expect(mockIntersectionObserver.observe).toHaveBeenCalled()
  })
})
