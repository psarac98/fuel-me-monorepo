import { Button } from "@fuel-me/ui";
import { useGetUsersQuery } from "./features/users/services";

export function App() {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();

  return (
    <div className="min-h-screen bg-slate-900 p-8 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold text-orange-400">
          Dispatcher
        </h1>
        <p className="mb-8 text-slate-400">Fuel.me Dispatch Console</p>

        <div className="rounded-xl bg-slate-800 p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Users</h2>

          {error && (
            <p className="mb-4 text-red-400">Failed to load users</p>
          )}

          {isLoading && <p className="text-slate-500">Loading...</p>}

          {users && (
            <div className="space-y-2 text-sm">
              {users.length === 0 && (
                <p className="text-slate-500">No users yet</p>
              )}
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg bg-slate-700 p-3"
                >
                  <div>
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-slate-400">{user.email}</p>
                  </div>
                  <span className="rounded-full bg-orange-900 px-2 py-1 text-xs text-orange-300">
                    {user.role}
                  </span>
                </div>
              ))}
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
