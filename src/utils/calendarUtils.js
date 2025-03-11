//✅ Reusable Small Functions=> across mutiple part / whole application
// When to Use utils/:
// When you need a reusable helper function that could be used
// across multiple parts of the application.
// When the function is general-purpose and doesn't belong
// to a specific domain or business logic.

export const getCurrentYear = () => {
  return new Date().getFullYear();
};

export const getYearArray = (currentYear, range = 100) => {
  return Array.from({ length: range }, (_, index) => currentYear - index);
};

export const formatDate = (year, month, day) => {
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};
export const formatJoiningDate = (joiningDate) => {
  const date = new Date(joiningDate);
  const options = { year: "numeric", month: "long" };
  return `Joined ${date.toLocaleDateString("en-US", options)}`;
};
