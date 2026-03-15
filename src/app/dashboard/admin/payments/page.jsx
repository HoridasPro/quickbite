"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { CreditCard, Calendar, Mail, Hash } from "lucide-react";

export default function AdminPaymentsPage() {
  const { t } = useTranslation();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/payments")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPayments(data.payments);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CreditCard className="text-orange-500" />
          {t("paymentsManagement")}
        </h2>
        <span className="text-sm text-gray-500 font-medium bg-gray-100 px-4 py-1.5 rounded-full">
          {t("total")}: {payments.length}
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="p-4 font-semibold flex items-center gap-2"><Hash size={14}/> {t("tableTransactionId")}</th>
                <th className="p-4 font-semibold"><Mail size={14} className="inline mr-2"/> {t("tableCustomer")}</th>
                <th className="p-4 font-semibold">{t("tableAmount")}</th>
                <th className="p-4 font-semibold"><Calendar size={14} className="inline mr-2"/> {t("tableDate")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-gray-400">
                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    {t("loading")}
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-gray-500 font-medium">
                    {t("noPaymentsFound")}
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <span className="font-mono text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">
                        {payment.orderId}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-700">
                      {payment.customerInfo?.email || payment.email}
                    </td>
                    <td className="p-4 font-bold text-green-600">
                      Tk {payment.totalAmount}
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(payment.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}