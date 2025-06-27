import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function SignUp() {
  const { signup, login } = useWallet();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be 6+ characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    axios.get("http://localhost:8080/user/")
    .then((res)=>{
      const userId = res.data.body[0]
      const accountid = res.data.body[1]
      axios.post("http://localhost:8080/user/save-user",{
        "firstName": formData.firstName,
        "lastName": formData.lastName,
        "email": formData.email,
        "password": formData.password,
        "userAccountId": accountid,
        "userId": userId
      })
      .then(
        login(formData.email, formData.password)
      )
      .catch((err)=>{
        setErrors({ email: 'Email already exists' });
      })
    })
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 p-4">
      <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Create PayWallet Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl" />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl" />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className="w-full pr-12 pl-4 py-3 border rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account? <Link to="/signin" className="text-blue-600 font-semibold">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
