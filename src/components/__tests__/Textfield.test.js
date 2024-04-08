import { render, fireEvent } from '@testing-library/react'
import Textfield from '../Textfield'

describe('Textfield component', () => {
  it('should render only the placeholder and not the label on initial render', () => {
    const labelName = 'some-label'
    const placeholderName = 'some-placeholder'
    const id = 'some-id'
    const { queryByLabelText, getByPlaceholderText } = render(
      <Textfield id={id} label={labelName} placeholder={placeholderName} />,
    )

    expect(queryByLabelText(labelName)).toBeNull()
    expect(getByPlaceholderText(placeholderName)).toBeInTheDocument()
  })

  it('should show label and not the placeholder when input field is focused', () => {
    const labelName = 'some-label'
    const placeholderName = 'some-placeholder'
    const id = 'some-id'
    const { queryByPlaceholderText, container, getByLabelText } = render(
      <Textfield id={id} label={labelName} placeholder={placeholderName} />,
    )

    const inputField = container.querySelector('#' + id)
    fireEvent.focus(inputField)

    expect(getByLabelText(labelName)).toBeInTheDocument()
    expect(queryByPlaceholderText(placeholderName)).toBeNull()
  })

  it('should show label and not the placeholder when input field is unfocused and the textfield is not empty', () => {
    const labelName = 'some-label'
    const placeholderName = 'some-placeholder'
    const id = 'some-id'
    const { queryByPlaceholderText, container, getByLabelText } = render(
      <Textfield id={id} label={labelName} placeholder={placeholderName} />,
    )

    const inputField = container.querySelector('#' + id)
    fireEvent.focus(inputField)

    fireEvent.change(inputField, { target: { value: 'some-input' } })

    fireEvent.blur(inputField)

    expect(getByLabelText(labelName)).toBeInTheDocument()
    expect(queryByPlaceholderText(placeholderName)).toBeNull()
  })

  it('should show placeholder and not label when input field is unfocused and the textfield is empty', () => {
    const labelName = 'some-label'
    const placeholderName = 'some-placeholder'
    const id = 'some-id'
    const { queryByLabelText, getByPlaceholderText, container } = render(
      <Textfield id={id} label={labelName} placeholder={placeholderName} />,
    )

    const inputField = container.querySelector('#' + id)
    fireEvent.focus(inputField)

    fireEvent.change(inputField, { target: { value: '' } })

    fireEvent.blur(inputField)

    expect(getByPlaceholderText(placeholderName)).toBeInTheDocument()
    expect(queryByLabelText(labelName)).toBeNull()
  })

  it('should trigger on focus event on focus', () => {
    const mockOnFocus = jest.fn()
    const id = 'some-id'
    const { container } = render(<Textfield id={id} onFocus={mockOnFocus} />)

    const inputField = container.querySelector('#' + id)
    fireEvent.focus(inputField)

    expect(mockOnFocus).toHaveBeenCalledTimes(1)
  })

  it('should trigger onChange event on input change', () => {
    const mockOnChange = jest.fn()
    const id = 'some-id'
    const { container } = render(<Textfield id={id} onChange={mockOnChange} />)

    const inputField = container.querySelector('#' + id)
    fireEvent.change(inputField, { target: { value: 'some-value' } })

    expect(mockOnChange).toHaveBeenCalledTimes(1)
  })

  it('should trigger on blur event on blur', () => {
    const mockOnBlur = jest.fn()
    const id = 'some-id'
    const { container } = render(<Textfield id={id} onBlur={mockOnBlur} />)

    const inputField = container.querySelector('#' + id)
    fireEvent.focus(inputField)
    fireEvent.blur(inputField)

    expect(mockOnBlur).toHaveBeenCalledTimes(1)
  })
})
