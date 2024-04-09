import { useEffect, useRef, useState } from 'react'
import './index.css'
import getTasks from '../../api/tasks/get_tasks'
import deleteTasks from '../../api/tasks/delete_tasks'
import { TOAST_TYPE, useToast } from '../Toaster'
import TodoItem from '../TodoItem'
import addTasks from '../../api/tasks/add_tasks'
import Textfield from '../Textfield'
import { DEFAULT_LIMIT } from '../../constants'
import useIntersect from '../../hooks/useIntersect'

const INITIAL_PAGINATION_STATE = {
  start: 0,
  end: DEFAULT_LIMIT,
  hasNextPage: false,
}

/**
 * TODO List
 * List to maintain your todo list
 * You can add / delete / view your todo lists
 * functionalities:
 * - Loading State
 * - Lazy Loading
 * - Toaster Error in cases of error api call
 * - Toaster Success in cases of successfully deleting tasks
 * - Adding New Tasks
 * - Deleting Tasks
 */
export default function TodoList() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()
  const [pagination, setPagination] = useState(INITIAL_PAGINATION_STATE)
  const isInitialLoading = loading && todos.length === 0

  const getPaginatedTasks = (
    start = pagination.start,
    end = pagination.end,
  ) => {
    // to differentiate some behaviours where we need to fetch from beginning, like add, delete or initial load
    const isFetchingFromStart = start === 0
    // if from lazy loading, then no need to set loading to make it seamless
    setLoading(true)
    return getTasks({
      start,
      end: end + 1,
    })
      .then((data) => {
        const newPaginationState = {
          start: start + DEFAULT_LIMIT,
          end: end + DEFAULT_LIMIT,
          hasNextPage: false,
        }

        let actualData = data

        if (data.length > DEFAULT_LIMIT) {
          newPaginationState.hasNextPage = true
          actualData = data.slice(0, DEFAULT_LIMIT)
        }

        setTodos((prevData) => {
          // if we fetch from start (0), then we reset the whole list to avoid duplicates
          if (isFetchingFromStart) {
            return actualData
          }

          return [...prevData, ...actualData]
        })
        setPagination(newPaginationState)
      })
      .catch((error) => {
        showToast('Error fetching tasks', TOAST_TYPE.ERROR)
        console.error('Error fetching tasks:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getPaginatedTasks()
  }, [])

  const handleDeleteTodo = (id) => {
    deleteTasks(id)
      .then(() => {
        setPagination((currentPaginationState) => ({
          ...currentPaginationState,
          hasNextPage: false,
        }))
      })
      .then(() => getPaginatedTasks(0, DEFAULT_LIMIT))
      .then(() => showToast('Successfully deleted Task', TOAST_TYPE.SUCCESS))
      .catch((err) =>
        showToast('Error deleting tasks: ' + err.message, TOAST_TYPE.ERROR),
      )
  }

  const onAddTask = (event) => {
    event.preventDefault()
    const taskInput = event.target[0]
    const addedTask = taskInput.value

    // only add if there is value
    if (!taskInput.value.trim()) {
      showToast('Please enter a non-empty task description.', TOAST_TYPE.ERROR)
      taskInput.value = ''
      return
    }

    const addTaskPayload = {
      title: addedTask,
    }
    addTasks(addTaskPayload)
      .then(() => {
        getPaginatedTasks(0, DEFAULT_LIMIT)
      })
      .catch((err) =>
        showToast('Error adding tasks: ' + err.message, TOAST_TYPE.ERROR),
      )

    taskInput.value = ''
  }

  const endOfListRef = useRef(null)
  const isIntersecting = useIntersect(endOfListRef)

  useEffect(() => {
    if (isIntersecting && pagination.hasNextPage && !loading) {
      getPaginatedTasks()
    }
  }, [pagination.hasNextPage, isIntersecting, loading])

  return (
    <div className="todolist">
      <h1>TODO LIST</h1>
      {!isInitialLoading && (
        <form className="todo-form" onSubmit={onAddTask}>
          <Textfield
            id="add-task-input"
            type="text"
            name="task"
            placeholder={"What's next on your list?"}
            label="Press Enter to add task:"
          />
        </form>
      )}
      {!loading && todos.length === 0 ? (
        <p>Nothing on your plate right now</p>
      ) : (
        <ul>
          {todos.map(({ title, id }) => (
            <TodoItem
              key={id}
              title={title}
              onDelete={() => handleDeleteTodo(id)}
            />
          ))}
          {loading && <p>Loading todos...</p>}
        </ul>
      )}
      <span ref={endOfListRef} />
    </div>
  )
}
