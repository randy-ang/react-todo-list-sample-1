import { BASE_TASK_API } from '../../../constants'
import deleteTasks from '../delete_tasks'

// Mock fetch function
const mockFetch = jest.fn()

describe('deleteTasks Behaviour', () => {
  beforeEach(() => {
    global.fetch = mockFetch
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should make a DELETE request with correct URL', async () => {
    const id = 1

    // Mock fetch implementation
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(),
    })

    await deleteTasks(id)

    expect(mockFetch).toHaveBeenCalledWith(BASE_TASK_API + `/${id}`, {
      method: 'DELETE',
    })
  })

  it('should return response data on success', async () => {
    const responseData = { data: 'some-data' }

    // Mock fetch implementation
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(responseData),
    })

    const id = 1
    const result = await deleteTasks(id)

    expect(result).toEqual(responseData)
  })

  it('should return response data on 404 error', async () => {
    const responseData = {}

    // Mock fetch implementation for 404 error
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve(responseData),
    })

    const id = 1
    const result = await deleteTasks(id)

    expect(result).toEqual(responseData)
  })

  it('should throw an error on other server errors', async () => {
    const errorMessage = 'Server error 500'

    // Mock fetch implementation for other server errors
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
    })

    const id = 1
    await expect(deleteTasks(id)).rejects.toThrow(errorMessage)
  })
})
