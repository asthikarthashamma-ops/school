import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// Pre-defined demo credentials
const DEMO_USERS = {
  admin: {
    username: 'admin@school.com',
    password: 'admin123',
    role: 'admin',
    name: 'Sarah Jenkins',
    title: 'School Administrator',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  },
  teacher: {
    username: 'teacher@school.com',
    password: 'teacher123',
    role: 'teacher',
    name: 'Robert Carter',
    title: 'Senior Mathematics Head',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  student: {
    username: 'student@school.com',
    password: 'student123',
    role: 'student',
    name: 'Jane Doe',
    title: 'Grade 10-A (Roll: 104)',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
  },
  parent: {
    username: 'parent@school.com',
    password: 'parent123',
    role: 'parent',
    name: 'David Doe',
    title: 'Parent (Jane Doe)',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('school_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [error, setError] = useState('');

  const login = async (username, password, role) => {
    setError('');
    const demoUser = DEMO_USERS[role];

    if (demoUser && demoUser.username === username && demoUser.password === password) {
      const loggedUser = {
        username: demoUser.username,
        role: demoUser.role,
        name: demoUser.name,
        title: demoUser.title,
        photo: demoUser.photo,
        refId: role === 'student' ? 'stud-104' : role === 'teacher' ? 'teach-101' : role === 'parent' ? 'parent-201' : 'admin-01'
      };
      setUser(loggedUser);
      localStorage.setItem('school_user', JSON.stringify(loggedUser));
      return { success: true };
    } else {
      setError('Invalid email, password, or portal mismatch.');
      return { success: false, message: 'Invalid credentials.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('school_user');
  };

  const requestPasswordReset = (username, email) => {
    // Simulated Password Reset API call
    return `Reset link has been dispatched to ${email}. Check your inbox.`;
  };

  return (
    <AuthContext.Provider value={{ user, error, login, logout, requestPasswordReset, setError }}>
      {children}
    </AuthContext.Provider>
  );
};
