// Превежда грешка от услугата за времето в съобщение за потребителя.
const KEYS = {
  NOT_FOUND: 'cityNotFound',
  NETWORK: 'errNetwork',
  TIMEOUT: 'errTimeout',
  RATE_LIMIT: 'errRateLimit',
  SERVER: 'errServer',
};

export function weatherErrorMessage(err, t) {
  return t(KEYS[err?.code] || 'errServer');
}
