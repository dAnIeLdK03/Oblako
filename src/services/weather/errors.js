// Единен тип грешка за всички доставчици на времето.
// code: 'NOT_FOUND' (градът не съществува) | 'UNAVAILABLE' (лимит, блокиран ключ, мрежа, 5xx)
export class WeatherError extends Error {
    constructor(code, message, { status, provider } = {}) {
        super(message);
        this.name = 'WeatherError';
        this.code = code;
        this.status = status;
        this.provider = provider;
    }
}
