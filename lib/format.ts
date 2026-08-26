/**
 * Formatting Utilities
 */

export function formatPrice(price: number, currency: string = 'KES'): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
  }).format(price);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatPhone(phone: string): string {
  // Format: 254XXXXXXXXX to +254 XXX XXX XXX
  if (phone.startsWith('254')) {
    return `+${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6, 9)} ${phone.slice(9)}`;
  }
  return phone;
}

export function truncate(text: string, length: number): string {
  return text.length > length ? `${text.slice(0, length)}...` : text;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
