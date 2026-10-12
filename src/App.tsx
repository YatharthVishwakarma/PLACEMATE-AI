import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { storage } from './lib/localStorage';
import AppLayout from './components/Layout/AppLayout';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import CareerRoadmap from './pages/CareerRoadmap';
import ResumeAI from './pages/ResumeAI';
import MockInterview from './pages/MockInterview';
import DSATracker from './pages/DSATracker';
import SkillAssessments from './pages/SkillAssessments';
import ProgressAnalytics from './pages/ProgressAnalytics';
import Profile from './pages/Profile';

function RequireProfile({ children }: { children: React.ReactNode }) {
  const profile = storage.getProfile();
  if (!profile?.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route
          element={
            <RequireProfile>
              <AppLayout />
            </RequireProfile>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/roadmap" element={<CareerRoadmap />} />
          <Route path="/resume" element={<ResumeAI />} />
          <Route path="/interview" element={<MockInterview />} />
          <Route path="/dsa" element={<DSATracker />} />
          <Route path="/assessments" element={<SkillAssessments />} />
          <Route path="/analytics" element={<ProgressAnalytics />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
