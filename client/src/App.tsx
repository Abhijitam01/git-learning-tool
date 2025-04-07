import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import GitLearningTool from "@/pages/GitLearningTool";
import { GitProvider } from "@/context/GitContext";
import { LessonProvider } from "@/context/LessonContext";

/**
 * Important: To avoid circular dependency issues between GitContext and LessonContext,
 * we need to ensure the providers are structured correctly. GitProvider must wrap LessonProvider
 * since LessonContext depends on GitContext for step validation.
 */

// Wrap the GitLearningTool component with both providers
const HomeRoute = () => (
  <GitProvider>
    <LessonProvider>
      <GitLearningTool />
    </LessonProvider>
  </GitProvider>
);

// Simple router
const AppRouter = () => (
  <Switch>
    <Route path="/" component={HomeRoute} />
    <Route component={NotFound} />
  </Switch>
);

// Main App component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;