import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import defaultAvatar from '../../assets/Rectangle.svg'
import cls from './Header.module.scss'
import { logOut } from '../../app/usersReducer'

export default function Header() {
  const dispatch = useDispatch()
  const { authorization, username, image } = useSelector((state) => state.users)

  const handleLogOut = () => {
    dispatch(logOut())
    localStorage.removeItem('token')
  }

  return (
    <header className={cls.header_container}>
      <Link to={`/`}>
        <div className={cls.name}>Real-world Blog</div>
      </Link>
      <div className={cls.button_block}>
        {!authorization ? (
          <>
            <Link to={`/sign-in`}>
              <button className={cls.sign_in}>Sign In</button>
            </Link>

            <Link to={`/sign-up`}>
              <button className={cls.sign_up}>Sign Up</button>
            </Link>
          </>
        ) : (
          <>
            <Link to={`/new-article`}>
              <button className={cls.create_article}>Create article</button>
            </Link>
            <div className={cls.user}>
              <Link to={`/profile`}>
                <span className={cls.user_name}>{username}</span>
              </Link>
              <img className={cls.user_photo} src={image || defaultAvatar} alt="author" />
            </div>
            <button className={cls.log_out} onClick={handleLogOut}>
              Log Out
            </button>
          </>
        )}
      </div>
    </header>
  )
}
