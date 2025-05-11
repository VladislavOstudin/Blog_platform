import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { updateUser } from '../../app/API-services/fetchUser'
import { setUser, setEditError, clearErrors } from '../../app/usersReducer'
import { Flex, Spin } from 'antd'

import cls from './EditProfile.module.scss'

const EditProfile = () => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm()

  const dispatch = useDispatch()
  const token = useSelector((state) => state.users.token)
  const { username, email, image } = useSelector((state) => state.users)

  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    reset({
      username,
      email,
      avatar: image || '',
      password: '',
    })
    setLoading(false)
  }, [username, email, image, reset])

  const onSubmit = async (data) => {
    const userData = {
      username: data.username,
      email: data.email.toLowerCase().trim(),
      bio: '',
      image: data.avatar || undefined,
    }

    if (data.password) {
      userData.password = data.password
    }

    try {
      setIsSubmitting(true)
      const updatedUser = await updateUser(userData)
      dispatch(setUser({ user: updatedUser, token }))
      reset({ ...data, password: '' }, { keepDirty: false })
      dispatch(clearErrors())
    } catch (err) {
      dispatch(setEditError())
      const apiErrors = err.response?.data?.errors

      if (apiErrors) {
        let handled = false

        Object.entries(apiErrors).forEach(([field, messages]) => {
          const msg = Array.isArray(messages) ? messages.join(', ') : messages
          if (['username', 'email', 'password'].includes(field)) {
            setError(field, { type: 'server', message: msg })
            handled = true
          }
        })

        if (!handled) {
          const rootMsg = Object.values(apiErrors)
            .flat()
            .map((m) => (Array.isArray(m) ? m.join(', ') : m))
            .join(', ')
          setEditError('root', { type: 'server', message: rootMsg })
        }
      } else {
        setEditError('root', {
          type: 'server',
          message: 'Profile update failed. Please try again.',
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cls.edit_profile_container}>
      {loading && (
        <Flex align="center" gap="middle">
          <Spin size="middle" />
          <p>Loading...</p>
        </Flex>
      )}
      <h2>Edit Profile</h2>
      <form className={cls.input_container} onSubmit={handleSubmit(onSubmit)}>
        <div className={cls.input_block}>
          <label htmlFor="username" className={cls.input_label}>
            Username
          </label>
          <input
            className={cls.input_item}
            type="text"
            id="username"
            placeholder="Username"
            {...register('username', {
              required: 'Username is required',
              minLength: { value: 3, message: 'Min 3 characters' },
              maxLength: { value: 20, message: 'Max 20 characters' },
            })}
            style={errors.username ? { borderColor: 'red' } : {}}
          />
          {errors.username && <div style={{ color: 'red', fontSize: '0.8em' }}>{errors.username.message}</div>}
        </div>

        <div className={cls.input_block}>
          <label htmlFor="email" className={cls.input_label}>
            Email address
          </label>
          <input
            className={cls.input_item}
            type="email"
            id="email"
            placeholder="Email address"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address',
              },
            })}
            style={errors.email ? { borderColor: 'red' } : {}}
          />
          {errors.email && <div style={{ color: 'red', fontSize: '0.8em' }}>{errors.email.message}</div>}
        </div>

        <div className={cls.input_block}>
          <label htmlFor="password" className={cls.input_label}>
            New password
          </label>
          <input
            className={cls.input_item}
            type="password"
            id="password"
            placeholder="New password"
            autoComplete="off"
            {...register('password', {
              minLength: { value: 6, message: 'Min 6 characters' },
              maxLength: { value: 40, message: 'Max 40 characters' },
            })}
            style={errors.password ? { borderColor: 'red' } : {}}
          />
          {errors.password && <div style={{ color: 'red', fontSize: '0.8em' }}>{errors.password.message}</div>}
        </div>

        <div className={cls.input_block}>
          <label htmlFor="avatar" className={cls.input_label}>
            Avatar image (url)
          </label>
          <input
            className={cls.input_item}
            type="text"
            id="avatar"
            placeholder="Avatar"
            {...register('avatar', {
              pattern: {
                value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i,
                message: 'Invalid image URL',
              },
            })}
            style={errors.avatar ? { borderColor: 'red' } : {}}
          />
          {errors.avatar && <div style={{ color: 'red', fontSize: '0.8em' }}>{errors.avatar.message}</div>}
        </div>

        <button className={cls.save_button} type="submit" disabled={!isDirty || isSubmitting}>
          {isSubmitting ? (
            <>
              <Spin size="small" />
              <span> Update in progress...</span>
            </>
          ) : (
            'Save'
          )}
        </button>
        {errors.root && <div className={cls.edit_error}>{errors.root.message}</div>}
      </form>
    </div>
  )
}

export default EditProfile
