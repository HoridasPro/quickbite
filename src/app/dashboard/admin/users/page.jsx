"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Search } from "lucide-react";
import RoleDropdown from "@/components/admin/RoleDropdown";
import AccountStatusDropdown from "@/components/admin/AccountStatusDropdown";
import DataTable from "@/components/admin/DataTable";

export default function UsersPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch Data via TanStack Query (Handles loading, caching, and background refetching automatically)
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
  });

  // 2. Mutations (Automatically refresh the table on success)
  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      return fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role }),
      });
    },
    onSuccess: () => queryClient.invalidateQueries(["users"]),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, accountStatus, statusReason }) => {
      return fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, accountStatus, statusReason }),
      });
    },
    onSuccess: () => queryClient.invalidateQueries(["users"]),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      Swal.fire(t("deletedSuccessTitle"), t("userDeletedSuccessMessage"), "success");
    },
  });

  // 3. Action Handlers
  const handleStatusChange = async (id, newStatus) => {
    let reason = "Action taken by Administrator.";
    if (newStatus === "Suspended" || newStatus === "Banned") {
      const { value: formValues } = await Swal.fire({
        title: `${t("setStatusTitle")} ${newStatus}?`,
        input: "text",
        inputLabel: t("reasonForAction"),
        inputPlaceholder: t("violationPlaceholder"),
        showCancelButton: true,
        inputValidator: (value) => !value ? t("provideReasonWarning") : undefined
      });
      if (!formValues) return;
      reason = formValues;
    }
    updateStatusMutation.mutate({ id, accountStatus: newStatus, statusReason: reason });
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
    if (result.isConfirmed) deleteMutation.mutate(id);
  };

  // 4. Define Table Columns
  const columns = [
    {
      accessorKey: "name",
      header: t("tableUserDetails"),
      cell: ({ row }) => (
        <div>
          <p className="font-bold text-gray-900">{row.original.name}</p>
          <p className="text-sm text-gray-500">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: t("tableRole"),
      cell: ({ row }) => (
        <RoleDropdown
          currentRole={row.original.role}
          userId={row.original._id}
          onRoleChange={(id, newRole) => updateRoleMutation.mutate({ id, role: newRole })}
        />
      ),
    },
    {
      accessorKey: "accountStatus",
      header: t("tableAccountStatus"),
      cell: ({ row }) => (
        <div>
          <AccountStatusDropdown
            currentStatus={row.original.accountStatus}
            userId={row.original._id}
            onStatusChange={handleStatusChange}
          />
          {row.original.statusReason && row.original.accountStatus !== "Active" && (
            <p className="text-[10px] text-gray-500 mt-1.5 max-w-[150px] truncate" title={row.original.statusReason}>
              {t("reasonPrefix")} {row.original.statusReason}
            </p>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">{t("tableActions")}</div>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <button
            onClick={() => handleDelete(row.original._id)}
            className="bg-white hover:bg-red-50 text-red-500 border border-red-200 font-semibold text-sm px-4 py-2.5 rounded-xl transition duration-200 cursor-pointer shadow-sm"
          >
            {t("btnDelete")}
          </button>
        </div>
      ),
    },
  ];

  // 5. Client-Side Filtering
  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t("usersManagement")}</h2>
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

      <DataTable 
        columns={columns} 
        data={filteredUsers} 
        isLoading={isLoading} 
        emptyMessage={t("noUsersFoundSearch")} 
      />
    </div>
  );
}