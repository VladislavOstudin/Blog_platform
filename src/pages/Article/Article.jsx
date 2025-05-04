import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Flex, Spin, Alert } from 'antd'
import { fetchSingleArticle } from '../../app/API-services/fetchSingleArticle'
import ArticleItem from '../../components/ArticleItem/ArticleItem'

import cls from './Article.module.scss'

export default function Article() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchSingleArticle(slug)
        setArticle(data)
        setError(null)
      } catch (err) {
        setError('Не удалось загрузить статью')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [slug])

  return (
    <div className={cls.article_container}>
      {loading && (
        <>
          <Flex align="center" gap="middle">
            <Spin size="large" />
            <span>Идет загрузка...</span>
          </Flex>
        </>
      )}

      {error && (
        <>
          <Alert type="error" message="Что-то пошло не так..." description="Мы уже работаем над проблемой." showIcon />
        </>
      )}

      {!loading && !error && article && (
        <div className={cls.single_article_container}>
          <ArticleItem
            title={article.title}
            body={article.body}
            description={article.description}
            tagList={article.tagList}
            favoritesCount={article.favoritesCount}
            createdAt={article.createdAt}
            author={article.author}
            full
          />
        </div>
      )}
    </div>
  )
}
