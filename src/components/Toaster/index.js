import { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import './Toaster.css'

export const TOAST_TYPE = {
  INFO: 'info',
  ERROR: 'error',
  SUCCESS: 'success',
}

const ToastContext = createContext({
  showToast: () => {},
})

/**
 * useToast
 * A custom hook to provide access to the showToast function, which displays toaster when used.
 *
 * @returns {Object} - Toast context value
 */
export const useToast = () => useContext(ToastContext)

Toaster.propTypes = {
  children: PropTypes.node,
}

/**
 * Toaster
 * A component to display toast messages.
 *
 * @component
 * @param children - The children element that wants to consume the toaster
 */
export default function Toaster({ children }) {
  const [toast, setToast] = useState(null)

  const showToast = (message, type = TOAST_TYPE.INFO, timeout = 2000) => {
    setToast({ message, type })

    setTimeout(() => {
      setToast(null)
    }, timeout)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toaster">
        {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
      </div>
    </ToastContext.Provider>
  )
}
