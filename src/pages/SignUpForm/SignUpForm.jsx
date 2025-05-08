import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../../app/API-services/fetchUser'

import cls from './SignUpForm.module.scss'

const SignUpForm = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' })

  const onSubmit = async (data) => {
    try {
      const user = await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
      })

      localStorage.setItem('token', user.token)
      navigate('/')
    } catch (err) {
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
          setError('root', { type: 'server', message: rootMsg })
        }
      } else {
        setError('root', { type: 'server', message: 'Registration failed. Please try again.' })
      }
    }
  }

  const password = watch('password')

  return (
    <div className={cls.sign_up_container}>
      <h2>Create new account</h2>
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
            Password
          </label>
          <input
            className={cls.input_item}
            type="password"
            id="password"
            placeholder="Password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Your password needs to be at least 6 characters.' },
              maxLength: { value: 40, message: 'Your password must be no more than 40 characters long.' },
            })}
            autoComplete="off"
            style={errors.password ? { borderColor: 'red' } : {}}
          />
          {errors.password && <div style={{ color: 'red', fontSize: '0.8em' }}>{errors.password.message}</div>}
        </div>

        <div className={cls.input_block}>
          <label htmlFor="repeatPassword" className={cls.input_label}>
            Repeat Password
          </label>
          <input
            className={cls.input_item}
            type="password"
            id="repeatPassword"
            placeholder="Password"
            {...register('repeatPassword', {
              required: 'Please repeat the password',
              validate: (value) => value === password || 'Passwords must match',
            })}
            autoComplete="off"
            style={errors.repeatPassword ? { borderColor: 'red' } : {}}
          />
          {errors.repeatPassword && (
            <div style={{ color: 'red', fontSize: '0.8em' }}>{errors.repeatPassword.message}</div>
          )}
        </div>

        <div className={cls.checkbox_block}>
          <label className={cls.checkbox_label}>
            <input
              className={cls.checkbox_item}
              type="checkbox"
              {...register('agree', { required: 'You must agree to continue' })}
            />
            <div className={cls.checkbox_text}>I agree to the processing of my personal information</div>
          </label>
          {errors.agree && (
            <div style={{ color: 'red', fontSize: '0.8em', paddingLeft: '25px' }}>{errors.agree.message}</div>
          )}
        </div>

        <button className={cls.login_button} type="submit" disabled={!isValid}>
          Create
        </button>
      </form>
      {errors.root && <div className={cls.log_up_error}>Ошибка{errors.root.message}</div>}
      <div className={cls.login_massage}>
        <span className={cls.login_text}>Already have an account? </span>
        <Link to={`/sign-in`}>
          <span className={cls.login_link}>Sign In</span>
        </Link>
        <span className={cls.login_text}>.</span>
      </div>
    </div>
  )
}

export default SignUpForm
