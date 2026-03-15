"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { Plus, Trash2 } from "lucide-react";
import CustomDropdown from "./CustomDropdown";

export default function VariationsBuilder({ variations = [], onChange }) {
  const { t } = useTranslation();

  const addVariation = (e) => {
    e.preventDefault();
    const newVariation = {
      id: `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      title: "",
      titleBn: "",
      type: "radio",
      required: false,
      options: [{ id: `o_${Date.now()}`, name: "", nameBn: "", price: 0 }]
    };
    onChange([...variations, newVariation]);
  };

  const removeVariation = (e, vIndex) => {
    e.preventDefault();
    const updated = [...variations];
    updated.splice(vIndex, 1);
    onChange(updated);
  };

  const updateVariation = (vIndex, field, value) => {
    const updated = [...variations];
    updated[vIndex] = { ...updated[vIndex], [field]: value };
    onChange(updated);
  };

  const addOption = (e, vIndex) => {
    e.preventDefault();
    const updated = [...variations];
    const updatedVariation = { ...updated[vIndex] };
    updatedVariation.options = [
      ...(updatedVariation.options || []),
      { id: `o_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, name: "", nameBn: "", price: 0 }
    ];
    updated[vIndex] = updatedVariation;
    onChange(updated);
  };

  const removeOption = (e, vIndex, oIndex) => {
    e.preventDefault();
    const updated = [...variations];
    const updatedVariation = { ...updated[vIndex] };
    const updatedOptions = [...(updatedVariation.options || [])];
    updatedOptions.splice(oIndex, 1);
    updatedVariation.options = updatedOptions;
    updated[vIndex] = updatedVariation;
    onChange(updated);
  };

  const updateOption = (vIndex, oIndex, field, value) => {
    const updated = [...variations];
    const updatedVariation = { ...updated[vIndex] };
    const updatedOptions = [...(updatedVariation.options || [])];
    updatedOptions[oIndex] = {
       ...updatedOptions[oIndex],
       [field]: field === "price" ? Number(value) : value
    };
    updatedVariation.options = updatedOptions;
    updated[vIndex] = updatedVariation;
    onChange(updated);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
      <div className="flex justify-between items-center border-b pb-3">
        <h2 className="text-lg font-bold text-gray-800">{t("variationsLabel")}</h2>
        <button type="button" onClick={addVariation} className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-xl hover:bg-orange-100 transition-all font-semibold text-sm">
          <Plus className="w-4 h-4" /> {t("addVariationBtn")}
        </button>
      </div>

      <div className="space-y-10">
        {variations.map((variation, vIndex) => (
          <div key={variation.id || `var_${vIndex}`} className="relative p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 group">
            <button type="button" onClick={(e) => removeVariation(e, vIndex)} className="absolute -top-3 -right-3 bg-red-50 text-red-500 p-2 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition-all">
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">{t("variationTitle")}</label>
                <input type="text" value={variation.title} onChange={(e) => updateVariation(vIndex, "title", e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white" placeholder="e.g. Spice Level" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">{t("variationTitleBn")}</label>
                <input type="text" value={variation.titleBn} onChange={(e) => updateVariation(vIndex, "titleBn", e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white" placeholder="যেমন: ঝালের পরিমাণ" />
              </div>
              <div className="space-y-2 relative">
                <label className="text-sm font-semibold text-gray-700">{t("variationType")}</label>
                <CustomDropdown 
                  value={variation.type} 
                  onChange={(val) => updateVariation(vIndex, "type", val)}
                  options={[
                    { id: "radio", label: t("typeRadio") || "Radio (Single Selection)" },
                    { id: "checkbox", label: t("typeCheckbox") || "Checkbox (Multiple Selection)" }
                  ]}
                  placeholder="Select Type"
                />
              </div>
              <div className="flex items-center gap-3 pt-8">
                <input type="checkbox" id={`req-${vIndex}`} checked={variation.required} onChange={(e) => updateVariation(vIndex, "required", e.target.checked)} className="w-5 h-5 accent-orange-500 rounded cursor-pointer" />
                <label htmlFor={`req-${vIndex}`} className="text-sm font-semibold text-gray-700 cursor-pointer">{t("isRequired")}</label>
              </div>
            </div>

            <div className="space-y-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-2 border-b border-gray-50 pb-3">
                <h4 className="text-sm font-bold text-gray-800">{t("optionsLabel")}</h4>
                <button type="button" onClick={(e) => addOption(e, vIndex)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1">
                  <Plus className="w-3 h-3" /> {t("addOptionBtn")}
                </button>
              </div>
              
              {variation.options?.map((option, oIndex) => (
                <div key={option.id || `opt_${oIndex}`} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-4">
                    <input type="text" value={option.name} onChange={(e) => updateOption(vIndex, oIndex, "name", e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" placeholder={t("optionName")} />
                  </div>
                  <div className="md:col-span-4">
                    <input type="text" value={option.nameBn} onChange={(e) => updateOption(vIndex, oIndex, "nameBn", e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" placeholder={t("optionNameBn")} />
                  </div>
                  <div className="md:col-span-3">
                    <input type="number" value={option.price} onChange={(e) => updateOption(vIndex, oIndex, "price", e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm font-medium" placeholder="Price (Tk)" />
                  </div>
                  <div className="md:col-span-1 flex justify-end">
                    <button type="button" onClick={(e) => removeOption(e, vIndex, oIndex)} className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}