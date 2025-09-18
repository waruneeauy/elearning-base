export const useParam = () => {
  return useState("param", () => "Please fill the required field.");
};
