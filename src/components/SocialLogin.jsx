"use client";

import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useTranslation } from "@/hooks/useTranslation";

const SocialLogin = () => {
  const { t } = useTranslation();

  const handleSocialLogin = (provider) => {
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="mt-6 space-y-3">
      <button
        onClick={() => handleSocialLogin("google")}
        className="w-full flex items-center justify-center gap-2 border py-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
      >
        <FcGoogle size={20} />
        {t("continueWithGoogle")}
      </button>

      <button
        onClick={() => handleSocialLogin("github")}
        className="w-full flex items-center justify-center gap-2 border py-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
      >
        <FaGithub size={20} />
        {t("continueWithGithub")}
      </button>
    </div>
  );
};

export default SocialLogin;