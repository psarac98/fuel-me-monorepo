import { api } from "@/app/api";
import getUsers from "./get-users";
import getUser from "./get-user";
import createUser from "./create-user";
import updateUser from "./update-user";
import deleteUser from "./delete-user";

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: getUsers(builder),
    getUser: getUser(builder),
    createUser: createUser(builder),
    updateUser: updateUser(builder),
    deleteUser: deleteUser(builder),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;

export type { UserResponseDto, CreateUserDto, UpdateUserDto } from "@fuel-me/shared-types/api";
export type { UpdateUserRequest } from "./update-user";
