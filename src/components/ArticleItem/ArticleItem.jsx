import { Link, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { Popconfirm } from 'antd'
import { useDispatch } from 'react-redux'
import { deleteArticleThunk } from '../../app/API-services/fetchCreateArticle'

import defaultAvatar from '../../assets/Rectangle.svg'
import LikeButton from '../LikeButton/LikeButton'

import cls from './ArticleItem.module.scss'
import './Popconfirm.scss'

export default function ArticleItem({
  slug,
  title,
  description,
  body,
  tagList,
  favoritesCount,
  favorited,
  createdAt,
  author,
  full = false,
  currentUser,
}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleDelete = async () => {
    const result = await dispatch(deleteArticleThunk(slug))
    if (deleteArticleThunk.fulfilled.match(result)) {
      navigate('/articles')
    }
  }

  function limiterOverview(text, maxLength) {
    if (!text) return '*Тут должен был быть текст*'
    if (text.length <= maxLength) return text

    if (!full) {
      const truncated = text.slice(0, maxLength)
      const lastSpace = truncated.lastIndexOf(' ')
      return `${truncated.slice(0, lastSpace).trim()}...`
    } else return text
  }

  return (
    <section
      className={
        !full ? `${cls.article_list_item} ${cls.article_for_list}` : `${cls.article_list_item} ${cls.article_single}`
      }
    >
      <div className={cls.main_info}>
        <div className={cls.title_container}>
          {!full ? (
            <Link to={`/articles/${slug}`} className={cls.title_link}>
              {title}
            </Link>
          ) : (
            <div className={cls.title_link}>{title}</div>
          )}
          <LikeButton slug={slug} count={favoritesCount} liked={favorited} />
        </div>
        <div className={cls.tags}>
          {tagList?.map((tag, index) => (
            <span key={`${tag}-${index}`} className={cls.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <p className={cls.description}>{limiterOverview(description, 145)}</p>

      {full && body && (
        <>
          <div className={cls.body}>
            <ReactMarkdown>{body}</ReactMarkdown>
          </div>
        </>
      )}

      <div className={cls.author_container}>
        <div className={cls.author_info}>
          <span className={cls.author_name}>{author?.username}</span>
          <span className={cls.author_bd}>{format(new Date(createdAt), 'MMMM d, yyyy')}</span>
        </div>
        <img className={cls.author_photo} src={author?.image || defaultAvatar} alt="avatar" />
        {currentUser === author.username && (
          <div className={cls.button_block}>
            <Popconfirm
              title="Are you sure to delete this article?"
              onConfirm={handleDelete}
              placement="right"
              okText="Yes"
              cancelText="No"
              className="custom-popconfirm"
            >
              <button className={cls.delete_button}>Delete</button>
            </Popconfirm>

            <Link to={`/articles/${slug}/edit`} className={cls.edit_button}>
              Edit
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
