import { BASE_TASK_API } from '../../constants'

export default function deleteTasks(id) {
  const requestOptions = {
    method: 'DELETE',
  }
  return fetch(BASE_TASK_API + '/' + id, requestOptions).then((response) => {
    if (!response.ok) {
      // 404 just continues as normal because the data is no longer there
      if (response.status !== 404) {
        throw new Error('Server error ' + response.status)
      }
    }
    return response.json()
  })
}
