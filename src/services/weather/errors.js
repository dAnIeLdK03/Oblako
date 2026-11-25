// @ts-check
// Единен тип грешка за услугата за времето.
// code:
//   NOT_FOUND  - градът не съществува
//   NETWORK    - няма връзка
//   TIMEOUT    - сървърът не отговори навреме
//   RATE_LIMIT - HTTP 429
//   SERVER     - HTTP 5xx или невалиден отговор
//   UNAVAILABLE- друга неочаквана грешка
// Отказана от нас заявка (AbortController) НЕ е WeatherError: хвърля се нативният AbortError.
/** @typedef {'NOT_FOUND' | 'NETWORK' | 'TIMEOUT' | 'RATE_LIMIT' | 'SERVER' | 'UNAVAILABLE'} WeatherErrorCode */

export class WeatherError extends Error {
  /**
   * @param {WeatherErrorCode} code
   * @param {string} message
   * @param {{ status?: number, provider?: string }} [opts]
   */
  constructor(code, message, { status, provider } = {}) {
    super(message);
    this.name = 'WeatherError';
    this.code = code;
    this.status = status;
    this.provider = provider;
  }
}

/** @param {any} err */
export const isAbortError = (err) => err?.name === 'AbortError';
