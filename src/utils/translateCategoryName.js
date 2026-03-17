export const getDisplayCategoryName = (engName, categories, language) => {
  if (!engName) return "";
  const match = categories.find(c => c.categoryName === engName || c.name === engName);
  return language === "bn" ? (match?.categoryBn || engName) : engName;
};