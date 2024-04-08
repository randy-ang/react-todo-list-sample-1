import { render, fireEvent, waitFor } from '@testing-library/react'
import Toaster, { TOAST_TYPE, useToast } from '../Toaster'

describe('Toaster component', () => {
  it('should display toast message when showToast is called', async () => {
    const expectedToastMessage = 'some-toast-message'
    const TestComponent = () => {
      const { showToast } = useToast()
      return <button onClick={() => showToast(expectedToastMessage)} />
    }

    const { queryByText, container } = render(
      <Toaster>
        <TestComponent />
      </Toaster>,
    )

    fireEvent.click(container.querySelector('button'))

    await waitFor(() => {
      const toast = queryByText(expectedToastMessage)
      expect(toast).toBeInTheDocument()
    })
  })

  it('should display toast with specified type', async () => {
    const mockToastMessage = 'some-toast-message'
    const TestComponent = () => {
      const { showToast } = useToast()
      return (
        <button onClick={() => showToast(mockToastMessage, TOAST_TYPE.ERROR)} />
      )
    }

    const { queryByText, container } = render(
      <Toaster>
        <TestComponent />
      </Toaster>,
    )

    fireEvent.click(container.querySelector('button'))

    await waitFor(() => {
      const toast = queryByText(mockToastMessage)
      expect(toast).toBeInTheDocument()
      expect(toast).toHaveClass('error')
    })
  })

  it('should hide toast after timeout', async () => {
    const mockToastMessage = 'some-toast-message'
    jest.useFakeTimers()

    const TestComponent = () => {
      const { showToast } = useToast()
      return <button onClick={() => showToast(mockToastMessage)} />
    }

    const { container, queryByText } = render(
      <Toaster>
        <TestComponent />
      </Toaster>,
    )

    fireEvent.click(container.querySelector('button'))

    await waitFor(() => {
      expect(queryByText(mockToastMessage)).toBeInTheDocument()
    })

    jest.runAllTimers()

    await waitFor(() => {
      expect(queryByText(mockToastMessage)).not.toBeInTheDocument()
    })
  })
})
