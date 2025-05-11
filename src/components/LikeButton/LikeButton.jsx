import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import likeIcon from '../../assets/like.svg'
import likeIconRed from '../../assets/like_red.svg'
import cls from './LikeButton.module.scss'
import { fetchPutLike, fetchRemoveLike } from '../../app/API-services/fetchLike'

export default function LikeButton({ slug, count = 0, liked = false }) {
  const [isLiked, setIsLiked] = useState(liked)
  const [likes, setLikes] = useState(count)
  const [loading, setLoading] = useState(false)

  const isAuthorized = useSelector((state) => state.users.authorization)

  const handleClick = async () => {
    if (!isAuthorized || loading) return

    if (loading) return
    setLoading(true)

    try {
      let newCount
      if (isLiked) {
        newCount = await fetchRemoveLike(slug)
      } else {
        newCount = await fetchPutLike(slug)
      }

      setIsLiked(!isLiked)
      setLikes(newCount)
    } catch (err) {
      throw new Error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setIsLiked(liked)
    setLikes(count)
  }, [liked, count])

  return (
    <>
      <button className={cls.like} onClick={handleClick} disabled={loading} aria-pressed={isLiked}>
        <img src={isLiked ? likeIconRed : likeIcon} alt="like" />
      </button>
      <span className={cls.like_value}>{likes}</span>
    </>
  )
}
