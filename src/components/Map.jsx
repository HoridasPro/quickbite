"use client";

import dynamic from "next/dynamic";
import { useTranslation } from "@/hooks/useTranslation";

const MapLoader = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
      {t("loadingInteractiveMap")}
    </div>
  );
};

const DynamicMap = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => <MapLoader />,
});

export default DynamicMap;