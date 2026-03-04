import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  // Not logged in
  if (!session) {
    redirect("/login");
  }

  // Not admin
  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-orange-500">
          Admin Dashboard
        </h2>
        <p className="text-gray-500">
          Welcome, {session.user.name}
        </p>
      </div>

      {children}
    </div>
  );
}