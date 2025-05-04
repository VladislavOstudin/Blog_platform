import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Pagination, Flex, Spin, Alert } from 'antd'
import { useSearchParams } from 'react-router-dom'

import ArticleItem from '../../components/ArticleItem/ArticleItem'
import { fetchArticles } from '../../app/API-services/fetchArticles'

import cls from './ArticlesList.module.scss'
import './ArticlesList.scss'

export default function ArticlesList() {
  const dispatch = useDispatch()
  const { articles = [], totalPages = 1, loading, error } = useSelector((state) => state.articles)
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1

  useEffect(() => {
    dispatch(fetchArticles(currentPage))
  }, [currentPage, dispatch])

  const handlePageChange = (page) => {
    setSearchParams({ page })
  }

  return (
    <div className={cls.articles_list_container}>
      {loading && (
        <Flex align="center" gap="middle">
          <Spin size="large" />
          <span>Идет загрузка...</span>
        </Flex>
      )}
      {error && (
        <Alert type="error" message="Что-то пошло не так..." description="Мы уже работаем над проблемой." showIcon />
      )}
      {!loading &&
        !error &&
        articles.map((article) => (
          <ArticleItem
            key={article.slug}
            slug={article.slug}
            title={article.title}
            description={article.description}
            tagList={article.tagList}
            favoritesCount={article.favoritesCount}
            createdAt={article.createdAt}
            author={article.author}
          />
        ))}

      {!loading && !error && (
        <Pagination
          className="custom_pagination"
          current={currentPage}
          total={totalPages * 5}
          pageSize={5}
          onChange={handlePageChange}
          showSizeChanger={false}
          style={{ textAlign: 'center', marginTop: 24 }}
        />
      )}
    </div>
  )
}
