const TaskCard = ({ task, onEdit, onDelete }) => {
  const badgeClass = {
    'pending': 'badge badge-pending',
    'in-progress': 'badge badge-in-progress',
    'completed': 'badge badge-completed',
  }

  return (
    <div className="task-card">
      <div>
        <div style={{display:'flex', alignItems:'center'}}>
          <h3>{task.title}</h3>
          <span className={badgeClass[task.status]}>{task.status}</span>
        </div>
        {task.description && <p>{task.description}</p>}
      </div>
      <div className="task-actions">
        <button className="edit-btn" onClick={() => onEdit(task)}>Edit</button>
        <button className="delete-btn" onClick={() => onDelete(task._id)}>Delete</button>
      </div>
    </div>
  )
}

export default TaskCard