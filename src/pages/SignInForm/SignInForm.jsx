import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'

import { loginUser } from '../../app/API-services/fetchUser'
import { setUser, setSignInError, clearErrors } from '../../app/usersReducer'

import cls from './SignInForm.module.scss'

const SignInForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [generalError, setGeneralError] = useState('')

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' })

  const onSubmit = async (data) => {
    try {
      const user = await loginUser(data)

      dispatch(setUser({ user, token: user.token }))
      localStorage.setItem('token', user.token)

      dispatch(clearErrors())
      navigate('/')
    } catch (err) {
      dispatch(setSignInError())

      const apiErrors = err.response?.data?.errors
      if (apiErrors) {
        let handled = false

        Object.entries(apiErrors).forEach(([field, messages]) => {
          if (field === 'email' || field === 'password') {
            setError(field, { type: 'server', message: messages.join(', ') })
            handled = true
          }
        })

        if (!handled) {
          setGeneralError(Object.values(apiErrors).flat().join(', '))
        }
      } else {
        setGeneralError('Something went wrong. Please try again later.')
      }
    }
  }

  return (
    <div className={cls.sign_in_container}>
      <h2>Sign In</h2>
      <form className={cls.input_container} onSubmit={handleSubmit(onSubmit)}>
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
            Password
          </label>
          <input
            className={cls.input_item}
            type="password"
            id="password"
            placeholder="Password"
            {...register('password', {
              required: 'Password is required',
            })}
            style={errors.password ? { borderColor: 'red' } : {}}
          />
          {errors.password && <div style={{ color: 'red', fontSize: '0.8em' }}>{errors.password.message}</div>}
        </div>
        {generalError && <div className={cls.login_error}>Password or email {generalError}</div>}

        <button className={cls.login_button} type="submit" disabled={!isValid}>
          Login
        </button>
      </form>

      <div className={cls.login_massage}>
        <span className={cls.login_text}>Don’t have an account? </span>
        <Link to={`/sign-up`}>
          <span className={cls.login_link}>Sign Up</span>
        </Link>
        <span className={cls.login_text}>.</span>
      </div>
    </div>
  )
}

export default SignInForm
