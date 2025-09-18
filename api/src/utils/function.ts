export function randomCode(length: number) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function addHyphenEveryFourChars(input: string) {
  return input.replace(/(.{4})/g, "$1-").replace(/-$/, ""); // Remove trailing hyphen
}

export function padNumber(num: number) {
  return num.toString().padStart(6, "0");
}

export function randomPass(length: number) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz@";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
