import { useRouter } from "next/router";
import Lottie from 'react-lottie';
import animationData from '@/lotties/Biometry';
import Link from "next/link";
import useToken from "@/contexts/useToken";
import { useRef } from "react";

const Authentication = () => {
  const router = useRouter();
  const { pathname } = router;

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  const [token, setToken] = useToken();

  function authenticate(e) {
    e.preventDefault();

    const body = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    if (pathname === '/auth/register') {
      body.name = nameRef.current.value;
    }

    fetch(`/api${pathname}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        setToken(data.token);
        router.push('/');
    });
  }

  return (
    <>
    <section className="grid grid-cols-5">
      <div className="col-span-3 w-full h-screen flex mx-0 items-center">
        <Lottie 
        options={defaultOptions}
          height={400}
          width={400}
        />
      </div>
      <div className="col-span-2 bg-white/10 flex justify-center flex-col h-screen w-full mx-0 p-16 shadow-md shadow-slate-100">
        <h1 className="text-3xl text-center">{pathname === "/auth/login" ? "Login" : "Register"}</h1>
        <p className="text-md text-center w-4/5 mx-auto mt-2 mb-6">Lorem ipsum dolor, obcaecati adipisci iusto quos dele. de mua ti leste.</p>
        <form onSubmit={authenticate}>
          {
            pathname === '/auth/register' &&
            <>
              <label htmlFor="name">Name</label>
              <input type="name" name="name" id="name" ref={nameRef} className="text-black w-full rounded bg-slate-200 p-2 mb-4" />
            </>
          }
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" ref={emailRef} className="text-black w-full rounded bg-slate-200 p-2 mb-4" />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" ref={passwordRef} className="text-black w-full rounded bg-slate-200 p-2 mb-4" />
          <button type="submit" className="w-full rounded bg-slate-600 p-2 mb-4 hover:bg-slate-700">{pathname === '/auth/login' ? 'Login' : 'Register'}</button>
          <div className="flex justify-between">
            <Link href="/auth/forgotpassword" className="text-slate-300 hover:text-slate-400">Forgot Password?</Link>
            <Link href={pathname === '/auth/login' ? '/auth/register' : '/auth/login'} className="text-slate-300 hover:text-slate-400">{pathname === '/auth/login' ? "Register" : "Login"}</Link>
          </div>
          <hr className="my-4"></hr>
        </form>
      </div>
    </section>
    <Link href="/" className="absolute left-6 top-6 bg-[url('/img/return.png')] h-6 w-6 bg-contain"></Link>
    </>
  );
}

export default Authentication;