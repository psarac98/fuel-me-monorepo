import { Button } from "@fuel-me/ui";
import { useGetUsersQuery } from "./features/users/services";

export function App() {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Site Manager
        </h1>
        <p className="mb-8 text-gray-500">Fuel.me Management Dashboard</p>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Users</h2>

          {error && (
            <p className="mb-4 text-red-600">Failed to load users</p>
          )}

          {isLoading && <p className="text-gray-400">Loading...</p>}

          {users && (
            <div className="space-y-2 text-sm">
              {users.length === 0 && (
                <p className="text-gray-400">No users yet</p>
              )}
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                >
                  <div>
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-gray-500">{user.email}</p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                    {user.role}
                  </span>
                </div>
              ))}
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
