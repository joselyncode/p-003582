
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-6">Página no encontrada</p>
        <p className="text-gray-500 mb-6">
          La ruta <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{location.pathname}</span> no existe.
        </p>
        <Link to="/" className="inline-flex items-center text-blue-500 hover:text-blue-700 underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
