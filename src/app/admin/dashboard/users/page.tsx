import { getUsers } from "@/lib/actions/user-actions";
import { UsersClientPage } from "./_components/users-client-page";

export default async function AdminUsersPage() {
  const users = await getUsers();
  return <UsersClientPage users={users} />;
}
