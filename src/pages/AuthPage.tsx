import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(`Login error: ${error.message}`);
    else setMessage('Logged in successfully!');
  };

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(`Signup error: ${error.message}`);
    else setMessage('Signed up successfully! Check your email to confirm.');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-3xl font-bold mb-4">Tradify Auth</h1>
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2 p-2 border rounded w-full max-w-sm"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 p-2 border rounded w-full max-w-sm"
      />

      <div className="flex space-x-4">
        <button onClick={handleSignup} className="bg-green-500 text-white px-4 py-2 rounded">
          Sign Up
        </button>
        <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
          Log In
        </button>
      </div>

      {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
    </div>
  );
};

export default AuthPage;
