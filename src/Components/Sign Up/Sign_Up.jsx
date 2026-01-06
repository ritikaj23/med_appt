import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sign_Up.css';
import { API_URL } from '../../config';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'phone') {
      if (value.length !== 10 || !/^\d+$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          phone: 'Phone number must be 10 digits',
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          phone: '',
        }));
      }
    }

    if (name === 'password' && value.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: 'Password must be at least 8 characters',
      }));
    } else if (name === 'password') {
      setErrors((prev) => ({
        ...prev,
        password: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (formData.password.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: 'Password must be at least 8 characters',
      }));
      return;
    }

    if (!errors.phone && !errors.password) {
      try {
        console.log("Sending data:", formData);
        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const json = await response.json();
        console.log("Response JSON:", json);

        if (json.authtoken) {
          sessionStorage.setItem("auth-token", json.authtoken);
          sessionStorage.setItem("name", formData.name);
          sessionStorage.setItem("phone", formData.phone);
          sessionStorage.setItem("email", formData.email);

          navigate("/");
        } else if (json.error && Array.isArray(json.error)) {
          const newErrors = {};
          json.error.forEach((err) => {
            newErrors[err.param] = err.msg;
          });
          setErrors((prev) => ({
            ...prev,
            ...newErrors,
          }));
        } else if (json.error) {
          // Generic error fallback
          setErrors((prev) => ({
            ...prev,
            general: typeof json.error === 'string' ? json.error : 'Something went wrong',
          }));
        }
      } catch (error) {
        console.error('Failed to fetch:', error);
        setErrors((prev) => ({
          ...prev,
          general: 'Network error. Please try again later.',
        }));
      }
    }
  };

  return (
    <div className="container" style={{ marginTop: '5%' }}>
      <div className="signup-grid">
        <div className="signup-text">
          <h1>Sign Up</h1>
        </div>
        <div className="signup-text1" style={{ textAlign: 'left' }}>
          Already a member? <span><Link to="/login" style={{ color: '#2190FF' }}>Login</Link></span>
        </div>

        {errors.general && <div className="alert alert-danger">{errors.general}</div>}

        <div className="signup-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" name="name" id="name" required className="form-control" placeholder="Enter your name" value={formData.name} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input type="tel" name="phone" id="phone" required className="form-control" placeholder="Enter your phone number" value={formData.phone} onChange={handleChange} />
              {errors.phone && <small className="text-danger">{errors.phone}</small>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" required className="form-control" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
              {errors.email && <small className="text-danger">{errors.email}</small>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" id="password" required className="form-control" placeholder="Enter your password" value={formData.password} onChange={handleChange} />
              {errors.password && <small className="text-danger">{errors.password}</small>}
            </div>

            <div className="btn-group">
              <button type="submit" className="btn btn-primary mb-2 mr-1">Submit</button>
              <button type="reset" className="btn btn-danger mb-2" onClick={() => {
                setFormData({ name: '', phone: '', email: '', password: '' });
                setErrors({});
              }}>Reset</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
