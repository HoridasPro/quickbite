import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  // Not logged in
  if (!session) {
    redirect("/login");
  }

  // Not admin
  if (session.user.role !== "admin") {
    // redirect("/");
  }

  return (
    <div>
      {/* Client Component handles the translation dynamically */}
      <AdminHeader userName={session.user.name} />

      {children}
    </div>
  );
}