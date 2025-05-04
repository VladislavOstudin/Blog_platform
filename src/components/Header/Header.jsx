import { Link } from 'react-router-dom'
import cls from './Header.module.scss'

export default function Header() {
  return (
    <header className={cls.header_container}>
      <Link to={`/`}>
        <div className={cls.name}>Real-world Blog</div>
      </Link>
      <div className={cls.button_block}>
        <button className={cls.sign_in}>Sign In</button>
        <button className={cls.sign_up}>Sign Up</button>
      </div>
    </header>
  )
}
