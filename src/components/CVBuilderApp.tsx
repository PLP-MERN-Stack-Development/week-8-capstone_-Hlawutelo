import React, { useState, useEffect } from 'react';
import { User, CV } from '../types';
import { AuthService } from '../services/authService';
import { CVService } from '../services/cvService';
import { AuthForm } from './auth/AuthForm';

// Lazy load components for better performance
const Navigation = React.lazy(() => import('./layout/Navigation').then(module => ({ default: module.Navigation })));
const CVBuilder = React.lazy(() => import('./cv-builder/CVBuilder').then(module => ({ default: module.CVBuilder })));
const JobSearch = React.lazy(() => import('./job-search/JobSearch').then(module => ({ default: module.JobSearch })));
const CareerBlog = React.lazy(() => import('./blog/CareerBlog').then(module => ({ default: module.CareerBlog })));
const CareerGuides = React.lazy(() => import('./guides/CareerGuides').then(module => ({ default: module.CareerGuides })));

export const CVBuilderApp: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userCV, setUserCV] = useState<CV | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const [activeSection, setActiveSection] = useState('job-search');

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setIsInitializing(true);
      try {
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          // Load CV in background to avoid blocking UI
          CVService.getUserCVs(currentUser.id).then(cvs => {
            if (cvs.length > 0) {
              setUserCV(cvs[0]);
            }
          }).catch(console.warn);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
        setIsInitializing(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = AuthService.onAuthStateChange((user) => {
      setUser(user);
      if (!user) {
        setUserCV(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    
    try {
      let result;
      if (name) {
        // Sign up
        result = await AuthService.signUp(email, password, name);
      } else {
        // Sign in
        result = await AuthService.signIn(email, password);
      }

      if (result.error) {
        setIsLoading(false);
        return false;
      }

      if (result.user) {
        setUser(result.user);
        // Load CV in background
        CVService.getUserCVs(result.user.id).then(cvs => {
          if (cvs.length > 0) {
            setUserCV(cvs[0]);
          }
        }).catch(console.warn);
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  const handleLogout = async () => {
    try {
      await AuthService.signOut();
      setUser(null);
      setUserCV(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSaveCV = async (cvData: Partial<CV>) => {
    if (!user) return;
    
    setIsLoading(true);

    try {
      const savedCV = await CVService.saveCV(user.id, {
        ...cvData,
        id: userCV?.id
      });
      
      if (savedCV) {
        setUserCV(savedCV);
      }
    } catch (error) {
      console.error('Error saving CV:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (isInitializing || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{isInitializing ? 'Initializing...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onLogin={handleLogin} />;
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'job-search':
        return (
          <React.Suspense fallback={<LoadingSpinner />}>
            <JobSearch
            userCV={userCV}
            userId={user.id}
            />
          </React.Suspense>
        );
      case 'cv-builder':
        return (
          <React.Suspense fallback={<LoadingSpinner />}>
            <CVBuilder
            initialCV={userCV}
            onSave={handleSaveCV}
            />
          </React.Suspense>
        );
      case 'blog':
        return (
          <React.Suspense fallback={<LoadingSpinner />}>
            <CareerBlog />
          </React.Suspense>
        );
      case 'guides':
        return (
          <React.Suspense fallback={<LoadingSpinner />}>
            <CareerGuides />
          </React.Suspense>
        );
      default:
        return (
          <React.Suspense fallback={<LoadingSpinner />}>
            <JobSearch
            userCV={userCV}
            userId={user.id}
            />
          </React.Suspense>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <React.Suspense fallback={<LoadingSpinner />}>
        <Navigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        user={user}
        onLogout={handleLogout}
        />
      </React.Suspense>
      {renderActiveSection()}
    </div>
  );
};