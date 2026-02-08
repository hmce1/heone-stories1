"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { LogOut, RefreshCw, CheckCircle, XCircle, Clock, Package } from "lucide-react";

interface Order {
  id: string;
  fullName: string;
  whatsappNumber: string;
  country: string;
  city: string;
  proposedNovelTitle: string | null;
  whyWriteNovel: string | null;
  voiceMessagePreferred: boolean;
  packageName: string;
  price: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export default function AdminPanel() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (session) {
      fetchOrders();
    }
  }, [session, filterStatus, page]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError("اسم المستخدم أو كلمة المرور غير صحيحة");
      } else {
        setPassword("");
      }
    } catch (error) {
      setError("حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setOrders([]);
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append("status", filterStatus);
      params.append("page", page.toString());
      const res = await fetch(`/api/orders?${params}`);
      const data = await res.json();
      setOrders(data.orders || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "CANCELLED":
        return <XCircle className="w-5 h-5 text-red-400" />;
      case "PROCESSING":
        return <RefreshCw className="w-5 h-5 text-yellow-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-900/30 border-green-700";
      case "CANCELLED":
        return "bg-red-900/30 border-red-700";
      case "PROCESSING":
        return "bg-yellow-900/30 border-yellow-700";
      default:
        return "bg-gray-900/30 border-gray-700";
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-emerald-950 flex items-center justify-center">
        <div className="text-gold">جاري التحميل...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-emerald-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-emerald-900 p-8 rounded-2xl border border-emerald-800 shadow-xl">
          <h2 className="text-2xl font-bold text-gold mb-6 text-center">تسجيل الدخول للمدير</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-emerald-100">اسم المستخدم</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-3 rounded bg-emerald-800 border border-emerald-700 focus:border-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-emerald-100">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 rounded bg-emerald-800 border border-emerald-700 focus:border-gold outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 p-4 bg-gold text-emerald-950 font-bold text-lg rounded-lg hover:bg-yellow-500 transition disabled:opacity-70"
            >
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gold">لوحة التحكم - الطلبات</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-900/50 border border-red-700 text-red-200 rounded-lg hover:bg-red-900/70 transition"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>
        </div>

        {/* Filters */}
        <div className="bg-emerald-900 p-4 rounded-lg border border-emerald-800 mb-6">
          <div className="flex gap-4 items-center flex-wrap">
            <label className="text-emerald-100">فلترة حسب الحالة:</label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 rounded bg-emerald-800 border border-emerald-700 text-emerald-100 focus:border-gold outline-none"
            >
              <option value="">الكل</option>
              <option value="PENDING">قيد الانتظار</option>
              <option value="PROCESSING">قيد المعالجة</option>
              <option value="COMPLETED">مكتمل</option>
              <option value="CANCELLED">ملغي</option>
            </select>
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-800 border border-emerald-700 text-emerald-100 rounded hover:bg-emerald-700 transition"
            >
              <RefreshCw className="w-4 h-4" />
              تحديث
            </button>
          </div>
        </div>

        {/* Orders List */}
        {loadingOrders ? (
          <div className="text-center text-gold py-12">جاري التحميل...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-emerald-200 py-12">لا توجد طلبات</div>
        ) : (
          <>
            <div className="grid gap-4 mb-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className={`bg-emerald-900 p-6 rounded-lg border ${getStatusColor(order.status)}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="text-xl font-bold text-gold">{order.fullName}</h3>
                        <p className="text-sm text-emerald-200">
                          {new Date(order.createdAt).toLocaleDateString("ar-SA", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-gold" />
                      <span className="text-gold font-bold">{order.packageName}</span>
                      <span className="text-emerald-200">-</span>
                      <span className="text-emerald-200">{order.price}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-emerald-300">رقم الواتساب:</span>
                      <span className="text-emerald-100 mr-2">{order.whatsappNumber}</span>
                    </div>
                    <div>
                      <span className="text-emerald-300">المدينة:</span>
                      <span className="text-emerald-100 mr-2">{order.city}</span>
                    </div>
                    <div>
                      <span className="text-emerald-300">الدولة:</span>
                      <span className="text-emerald-100 mr-2">{order.country}</span>
                    </div>
                    <div>
                      <span className="text-emerald-300">رسالة صوتية:</span>
                      <span className="text-emerald-100 mr-2">
                        {order.voiceMessagePreferred ? "نعم" : "لا"}
                      </span>
                    </div>
                    {order.proposedNovelTitle && (
                      <div className="md:col-span-2">
                        <span className="text-emerald-300">عنوان الرواية المقترح:</span>
                        <span className="text-emerald-100 mr-2">{order.proposedNovelTitle}</span>
                      </div>
                    )}
                    {order.whyWriteNovel && (
                      <div className="md:col-span-2">
                        <span className="text-emerald-300">لماذا يريد كتابة الرواية:</span>
                        <p className="text-emerald-100 mt-1">{order.whyWriteNovel}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <span className="text-emerald-300 text-sm">تغيير الحالة:</span>
                    {["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(order.id, status)}
                        className={`px-3 py-1 rounded text-xs font-medium transition ${
                          order.status === status
                            ? "bg-gold text-emerald-950"
                            : "bg-emerald-800 text-emerald-100 hover:bg-emerald-700"
                        }`}
                      >
                        {status === "PENDING" && "قيد الانتظار"}
                        {status === "PROCESSING" && "قيد المعالجة"}
                        {status === "COMPLETED" && "مكتمل"}
                        {status === "CANCELLED" && "ملغي"}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-emerald-800 border border-emerald-700 text-emerald-100 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-700"
                >
                  السابق
                </button>
                <span className="px-4 py-2 text-emerald-100">
                  صفحة {page} من {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-emerald-800 border border-emerald-700 text-emerald-100 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-700"
                >
                  التالي
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
