import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { GitProvider } from "./context/GitContext";
import { LessonProvider } from "./context/LessonContext";

createRoot(document.getElementById("root")!).render(
  <GitProvider>
    <LessonProvider>
      <App />
    </LessonProvider>
  </GitProvider>
);
