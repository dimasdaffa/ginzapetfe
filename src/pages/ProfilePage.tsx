import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  name: string;
  email: string;
}

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      navigate('/login'); // Redirect if no user is logged in
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  if (!currentUser) {
    return (
      <main className="relative min-h-screen mx-auto w-full max-w-[640px] bg-[#F4F5F7] flex flex-col items-center justify-center px-5">
        <p>Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen mx-auto w-full bg-[#F4F5F7] flex flex-col items-center justify-center px-5">
      <div id="Background" className="absolute left-0 right-0 top-0 h-full">
        <img
          src="/assets/images/backgrounds/orange.png"
          alt="background"
          className="h-1/2 w-full object-cover object-bottom"
        />
      </div>
      <section className="relative z-10 flex flex-col gap-5 p-5 bg-white rounded-3xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center">Your Profile</h1>
        <div className="flex flex-col gap-3">
          <p className="text-lg">
            <span className="font-semibold">Name:</span> {currentUser.name}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Email:</span> {currentUser.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 w-full rounded-full bg-red-500 py-[14px] font-semibold text-white transition-all duration-300 hover:bg-red-600"
        >
          Logout
        </button>
        <button
          onClick={() => navigate('/')}
          className="mt-2 w-full rounded-full border border-ginzapet-orange py-[14px] font-semibold text-ginzapet-orange transition-all duration-300 hover:bg-ginzapet-orange hover:text-white"
        >
          Back to Home
        </button>
      </section>
    </main>
  );
}