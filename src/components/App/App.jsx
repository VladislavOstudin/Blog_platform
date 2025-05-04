import cls from './App.module.scss'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from '../Header/Header'

import ArticlesList from '../../pages/ArticlesList/ArticlesList'
import Article from '../../pages/Article/Article'

export default function App() {
  return (
    <Router>
      <div className={cls.blog_container}>
        <Header />
        <main className={cls.main_container}>
          <Routes>
            <Route path="/" element={<ArticlesList />} />
            <Route path="/articles/" element={<ArticlesList />} />
            <Route path="/articles/:slug" element={<Article />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
