// Indonesian Rupiah currency formatting
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Alternative simple format without Intl (in case of browser compatibility)
export function formatIDRSimple(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}