"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import Swal from "sweetalert2";
import { Search } from "lucide-react";
import RoleDropdown from "@/components/admin/RoleDropdown";
import AccountStatusDropdown from "@/components/admin/AccountStatusDropdown";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role: newRole }),
    });
    fetchUsers();
  };

  const handleStatusChange = async (id, newStatus) => {
    let reason = "Action taken by Administrator.";

    if (newStatus === "Suspended" || newStatus === "Banned") {
      const { value: formValues } = await Swal.fire({
        title: `${t("setStatusTitle")} ${newStatus}?`,
        input: "text",
        inputLabel: t("reasonForAction"),
        inputPlaceholder: t("violationPlaceholder"),
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return t("provideReasonWarning");
          }
        }
      });

      if (!formValues) return;
      reason = formValues;
    }

    await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, accountStatus: newStatus, statusReason: reason }),
    });
    fetchUsers();
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: t("areYouSure"),
      text: t("cannotRevert"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("confirmDeleteBtn")
    });

    if (result.isConfirmed) {
      await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchUsers();
      Swal.fire(t("deletedSuccessTitle"), t("userDeletedSuccessMessage"), "success");
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">
            {t("usersManagement")}
            </h2>
            <p className="text-gray-500 text-sm mt-1">{t("manageUserDescription")}</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder={t("searchUsersPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <span className="text-sm text-orange-600 font-bold bg-orange-50 px-4 py-2 rounded-lg border border-orange-100 whitespace-nowrap">
            {filteredUsers.length} {t("usersCountLabel")}
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto sm:overflow-visible min-h-[400px] bg-white border border-gray-100 rounded-xl shadow-sm">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-4 px-5 font-semibold text-gray-600 text-sm">{t("tableUserDetails")}</th>
              <th className="py-4 px-5 font-semibold text-gray-600 text-sm w-48">{t("tableRole")}</th>
              <th className="py-4 px-5 font-semibold text-gray-600 text-sm w-48">{t("tableAccountStatus")}</th>
              <th className="py-4 px-5 font-semibold text-gray-600 text-sm text-right">{t("tableActions")}</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                className="border-b border-gray-50 hover:bg-gray-50/80 transition duration-200"
              >
                <td className="py-4 px-5">
                  <p className="font-bold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </td>

                <td className="py-4 px-5 align-middle">
                  <RoleDropdown 
                    currentRole={user.role} 
                    userId={user._id} 
                    onRoleChange={handleRoleChange} 
                  />
                </td>

                <td className="py-4 px-5 align-middle">
                  <AccountStatusDropdown 
                    currentStatus={user.accountStatus} 
                    userId={user._id} 
                    onStatusChange={handleStatusChange} 
                  />
                  {user.statusReason && user.accountStatus !== "Active" && (
                      <p className="text-[10px] text-gray-500 mt-1.5 max-w-[150px] truncate" title={user.statusReason}>
                          {t("reasonPrefix")} {user.statusReason}
                      </p>
                  )}
                </td>

                <td className="py-4 px-5 text-right align-middle">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-white hover:bg-red-50 text-red-500 border border-red-200 font-semibold text-sm px-4 py-2.5 rounded-xl transition duration-200 cursor-pointer shadow-sm"
                  >
                    {t("btnDelete")}
                  </button>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-16 text-gray-500 font-medium"
                >
                  {t("noUsersFoundSearch")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}