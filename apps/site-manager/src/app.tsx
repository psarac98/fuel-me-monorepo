import { Button } from "@fuel-me/ui";
import { useGetHealthQuery } from "./services/health";

export function App() {
  const { data: health, isLoading, error, refetch } = useGetHealthQuery();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Site Manager
        </h1>
        <p className="mb-8 text-gray-500">Fuel.me Management Dashboard</p>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">API Health Check</h2>

          {error && (
            <p className="mb-4 text-red-600">Failed to reach the API</p>
          )}

          {isLoading && <p className="text-gray-400">Checking...</p>}

          {health && (
            <div className="space-y-2 text-sm">
              <p className="text-lg font-medium text-green-600">
                Hello World, the API is working!
              </p>
              <p className="text-gray-500">
                Database: {health.database.connected ? "Connected" : "Disconnected"}
              </p>
            </div>
          )}

          <Button className="mt-4" onClick={refetch}>
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}
