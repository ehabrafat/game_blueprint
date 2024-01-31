export const formatDate = (date: string) => {
  return new Date(date).toLocaleTimeString("en-us", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

