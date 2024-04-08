import { BASE_TASK_API } from '../../../constants'
import getTasks from '../get_tasks'

// Mock fetch function
const mockFetch = jest.fn()

describe('getTasks Behaviour', () => {
  beforeEach(() => {
    global.fetch = mockFetch
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should make a GET request with correct URL parameters', async () => {
    const start = 5
    const end = 15

    // Mock fetch implementation
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(),
    })

    await getTasks({ start, end })

    expect(mockFetch).toHaveBeenCalledWith(
      BASE_TASK_API + `?_sort=id&_order=desc&_start=${start}&_end=${end}`,
    )
  })

  it('should return response data on success', async () => {
    const responseData = [
      { id: 1, task: 'Task 1' },
      { id: 2, task: 'Task 2' },
    ]

    // Mock fetch implementation
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(responseData),
    })

    const start = 0
    const end = 10
    const result = await getTasks({ start, end })

    expect(result).toEqual(responseData)
  })

  it('should throw an error on server error', async () => {
    const errorMessage = 'Server error 500'

    // Mock fetch implementation
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
    })

    const start = 0
    const end = 10
    await expect(getTasks({ start, end })).rejects.toThrow(errorMessage)
  })
})
