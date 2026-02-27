import { Button } from "@fuel-me/ui";
import { useGetHealthQuery } from "./services/health";

export function App() {
  const { data: health, isLoading, error, refetch } = useGetHealthQuery();

  return (
    <div className="min-h-screen bg-slate-900 p-8 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold text-orange-400">
          Dispatcher
        </h1>
        <p className="mb-8 text-slate-400">Fuel.me Dispatch Console</p>

        <div className="rounded-xl bg-slate-800 p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">API Health Check</h2>

          {error && (
            <p className="mb-4 text-red-400">Failed to reach the API</p>
          )}

          {isLoading && <p className="text-slate-500">Checking...</p>}

          {health && (
            <div className="space-y-2 text-sm">
              <p className="text-lg font-medium text-green-400">
                Hello World, the API is working!
              </p>
              <p className="text-slate-400">
                Database: {health.database.connected ? "Connected" : "Disconnected"}
              </p>
            </div>
          )}

          <Button variant="secondary" className="mt-4" onClick={refetch}>
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}
