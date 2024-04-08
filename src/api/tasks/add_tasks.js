import { BASE_TASK_API } from '../../constants'

export default function addTasks(body) {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  const requestOptions = {
    method: 'POST',
    body: JSON.stringify(body),
    headers,
  }
  return fetch(BASE_TASK_API, requestOptions).then((response) => {
    if (!response.ok) {
      throw new Error('Server error ' + response.status)
    }
    return response.json()
  })
}
