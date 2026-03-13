"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Map from "@/components/Map";
import Swal from "sweetalert2";
import AddressDropdown from "@/components/checkout/AddressDropdown";
import { useTranslation } from "@/hooks/useTranslation";

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { t, language } = useTranslation();
  const isBn = language === "bn";

  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [mapPosition, setMapPosition] = useState([23.8103, 90.4125]);
  const [orderId] = useState(() => `ORD-${Date.now()}`);

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    apartment: "",
    note: "",
    email: "",
    firstName: "",
    lastName: "",
    mobile: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: prev.email || session.user.email || "",
        firstName: prev.firstName || session.user.name?.split(" ")[0] || "",
        lastName: prev.lastName || session.user.name?.split(" ").slice(1).join(" ") || "",
      }));

      fetch(`/api/users/addresses?email=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.addresses.length > 0) {
            setSavedAddresses(data.addresses);
            setSelectedAddressId(data.addresses[0]._id);
            setFormData((prev) => ({
              ...prev,
              street: data.addresses[0].address,
              city: data.addresses[0].city || "",
            }));
          }
        })
        .catch((err) => console.error(err));
    }
  }, [session]);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCustomAddressSelect = (addr) => {
    setSelectedAddressId(addr._id);
    setFormData((prev) => ({
      ...prev,
      street: addr.address,
      city: addr.city || "",
    }));
  };

  const handleLocationSelect = async (lat, lng) => {
    setMapPosition([lat, lng]);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data && data.address) {
        setFormData((prev) => ({
          ...prev,
          street: data.address.road || data.address.suburb || data.display_name.split(",")[0],
          city: data.address.city || data.address.state || data.address.county || "",
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckoutRedirect = async () => {
    if (cartItems.length === 0) {
      Swal.fire(t("emptyCartAlert"), t("emptyCartMessage"), "error");
      return;
    }

    if (status === "unauthenticated" || !session?.user?.email) {
      Swal.fire(t("loginRequiredAlert"), t("loginRequiredMessage"), "info").then(() => {
        router.push("/login");
      });
      return;
    }

    setLoading(true);

    const orderData = {
      orderId: orderId,
      items: cartItems,
      totalAmount,
      customerInfo: formData,
      email: session.user.email,
      status: "Pending",
      paymentStatus: "Unpaid",
      timestamp: new Date().toISOString(),
    };

    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const savedOrder = await orderRes.json();

      if (!savedOrder.success) {
        Swal.fire(t("error"), t("failedToSaveOrder"), "error");
        setLoading(false);
        return;
      }

      const stripeRes = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: orderData }),
      });

      const data = await stripeRes.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        Swal.fire(t("error"), data.error || t("failedToInitPayment"), "error");
        setLoading(false);
      }
    } catch (error) {
      Swal.fire(t("error"), t("checkoutFailed"), "error");
      setLoading(false);
    }
  };

  if (status === "loading" || status === "unauthenticated") {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">{t("loadingSecureCheckout")}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex justify-center py-10 text-gray-800 px-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-extrabold mb-4 text-black">{t("deliveryAddressHeader")}</h2>
          
          {savedAddresses.length > 0 && (
            <AddressDropdown 
              savedAddresses={savedAddresses} 
              selectedAddressId={selectedAddressId} 
              onSelect={handleCustomAddressSelect} 
            />
          )}

          <div className="w-full h-48 rounded-xl overflow-hidden mb-2 border border-gray-300 relative z-0">
            <Map position={mapPosition} onLocationSelect={handleLocationSelect} />
          </div>
          <p className="text-xs text-gray-500 mb-4 text-right">{t("clickMapInstruction")}</p>

          <hr className="mb-4 border-gray-300" />
          <p className="font-bold mb-4 text-black">{t("deliveryDetails")}</p>
          <div className="space-y-4">
            <input type="text" name="street" value={formData.street} onChange={handleInputChange} placeholder={t("streetPlaceholder")} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-gray-600" />
            <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder={t("cityPlaceholder")} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-gray-600" />
            <input type="text" name="apartment" value={formData.apartment} onChange={handleInputChange} placeholder={t("apartmentPlaceholder")} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-gray-600" />
            <textarea rows="3" name="note" value={formData.note} onChange={handleInputChange} placeholder={t("notePlaceholder")} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black resize-none focus:outline-none focus:border-gray-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-black">{t("personalDetails")}</h2>
          <div className="space-y-4">
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder={t("emailPlaceholder")} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-gray-600" />
            <div className="flex gap-3">
              <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder={t("firstNamePlaceholder")} className="w-1/2 border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-gray-600" />
              <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder={t("lastNamePlaceholder")} className="w-1/2 border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-gray-600" />
            </div>
            <input type="text" name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder={t("mobilePlaceholder")} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-gray-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-black">{t("yourOrder")}</h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-sm">{t("cartEmpty")}</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const displayTitle = isBn && item.titleBn ? item.titleBn : item.title;

                return (
                  <div key={item.cartItemId} className="flex justify-between items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex gap-3">
                      <div className="bg-gray-100 text-gray-800 font-bold px-3 py-1 rounded-lg h-fit text-sm">{item.quantity}x</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{displayTitle}</h3>
                        {item.selectedVariations && Object.values(item.selectedVariations).map((variant, i) => {
                          if (Array.isArray(variant)) {
                            return variant.map((v, j) => {
                              const vName = isBn && v.nameBn ? v.nameBn : v.name;
                              return <p key={`${i}-${j}`} className="text-xs text-gray-500">+ {vName}</p>;
                            });
                          } else if (variant) {
                            const vName = isBn && variant.nameBn ? variant.nameBn : variant.name;
                            return <p key={i} className="text-xs text-gray-500">+ {vName}</p>;
                          }
                          return null;
                        })}
                      </div>
                    </div>
                    <div className="font-semibold text-gray-900">Tk {item.totalPrice}</div>
                  </div>
                );
              })}

              <div className="pt-4 flex justify-between items-center text-lg font-extrabold text-black">
                <span>{t("total")}</span>
                <span className="text-orange-600">Tk {totalAmount}</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-extrabold mb-4 text-black">{t("paymentHeader")}</h2>
          <p className="text-gray-600 text-sm mb-6">{t("stripeRedirectNote")}</p>
          <button onClick={handleCheckoutRedirect} disabled={loading || cartItems.length === 0} className="w-full bg-orange-600 text-white py-4 rounded-xl font-semibold disabled:bg-gray-400 hover:bg-orange-700 transition cursor-pointer">
            {loading ? t("redirectingToStripe") : `${t("proceedToPayment")} (Tk ${totalAmount})`}
          </button>
        </div>

        <p className="text-gray-600 text-sm">{t("termsConditionsAgreement")}</p>
      </div>
    </div>
  );
}