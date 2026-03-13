"use client";

import { postUser } from "@/actions/server/auth";
import SocialLogin from "@/components/SocialLogin";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation();
  
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const image = form.image.value.trim();
    const password = form.password.value.trim();

    let hasError = false;
    const newErrors = { name: "", email: "", image: "", password: "" };

    if (!name) {
      newErrors.name = t("nameRequired");
      hasError = true;
    }

    if (!email) {
      newErrors.email = t("emailRequired");
      hasError = true;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = t("invalidEmailFormat");
      hasError = true;
    }

    if (!image) {
      newErrors.image = t("photoUrlRequired");
      hasError = true;
    } else if (
      !/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(image)
    ) {
      newErrors.image = t("invalidPhotoUrl");
      hasError = true;
    }

    if (!password) {
      newErrors.password = t("passwordRequired");
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = t("passwordMinLength");
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      setLoading(false);
      return;
    }

    const result = await postUser({ name, email, image, password });

    if (result?.success) {
      Swal.fire({
        icon: "success",
        title: t("registrationSuccessful"),
        text: t("pleaseLogin"),
        confirmButtonColor: "#f97316",
      }).then(() => {
        router.push("/login");
      });
    } else {
      Swal.fire({
        icon: "error",
        title: t("registrationFailed"),
        text: result?.message || t("somethingWentWrong"),
        confirmButtonColor: "#f97316",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{t("registerTitle")}</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t("nameLabel")}</label>
            <input
              name="name"
              type="text"
              placeholder={t("enterNamePlaceholder")}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t("emailLabel")}</label>
            <input
              name="email"
              type="email"
              placeholder={t("enterEmailPlaceholder")}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t("photoUrlLabel")}</label>
            <input
              name="image"
              type="url"
              placeholder={t("enterPhotoUrlPlaceholder")}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.image ? "border-red-500" : ""
              }`}
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t("passwordLabel")}</label>
            <input
              name="password"
              type="password"
              placeholder={t("enterPasswordPlaceholder")}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md cursor-pointer disabled:bg-gray-400 transition"
          >
            {loading ? t("registering") : t("registerTitle")}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t"></div>
          <span className="mx-3 text-sm text-gray-500">{t("orDivider")}</span>
          <div className="flex-grow border-t"></div>
        </div>

        <SocialLogin />

        <p className="text-sm text-gray-500 mt-6 text-center">
          {t("alreadyHaveAccount")}
          <Link href="/login" className="text-blue-500 hover:underline">
            {t("loginTitle")}
          </Link>
        </p>
      </div>
    </div>
  );
}