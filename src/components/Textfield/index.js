import { useState } from 'react'
import PropTypes from 'prop-types'

Textfield.propTypes = {
  onChange: PropTypes.func,
  id: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
}

/**
 * Textfield
 * A component representing a text input field with dynamic label behavior.
 *
 * @component
 * @param onChange - Callback function triggered when the input value changes
 * @param id - ID of the input field
 * @param label - Label for the input field
 * @param placeholder - Placeholder text for the input field
 * @param onFocus - Callback function triggered when the input field gains focus
 * @param onBlur - Callback function triggered when the input field loses focus
 */
export default function Textfield({
  onChange,
  id,
  label,
  placeholder,
  onFocus,
  onBlur,
  ...inputProps
}) {
  const [showLabel, setShowLabel] = useState(false)

  const onInputChange = (event) => {
    setShowLabel(Boolean(event.target.value))

    onChange?.(event)
  }

  const onInputFocus = (event) => {
    setShowLabel(true)

    onFocus?.(event)
  }

  const onInputBlur = (event) => {
    setShowLabel(Boolean(event.target.value))

    onBlur?.(event)
  }

  return (
    <>
      {showLabel && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}
      <input
        {...inputProps}
        placeholder={showLabel ? '' : placeholder}
        id={id}
        onChange={onInputChange}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
      />
    </>
  )
}
