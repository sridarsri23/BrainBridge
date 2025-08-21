export default function TestPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-green-600 mb-4">
        ✅ Frontend Routing Works!
      </h1>
      <p className="text-lg text-gray-700">
        This confirms that the React app is loading and routing is functional.
      </p>
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Debug Info:</h2>
        <p>Current URL: {window.location.href}</p>
        <p>Pathname: {window.location.pathname}</p>
        <p>Timestamp: {new Date().toISOString()}</p>
      </div>
    </div>
  );
}