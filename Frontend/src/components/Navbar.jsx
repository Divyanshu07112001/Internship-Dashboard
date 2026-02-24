import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <nav>
        <Link to="/dashboard" className="brand">✦ TaskFlow</Link>
        <div className="nav-right">
          <span>👋 {user?.name}</span>
          <Link to="/profile">Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div style={{
        textAlign: 'center',
        padding: '6px',
        fontSize: '11px',
        background: '#ffeaea',
        color: '#c0392b',
        fontWeight: '500',
        letterSpacing: '0.5px'
      }}>
        Made with ❤️ by <strong>Divyanshu Verma</strong>
      </div>
    </>
  )
}

export default Navbar