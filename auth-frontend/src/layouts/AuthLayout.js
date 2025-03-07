import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e6f7e6 0%, #ffffff 100%)',
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        padding: '3rem',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '1rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#2f855a',
            marginBottom: '0.5rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          }}></h1>
          <p style={{ 
            color: '#38a169',
            fontSize: '1.25rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}></p>
        </div>
        <div style={{
          position: 'relative',
          zIndex: 1,
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;