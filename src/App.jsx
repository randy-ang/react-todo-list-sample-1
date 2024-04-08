import TodoList from './components/TodoList'
import './App.css'
import Toaster from './components/Toaster'

export default function App() {
  return (
    <div className="App">
      <div className="App-container">
        <Toaster>
          <TodoList />
        </Toaster>
      </div>
    </div>
  )
}
