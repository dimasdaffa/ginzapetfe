import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      navigate('/');
    } else {
      setError('Email atau password salah.');
    }
  };

  return (
    <main className="relative min-h-screen mx-auto w-full  bg-[#F4F5F7] flex flex-col items-center justify-center px-5">
      <div id="Background" className="absolute left-0 right-0 top-0 h-full">
        <img
          src="/assets/images/backgrounds/orange.png"
          alt="background"
          className="h-1/2 w-full object-cover object-bottom"
        />
      </div>
      <section className="relative z-10 flex flex-col gap-5 p-5 bg-white rounded-3xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <h4 className="font-semibold">Email Address</h4>
            <div className="relative h-[52px] w-full overflow-hidden rounded-full border border-ginzapet-graylight transition-all duration-300 focus-within:border-ginzapet-orange">
              <Mail className="absolute left-[14px] top-1/2 h-6 w-6 shrink-0 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-full w-full rounded-full pl-[50px] font-semibold leading-6 placeholder:text-[16px] placeholder:font-normal placeholder:text-ginzapet-gray focus:outline-none"
                placeholder="Enter your email"
              />
            </div>
          </label>
          <label className="flex flex-col gap-2">
            <h4 className="font-semibold">Password</h4>
            <div className="relative h-[52px] w-full overflow-hidden rounded-full border border-ginzapet-graylight transition-all duration-300 focus-within:border-ginzapet-orange">
              <Lock className="absolute left-[14px] top-1/2 h-6 w-6 shrink-0 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-full w-full rounded-full pl-[50px] font-semibold leading-6 placeholder:text-[16px] placeholder:font-normal placeholder:text-ginzapet-gray focus:outline-none"
                placeholder="Enter your password"
              />
            </div>
          </label>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-ginzapet-orange py-[14px] font-semibold text-[#d14a1e] transition-all duration-300 hover:shadow-[0px_4px_10px_0px_#D04B1E80]"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-ginzapet-orange font-semibold">
            Register here
          </Link>
        </p>
      </section>
    </main>
  );
}