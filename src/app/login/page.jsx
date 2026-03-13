"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link"; 
import SocialLogin from "@/components/SocialLogin";
import Swal from "sweetalert2";
import { useTranslation } from "@/hooks/useTranslation";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const { t } = useTranslation();

  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already logged in → redirect home
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    let hasError = false;
    const newErrors = { email: "", password: "" };

    // Email validation
    if (!email) {
      newErrors.email = t("emailRequired");
      hasError = true;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = t("invalidEmailFormat");
      hasError = true;
    }

    // Password validation
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

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      Swal.fire({
        icon: "error",
        title: t("loginFailed"),
        text: t("invalidCredentials"),
        confirmButtonColor: "#f97316",
      });
      setLoading(false);
    } else {
      Swal.fire({
        icon: "success",
        title: t("loginSuccessful"),
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        router.refresh();
        router.replace("/");
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{t("loginTitle")}</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">{t("passwordLabel")}</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("enterPasswordPlaceholder")}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-500 hover:underline"
            >
              {t("forgotPasswordLink")}
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors cursor-pointer disabled:bg-gray-400"
          >
            {loading ? t("loggingIn") : t("loginTitle")}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t"></div>
          <span className="mx-3 text-sm text-gray-500">{t("orDivider")}</span>
          <div className="flex-grow border-t"></div>
        </div>

        <SocialLogin />

        <p className="text-sm text-gray-500 mt-6 text-center">
          {t("dontHaveAccount")}
          <Link href="/register" className="text-blue-500 underline">
            {t("registerLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}