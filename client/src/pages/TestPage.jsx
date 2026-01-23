import React from 'react';

function TestPage() {
  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ color: '#333', marginBottom: '1rem' }}>
        🎉 Page Loading Test - SUCCESS!
      </h1>
      <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '2rem' }}>
        If you can see this page, the frontend is working correctly.
      </p>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '600px'
      }}>
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>
          Browser Element Blocking Fix
        </h2>
        
        <div style={{ textAlign: 'left', lineHeight: '1.6' }}>
          <h3 style={{ color: '#555' }}>Quick Solutions:</h3>
          <ol style={{ color: '#666' }}>
            <li><strong>Hard Refresh:</strong> Press Ctrl + F5 (Windows) or Cmd + Shift + R (Mac)</li>
            <li><strong>Clear Cache:</strong> Press Ctrl + Shift + Delete, clear cached files</li>
            <li><strong>Incognito Mode:</strong> Open a new incognito/private window</li>
            <li><strong>Different Browser:</strong> Try Chrome, Firefox, or Edge</li>
          </ol>
          
          <h3 style={{ color: '#555', marginTop: '1.5rem' }}>Navigation Links:</h3>
          <div style={{ marginTop: '1rem' }}>
            <a href="/recruiter/register" style={{ 
              display: 'inline-block',
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              margin: '0.25rem'
            }}>
              Recruiter Register
            </a>
            <a href="/login" style={{ 
              display: 'inline-block',
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              margin: '0.25rem'
            }}>
              Login
            </a>
            <a href="/" style={{ 
              display: 'inline-block',
              padding: '0.5rem 1rem',
              backgroundColor: '#6c757d',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              margin: '0.25rem'
            }}>
              Home
            </a>
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#999' }}>
        Current URL: {window.location.href}
      </div>
    </div>
  );
}

export default TestPage;