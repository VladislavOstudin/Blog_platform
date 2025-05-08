import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchCurrentUser } from '../../app/API-services/fetchUser'
import { setUser, logOut } from '../../app/usersReducer'

import cls from './App.module.scss'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from '../Header/Header'

import ArticlesList from '../../pages/ArticlesList/ArticlesList'
import Article from '../../pages/Article/Article'
import SignInForm from '../../pages/SignInForm/SignInForm'
import SignUpForm from '../../pages/SignUpForm/SignUpForm'
import EditProfile from '../../pages/EditProfile/EditProfile'

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    const authorize = async () => {
      try {
        const user = await fetchCurrentUser()
        dispatch(setUser({ user, token }))
      } catch (err) {
        dispatch(logOut())
        localStorage.removeItem('token')
        throw new Error('Auto-authorization failed:', err)
      }
    }

    authorize()
  }, [dispatch])

  return (
    <Router>
      <div className={cls.blog_container}>
        <Header />
        <main className={cls.main_container}>
          <Routes>
            <Route path="/" element={<ArticlesList />} />
            <Route path="/articles/" element={<ArticlesList />} />
            <Route path="/articles/:slug" element={<Article />} />
            <Route path="/sign-in" element={<SignInForm />} />
            <Route path="/sign-up" element={<SignUpForm />} />
            <Route path="/profile" element={<EditProfile />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
