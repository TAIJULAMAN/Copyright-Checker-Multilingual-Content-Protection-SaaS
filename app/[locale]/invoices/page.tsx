"use client";

import { useGetInvoicesQuery } from "@/redux/api/userApi";
import { useTranslations } from "next-intl";
import { Loader2, Download, FileText, Search, Calendar, CreditCard, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { BASE_URL } from "@/redux/api/config";

interface Invoice {
  _id: string;
  invoice_number: string;
  invoice_date: string;
  product_name: string;
  gross_amount: number;
  currency: string;
}

export default function InvoicesPage() {
  const t = useTranslations("Invoices");
  const { data: invoicesResponse, isLoading, isError } = useGetInvoicesQuery(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  const invoices: Invoice[] = invoicesResponse?.data?.invoices || [];

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = async (invoiceId: string, invoiceNumber: string) => {
    try {
      const response = await fetch(`${BASE_URL}/users/invoices/download/${invoiceId}`, {
      });

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rechnung_${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading invoice:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-2">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Oops! Something went wrong</h2>
        <p className="text-gray-500 max-w-xs">We couldn't load your invoices. Please try again later or contact support.</p>
        <Button onClick={() => window.location.reload()} className="bg-purple-600 hover:bg-purple-700">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{t("title")}</h1>
          <p className="text-gray-500">{t("description")}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by invoice # or product..."
                className="pl-10 h-11 bg-gray-50 border-transparent focus:bg-white focus:ring-purple-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("invoiceNumber")}</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("date")}</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("product")}</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{t("amount")}</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">{t("download")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                            <FileText className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-gray-900 font-mono">#{invoice.invoice_number}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(invoice.invoice_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-medium text-gray-900">{invoice.product_name}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 font-bold text-gray-900">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          {invoice.gross_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {invoice.currency}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-purple-600 hover:bg-purple-50 hover:text-purple-700 h-10 px-4 rounded-xl"
                          onClick={() => handleDownload(invoice._id, invoice.invoice_number)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {t("download")}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-12 h-12 text-gray-200" />
                        <p className="text-lg font-medium text-gray-900">{t("noInvoices")}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden divide-y divide-gray-100">
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <div key={invoice._id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t("invoiceNumber")}</p>
                        <p className="text-base font-bold text-gray-900 font-mono">#{invoice.invoice_number}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t("amount")}</p>
                      <p className="text-base font-bold text-gray-900">
                        {invoice.gross_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {invoice.currency}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t("date")}</p>
                      <p className="text-sm text-gray-700 font-medium">
                        {new Date(invoice.invoice_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t("product")}</p>
                      <p className="text-sm text-gray-700 font-medium line-clamp-1">
                        {invoice.product_name}
                      </p>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-purple-100 flex items-center justify-center gap-2 transition-all active:scale-95"
                    onClick={() => handleDownload(invoice._id, invoice.invoice_number)}
                  >
                    <Download className="w-5 h-5" />
                    {t("download")} PDF
                  </Button>
                </div>
              ))
            ) : (
              <div className="px-6 py-20 text-center text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <FileText className="w-12 h-12 text-gray-200" />
                  <p className="text-lg font-medium text-gray-900">{t("noInvoices")}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
