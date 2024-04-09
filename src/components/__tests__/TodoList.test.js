import { render, fireEvent, waitFor, wait } from '@testing-library/react'
import { useToast } from '../Toaster'

import getTasks from '../../api/tasks/get_tasks'
import deleteTasks from '../../api/tasks/delete_tasks'
import addTasks from '../../api/tasks/add_tasks'
import TodoList from '../TodoList'
import { DEFAULT_LIMIT } from '../../constants'

jest.mock('../Toaster')

jest.mock('../../api/tasks/get_tasks')
jest.mock('../../api/tasks/delete_tasks')
jest.mock('../../api/tasks/add_tasks')
global.IntersectionObserver = jest.fn()
const mockIntersectionObserver = {
  observe: jest.fn(),
  disconnect: jest.fn(),
}

const mockUseToast = {
  showToast: jest.fn(),
}

describe('TodoList component', () => {
  beforeEach(() => {
    useToast.mockReturnValue(mockUseToast)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render loading state on load', async () => {
    getTasks.mockResolvedValue([])
    global.IntersectionObserver.mockImplementation(function (callback) {
      callback([{ isIntersecting: false }])

      return mockIntersectionObserver
    })

    const { getByText } = render(<TodoList />)

    expect(getByText('Loading todos...')).toBeInTheDocument()
  })

  it('should render todo list & add task field after successfully getting task', async () => {
    getTasks.mockResolvedValue([{ id: 1, title: 'Task 1' }])
    global.IntersectionObserver.mockImplementation(function (callback) {
      callback([{ isIntersecting: false }])

      return mockIntersectionObserver
    })

    const { getByText, container } = render(<TodoList />)
    expect(container.querySelector('#add-task-input')).toBeFalsy()

    await waitFor(() => {
      expect(getByText('Task 1')).toBeInTheDocument()
      expect(container.querySelector('#add-task-input')).toBeTruthy()
    })
  })

  it('should show toaster on error getting task', async () => {
    jest.fn().mockRejectedValue()
    getTasks.mockRejectedValue({
      message: 'some-message',
    })
    global.IntersectionObserver.mockImplementation(function (callback) {
      callback([{ isIntersecting: false }])

      return mockIntersectionObserver
    })

    render(<TodoList />)

    await waitFor(() => {
      expect(mockUseToast.showToast).toHaveBeenCalledTimes(1)
    })
  })

  it('should be able to click delete button to call delete task after showing the todo list', async () => {
    getTasks.mockResolvedValue([{ id: 1, title: 'Task 1' }])
    deleteTasks.mockResolvedValue()
    global.IntersectionObserver.mockImplementation(function (callback) {
      callback([{ isIntersecting: false }])

      return mockIntersectionObserver
    })

    const { container } = render(<TodoList />)
    expect(container.querySelector('#add-task-input')).toBeFalsy()

    await waitFor(() => {
      const deleteButton = container.querySelector('button')
      expect(deleteButton).toBeTruthy()
    })

    const deleteButton = container.querySelector('button')
    fireEvent.click(deleteButton)
    expect(deleteTasks).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(mockUseToast.showToast).toHaveBeenCalledTimes(1)
    })
  })

  it('should add a new task with the correct payload after submitting task form', async () => {
    addTasks.mockResolvedValue()
    getTasks.mockResolvedValue([{ id: 1, title: 'Task 1' }])
    global.IntersectionObserver.mockImplementation(function (callback) {
      callback([{ isIntersecting: false }])

      return mockIntersectionObserver
    })

    const { container } = render(<TodoList />)
    expect(container.querySelector('#add-task-input')).toBeFalsy()

    await waitFor(() => {
      expect(container.querySelector('#add-task-input')).toBeTruthy()
    })

    const addTaskInput = container.querySelector('#add-task-input')
    const taskForm = container.querySelector('form')

    fireEvent.change(addTaskInput, {
      target: [{ value: 'New Task' }],
      preventDefault: jest.fn(),
    })
    fireEvent.submit(taskForm, {
      target: [{ value: 'New Task' }],
      preventDefault: jest.fn(),
    })
    getTasks.mockClear()

    await waitFor(() => {
      expect(addTasks).toHaveBeenCalledWith({ title: 'New Task' })
      expect(getTasks).toHaveBeenCalledTimes(1)
      expect(getTasks).toHaveBeenCalledWith({
        start: 0,
        end: DEFAULT_LIMIT + 1,
      })
    })
  })

  it('should load the next batch after intersecting', async () => {
    addTasks.mockResolvedValue()
    const mockGetTaskFirstBatch = new Array(DEFAULT_LIMIT + 1)
      .fill()
      .map((_, index) => ({
        id: index + 1,
        title: 'Task ' + (index + 1),
      }))
    const mockGetTaskSecondBatch = new Array(DEFAULT_LIMIT)
      .fill()
      .map((_, index) => ({
        id: index + 11,
        title: 'Task ' + (index + 11),
      }))

    getTasks.mockResolvedValueOnce(mockGetTaskFirstBatch)
    getTasks.mockResolvedValueOnce(mockGetTaskSecondBatch)
    global.IntersectionObserver.mockImplementation(function (callback) {
      callback([{ isIntersecting: true }])

      return mockIntersectionObserver
    })

    const { getByText } = render(<TodoList />)
    await waitFor(() => {
      expect(getTasks).toHaveBeenCalledTimes(2)
      expect(getTasks).toHaveBeenCalledWith({
        start: 0,
        end: DEFAULT_LIMIT + 1,
      })
      expect(getTasks).toHaveBeenCalledWith({
        start: DEFAULT_LIMIT,
        end: 2 * DEFAULT_LIMIT + 1,
      })

      expect(getByText('Task 5')).toBeInTheDocument()
      expect(getByText('Task 11')).toBeInTheDocument()
      expect(getByText('Task 15')).toBeInTheDocument()
    })
  })
})
