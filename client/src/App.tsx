import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import GitLearningTool from "@/pages/GitLearningTool";
import { GitProvider } from "@/context/GitContext";
import { LessonProvider } from "@/context/LessonContext";

/**
 * Fixed provider structure to avoid circular dependency issues between 
 * GitProvider and LessonProvider. Both providers need to be at the same level
 * in the component tree to allow proper communication between them.
 */

// Both providers are at the same level - no circular dependency
const GitLearningToolWithProviders = () => {
  return (
    <GitProvider>
      <LessonProvider>
        <GitLearningTool />
      </LessonProvider>
    </GitProvider>
  );
};

function Router() {
  return (
    <Switch>
      <Route path="/" component={GitLearningToolWithProviders} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Wrap the entire app with both providers at the same level */}
      <GitProvider>
        <LessonProvider>
          <AppContent />
        </LessonProvider>
      </GitProvider>
    </QueryClientProvider>
  );
}

// This component is created to consume context after providers are set up
function AppContent() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
