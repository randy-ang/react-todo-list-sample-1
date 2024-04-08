import { useEffect, useState, useRef } from 'react'

/**
 * useIntersect
 * A custom hook to detect when a target element intersects with the viewport.
 *
 * @param ref - Reference to the target element
 * @returns Boolean value indicating whether the target element is intersecting with the viewport
 */
export default function useIntersect(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const observerRef = useRef(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(([entry]) =>
      setIsIntersecting(entry.isIntersecting),
    )
  }, [])

  useEffect(() => {
    observerRef.current.observe(ref.current)

    return () => {
      observerRef.current.disconnect()
    }
  }, [ref])

  return isIntersecting
}
