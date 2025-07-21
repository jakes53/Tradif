import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { Eye, EyeOff } from 'lucide-react'

const getPasswordRequirements = (password: string) => {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }
}

export default function CreateAccount() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (name === 'password') {
      setPasswordChecks(getPasswordRequirements(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const { firstName, lastName, email, password, confirmPassword } = formData

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      alert('Check your email for a confirmation link.')
      navigate('/')
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('./your-background.jpg')" }}
    >
      <div className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl rounded-xl p-4 w-full max-w-md mx-4">
        {/* Logo */}
        <img src="./tradefiylogo.png" alt="TraDify Logo" className="mx-auto h-44 mb-0" />

        <h2 className="text-2xl font-bold text-center mb-1">Create Account</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your details below to create your account
        </p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="Jeffrey"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Couture"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter secure password"
                required
                value={formData.password}
                onChange={handleChange}
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

            <ul className="text-xs text-gray-700 mt-2 space-y-1">
              <li className={passwordChecks.length ? 'text-green-600' : ''}>
                • At least 8 characters
              </li>
              <li className={passwordChecks.uppercase ? 'text-green-600' : ''}>
                • One uppercase letter
              </li>
              <li className={passwordChecks.lowercase ? 'text-green-600' : ''}>
                • One lowercase letter
              </li>
              <li className={passwordChecks.number ? 'text-green-600' : ''}>
                • One number
              </li>
              <li className={passwordChecks.specialChar ? 'text-green-600' : ''}>
                • One special character
              </li>
            </ul>
          </div>

          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Repeat password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded mt-1 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-xs text-center mt-4 text-gray-600">
  By registering, you agree to our{' '}
  <Link to="/terms" className="underline text-blue-600 hover:text-blue-800">
    Terms of Service
  </Link>{' '}
  and{' '}
  <Link to="/privacy" className="underline text-blue-600 hover:text-blue-800">
    Privacy Policy
  </Link>.
</p>


        <p className="text-sm text-center mt-3 text-gray-700">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
} 