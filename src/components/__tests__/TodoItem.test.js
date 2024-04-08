import { render, fireEvent } from '@testing-library/react'
import TodoItem from '../TodoItem'

describe('TodoItem component', () => {
  it('should render title correctly', () => {
    const title = 'some-title'
    const { getByText } = render(<TodoItem title={title} />)
    expect(getByText(title)).toBeInTheDocument()
  })

  it('should call onDelete callback when delete button is clicked', () => {
    const onDelete = jest.fn()
    const { container } = render(<TodoItem onDelete={onDelete} />)
    const deleteButton = container.querySelector('button')
    fireEvent.click(deleteButton)
    expect(onDelete).toHaveBeenCalledTimes(1)
  })
})
