import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'reset'>('login')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      setLoading(false)

      if (error) {
        setError(error.message)
      } else {
        navigate('/dash')
      }
    } else {
      if (!email) {
        setLoading(false)
        setError('Enter your email to receive a reset link')
        return
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      setLoading(false)

      if (error) {
        setError(error.message)
      } else {
        setMessage('Password reset email sent. Please check your inbox.')
      }
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('./your-background.jpg')" }}
    >
      <div className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl rounded-xl p-8 w-full max-w-md mx-4">
        {/* Logo */}
        <img src="./tradefiylogo.png" alt="TraDify Logo" className="mx-auto h-44 mb-2" />

        <h2 className="text-2xl font-bold text-center mb-1">
          {mode === 'login' ? 'Sign In' : 'Reset Password'}
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          {mode === 'login'
            ? 'Welcome back! Please enter your credentials to continue.'
            : 'Enter your email to receive a reset link.'}
        </p>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {message && <p className="text-green-600 text-sm mb-3">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. example@email.com"
              className="w-full px-3 py-2 border rounded mt-1"
            />
          </div>

          {mode === 'login' && (
            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border rounded mt-1 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="text-right mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('reset')
                    setError(null)
                    setMessage(null)
                  }}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading
              ? mode === 'login'
                ? 'Signing In...'
                : 'Sending...'
              : mode === 'login'
              ? 'Login'
              : 'Send Reset Link'}
          </button>
        </form>

        {mode === 'login' ? (
          <p className="text-sm text-center mt-4 text-gray-700">
            Don't have an account?{' '}
            <Link to="/create" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        ) : (
          <p className="text-sm text-center mt-4 text-gray-700">
            Remembered your password?{' '}
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={() => {
                setMode('login')
                setError(null)
                setMessage(null)
              }}
            >
              Back to login
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
