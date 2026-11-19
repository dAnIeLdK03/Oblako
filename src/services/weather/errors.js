// Единен тип грешка за услугата за времето.
// code:
//   NOT_FOUND  - градът не съществува
//   NETWORK    - няма връзка
//   TIMEOUT    - сървърът не отговори навреме
//   RATE_LIMIT - HTTP 429
//   SERVER     - HTTP 5xx или невалиден отговор
//   UNAVAILABLE- друга неочаквана грешка
// Отказана от нас заявка (AbortController) НЕ е WeatherError: хвърля се нативният AbortError.
export class WeatherError extends Error {
    constructor(code, message, { status, provider } = {}) {
        super(message);
        this.name = 'WeatherError';
        this.code = code;
        this.status = status;
        this.provider = provider;
    }
}

export const isAbortError = (err) => err?.name === 'AbortError';
