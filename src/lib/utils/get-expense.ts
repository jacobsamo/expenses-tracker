export const getExpenses = async () => {
  try {
    const response = await fetch("/api/expenses", {
      credentials: "include",
    });
    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized - this might trigger a redirect
        return null;
      }
      throw new Error(`Failed to fetch expenses: ${response.statusText}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Invalid response format");
    }

    return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return null;
  }
};
