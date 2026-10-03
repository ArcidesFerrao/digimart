import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("pt-MZ", {
    style: "currency",
    currency: "MZN",
    minimumFractionDigits: 0,
  }).format(price);
}

export function generateWhatsAppLink(phone: string, productName: string, price: number): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const message = `Olá, tenho interesse no produto "${productName}" por ${formatPrice(price)}. Como posso efectuar o pagamento?`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Descodifica um parâmetro de URL (ex: "Mika%20Merlin" -> "Mika Merlin").
 * É seguro chamar em valores já descodificados: se falhar, devolve o original.
 */
export function decodeParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
