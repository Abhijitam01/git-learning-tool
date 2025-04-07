import { GitProvider } from './context/GitContext';
import { LessonProvider } from './context/LessonContext';
import { Route, Switch } from 'wouter';
import GitLearningTool from './pages/GitLearningTool';
import NotFound from './pages/not-found';
import { Toaster } from '@/components/ui/toaster';

function Router() {
  return (
    <Switch>
      <Route path="/" component={GitLearningTool} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <GitProvider>
      <LessonProvider>
        <AppContent />
      </LessonProvider>
    </GitProvider>
  );
}

function AppContent() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;