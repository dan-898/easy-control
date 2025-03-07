import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/LoginForm';
import AuthLayout from '../layouts/AuthLayout';

const Login = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <AuthLayout>
        <div style={{ textAlign: 'center', color: '#4a5568' }}>
          <h2>Loading...</h2>
        </div>
      </AuthLayout>
    );
  }

  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;