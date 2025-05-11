import { useEffect, useState, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { Flex, Spin } from 'antd'
import {
  createArticleThunk,
  updateArticleThunk,
  fetchSingleArticleThunk,
} from '../../app/API-services/fetchCreateArticle'

import cls from './CreateArticle.module.scss'

export default function CreateArticle({ mode = 'create' }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { slug } = useParams()
  const currentUser = useSelector((state) => state.users.currentUser)
  const username = useMemo(() => currentUser?.username || '', [currentUser])
  const authorization = useSelector((state) => state.users.authorization)

  const [tags, setTags] = useState([''])
  const [loading, setLoading] = useState(true)
  const initialized = useRef(false)

  useEffect(() => {
    if (!authorization) return

    const init = async () => {
      if (mode === 'edit') {
        try {
          const result = await dispatch(fetchSingleArticleThunk(slug))

          if (fetchSingleArticleThunk.fulfilled.match(result)) {
            const article = result.payload

            if (!article || !article.author?.username) {
              navigate(`/articles`)
              return
            }

            if (article.author.username !== username) {
              navigate(`/articles/${slug}`)
              return
            }

            reset({
              title: article.title || '',
              description: article.description || '',
              text: article.body || '',
            })
            setTags(article.tagList?.length ? article.tagList : [''])
          } else {
            throw new Error('Ошибка при загрузке')
          }
        } catch (err) {
          navigate('/articles')
        } finally {
          setLoading(false)
        }
      } else {
        reset({
          title: '',
          description: '',
          text: '',
        })
        setTags([''])
        setLoading(false)
      }
    }

    if (!initialized.current && username) {
      initialized.current = true
      init()
    }
  }, [authorization, mode, slug, reset, navigate, dispatch, username])

  const addTag = () => setTags((prev) => [...prev, ''])

  const removeTag = (index) => {
    setTags((prev) => prev.filter((_, i) => i !== index))
  }

  const updateTag = (index, value) => {
    setTags((prev) => {
      const updated = [...prev]
      updated[index] = value
      return updated
    })
  }

  const onSubmit = async (data) => {
    const article = {
      title: data.title,
      description: data.description,
      body: data.text,
      tagList: tags.filter((tag) => tag.trim() !== ''),
    }

    if (mode === 'create') {
      const result = await dispatch(createArticleThunk(article))
      if (result.meta.requestStatus === 'fulfilled') {
        reset()
        setTags([''])
        navigate('/articles')
      }
    }

    if (mode === 'edit') {
      const result = await dispatch(updateArticleThunk({ slug, articleData: article }))
      if (result.meta.requestStatus === 'fulfilled') {
        navigate(`/articles/${slug}`)
      }
    }
  }

  if (loading) {
    return (
      <Flex align="center" gap="middle">
        <Spin size="middle" />
        <p>Loading...</p>
      </Flex>
    )
  }

  return (
    <div className={cls.create_article_container}>
      <h2>{mode === 'edit' ? 'Edit article' : 'Create new article'}</h2>
      <form className={cls.article_container} onSubmit={handleSubmit(onSubmit)}>
        <div className={cls.article_block}>
          <label htmlFor="title" className={cls.article_label}>
            Title
          </label>
          <input
            className={cls.article_item}
            type="text"
            id="title"
            placeholder="Title"
            {...register('title', {
              required: 'Title is required',
              maxLength: { value: 82, message: 'Max 82 characters' },
            })}
            style={errors.title ? { borderColor: 'red' } : {}}
          />
          {errors.title && <div style={{ color: 'red', fontSize: '0.8em' }}>{errors.title.message}</div>}
        </div>

        <div className={cls.article_block}>
          <label htmlFor="short description" className={cls.article_label}>
            Short description
          </label>
          <input
            className={cls.article_item}
            type="text"
            id="description"
            placeholder="Short description"
            {...register('description', {
              required: 'Description is required',
              maxLength: { value: 82, message: 'Max 82 characters' },
            })}
            style={errors.description ? { borderColor: 'red' } : {}}
          />
          {errors.description && <div style={{ color: 'red', fontSize: '0.8em' }}>{errors.description.message}</div>}
        </div>

        <div className={cls.article_block}>
          <label htmlFor="text" className={cls.article_label}>
            Text
          </label>
          <textarea
            className={`${cls.article_item} ${cls.article_text}`}
            id="text"
            placeholder="Text"
            {...register('text', { required: 'Text is required' })}
            style={errors.text ? { borderColor: 'red' } : {}}
          />
          {errors.text && <div style={{ color: 'red', fontSize: '0.8em' }}>{errors.text.message}</div>}
        </div>
        <div className={cls.tags_container}>
          <div className={cls.tags_block}>
            <label className={cls.article_label}>Tags</label>
            {tags.map((tag, index) => (
              <div key={index} className={cls.tag_item}>
                <input
                  className={`${cls.article_item} ${cls.tag_input}`}
                  type="text"
                  value={tag}
                  onChange={(e) => updateTag(index, e.target.value)}
                  placeholder="Tag"
                />
                <button className={cls.tag_delete} type="button" onClick={() => removeTag(index)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
          <button className={cls.tag_add} type="button" onClick={addTag}>
            Add tag
          </button>
        </div>
        <button className={cls.send_button} type="submit" disabled={!isValid}>
          {mode === 'edit' ? 'Save' : 'Send'}
        </button>
      </form>
    </div>
  )
}
