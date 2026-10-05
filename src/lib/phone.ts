// lib/phone.ts
export function normalizeMzPhone(input: string): string | null {
  let digits = input.replace(/\D/g, ""); // remove +, espaços, "·", letras, etc.

  if (digits.startsWith("00258")) digits = digits.slice(2); // 00258... -> 258...

  if (digits.length === 9 && digits.startsWith("8")) {
    digits = "258" + digits; // 863691356 -> 258863691356
  }

  return /^2588\d{8}$/.test(digits) ? digits : null;
}