// @ts-check
// Обща HTTP заявка за доставчиците: таймаут, отмяна и единен тип грешка.
import { WeatherError, isAbortError } from './errors.js';

const TIMEOUT_MS = 10000;

const abortError = () => new DOMException('Aborted', 'AbortError');

/**
 * @param {number} status
 * @param {string} provider
 */
function statusError(status, provider) {
  const code = status === 429 ? 'RATE_LIMIT' : status >= 500 ? 'SERVER' : 'UNAVAILABLE';
  return new WeatherError(code, `${provider} HTTP ${status}`, { status, provider });
}

// Една заявка с таймаут; `signal` позволява на извикващия да я отмени.
/**
 * @param {string} url
 * @param {string} provider  име на доставчика, за грешките
 * @param {AbortSignal} [signal]
 * @returns {Promise<any>}
 */
export async function request(url, provider, signal) {
  if (signal?.aborted) throw abortError();

  const controller = new AbortController();
  let timedOut = false;
  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort, { once: true });
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, TIMEOUT_MS);

  const classify = (err) => {
    if (timedOut) return new WeatherError('TIMEOUT', `${provider} timeout`, { provider });
    if (isAbortError(err)) return err; // отказана от извикващия
    if (err instanceof SyntaxError)
      return new WeatherError('SERVER', 'Invalid response', { provider });
    return new WeatherError('NETWORK', err.message, { provider });
  };

  try {
    let res;
    try {
      res = await fetch(url, { signal: controller.signal });
    } catch (err) {
      throw classify(err);
    }
    if (!res.ok) throw statusError(res.status, provider);
    try {
      return await res.json();
    } catch (err) {
      throw classify(err);
    }
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  }
}
