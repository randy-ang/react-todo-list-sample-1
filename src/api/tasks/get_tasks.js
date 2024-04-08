import { BASE_TASK_API } from '../../constants'

export default function getTasks({ start, end }) {
  const queryParams = new URLSearchParams({
    _sort: 'id',
    _order: 'desc',
    _start: start,
    _end: end,
  })

  return fetch(BASE_TASK_API + '?' + queryParams.toString()).then(
    (response) => {
      if (!response.ok) {
        throw new Error('Server error ' + response.status)
      }
      return response.json()
    },
  )
}
