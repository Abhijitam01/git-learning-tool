import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-6">404</h1>
      <p className="text-2xl font-medium text-gray-600 mb-6">Page not found</p>
      <p className="text-gray-500 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <Button className="px-6">Go back home</Button>
      </Link>
    </div>
  );
}