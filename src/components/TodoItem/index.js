import DeleteIcon from '@mui/icons-material/Delete'
import PropTypes from 'prop-types'

TodoItem.propTypes = {
  title: PropTypes.string,
  onDelete: PropTypes.func,
}

/**
 * TodoItem
 * A component representing a single todo item.
 *
 * @component
 * @param title - The title of the todo item
 * @param onDelete - Callback function triggered when the delete button is clicked
 */
export default function TodoItem({ title, onDelete }) {
  return (
    <li className="todo-item">
      <span>{title}</span>
      <button className="delete-button" onClick={onDelete}>
        <DeleteIcon />
      </button>
    </li>
  )
}
