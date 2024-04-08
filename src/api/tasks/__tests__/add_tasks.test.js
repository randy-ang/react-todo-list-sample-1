import { BASE_TASK_API } from '../../../constants'
import addTasks from '../add_tasks'

// Mock fetch function
const mockFetch = jest.fn()

describe('addTasks Behaviour', () => {
  beforeEach(() => {
    global.fetch = mockFetch
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should make a POST request with correct arguments', async () => {
    mockFetch.mockReturnValue(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(),
      }),
    )

    const body = { task: 'some task' }
    await addTasks(body)

    expect(mockFetch).toHaveBeenCalledWith(BASE_TASK_API, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
  })

  it('should return response data on success', async () => {
    const mockResponse = { data: 'some-data' }
    mockFetch.mockReturnValue(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    )

    const body = {}
    const result = await addTasks(body)

    expect(result).toEqual(mockResponse)
  })

  it('should throw an error on server error', async () => {
    const errorMessage = 'Server error 500'
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    const body = { task: 'some task' }
    await expect(addTasks(body)).rejects.toThrow(errorMessage)
  })
})
