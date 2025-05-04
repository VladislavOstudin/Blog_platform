import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'

import defaultAvatar from '../../assets/Rectangle.svg'
import likeIcon from '../../assets/like.svg'

import cls from './ArticleItem.module.scss'

export default function ArticleItem({
  slug,
  title,
  description,
  body,
  tagList,
  favoritesCount,
  createdAt,
  author,
  full = false,
}) {
  function limiterOverview(text, maxLength) {
    if (!text) return '*Тут должен был быть текст*'
    if (text.length <= maxLength) return text

    if (!full) {
      const truncated = text.slice(0, maxLength)
      const lastSpace = truncated.lastIndexOf(' ')
      return `${truncated.slice(0, lastSpace).trim()}...`
    } else return text
  }

  // console.log(description, body)

  return (
    <div className={cls.shadow_wrapper}>
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

            <button className={cls.like}>
              <img src={likeIcon} alt="like" />
            </button>
            <span className={cls.like_value}>{favoritesCount}</span>
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
          <img className={cls.author_photo} src={author?.image || defaultAvatar} alt="author" />
        </div>
      </section>
    </div>
  )
}
