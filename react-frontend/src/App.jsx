import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import { useAuthInit } from "./hooks/useAuthInit";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";

export default function App() {
  useAuthInit();

  return (
    <div className="app">
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet />
      </Suspense>
    </div>
  );
}
