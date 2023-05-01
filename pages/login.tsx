import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAuth } from '@/hooks';
import { Loader } from '@/components';
import logo from '../public/assets/zuheflix.png'

interface Inputs {
  email: string
  password: string
}

const login = () => {
  const [login, setLogin] = useState<boolean>(false);
  const { signIn, signUp, error, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
    if (login) {
      await signIn(email, password);
    }
    else {
      await signUp(email, password);
    }
  }

  return (
    <div className="relative flex h-screen w-screen flex-col bg-black md:items-center md:justify-center md:bg-transparent">
      <Head>
        <title>Login - Zuhedflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Image
        src="/assets/login-bg.jpg"
        className="-z-10 hidden opacity-60 object-cover sm:inline"
        fill
        alt=""
      />
      <Image
        src={logo}
        className="absolute left-4 top-4 cursor-pointer object-contain md:left-10 md:top-6"
        width={150}
        height={150}
        alt=""
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative mt-24 space-y-8 rounded bg-black/75 py-10 px-6 md:mt-0 md:max-w-md md:px-14"
      >
        <h1 className="text-4xl font-semibold">Sign In</h1>
        <p className={`${!error && 'hidden'} py-4 px-4 bg-[#E87C03] rounded-md text-sm text-white font-semibold`}>{error && error}</p>
        <div className="space-y-4">
          <label className="inline-block w-full" htmlFor="">
            <input
              className="input"
              type="email"
              placeholder="Email"
              {...register('email', { required: true })}
            />
            {errors.email && (
              <p className="text-[13px] font-light text-orange-500">
                Please enter a valid email.
              </p>
            )}
          </label>
          <label className="inline-block w-full" htmlFor="">
            <input
              className="input"
              type="password"
              placeholder="Password"
              {...register('password', { required: true })}
            />
            {errors.password && (
              <p className="text-[13px] font-light text-orange-500">
                Your password must contain atleast 8 characters
              </p>
            )}
          </label>
        </div>

        <button
          className={`w-full py-3 rounded bg-[#e50914] font-semibold ${loading && 'opacity-60'}`}
          type="submit"
          onClick={() => setLogin(true)}
        >
          {loading ? <Loader /> : 'Sign In'}
        </button>

        <div className="text-[gray]">
          New to Netflix?{' '}
          <button className="text-[#f5f5f1] hover:underline" type="submit" onClick={() => setLogin(false)}>
            Sign up now
          </button>
        </div>
      </form>
    </div>
  )
}

export default login
