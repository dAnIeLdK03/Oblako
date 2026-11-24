// Помощни функции за местоположението на потребителя.

export class GeolocationError extends Error {
  // code: UNSUPPORTED | DENIED | UNAVAILABLE | TIMEOUT
  constructor(code) {
    super(code);
    this.name = 'GeolocationError';
    this.code = code;
  }
}

// Позиция от браузъра като Promise; при проблем хвърля GeolocationError.
export async function getPosition(
  options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
) {
  if (!navigator.geolocation) throw new GeolocationError('UNSUPPORTED');

  // Ако достъпът е вече отказан, не чакаме напразно браузъра
  if (navigator.permissions) {
    try {
      const status = await navigator.permissions.query({ name: 'geolocation' });
      if (status.state === 'denied') throw new GeolocationError('DENIED');
    } catch (err) {
      if (err instanceof GeolocationError) throw err;
      // Permissions API не се поддържа — продължаваме
    }
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      resolve,
      (e) =>
        reject(
          new GeolocationError(e.code === 1 ? 'DENIED' : e.code === 3 ? 'TIMEOUT' : 'UNAVAILABLE'),
        ),
      options,
    );
  });
}

// Превежда GeolocationError в съобщение за потребителя.
export function geolocationErrorMessage(err, t) {
  const detail = {
    UNSUPPORTED: t('locationNotSupported'),
    DENIED: t('locationPermissionDenied') + '. ' + t('locationEnableInstructions'),
    TIMEOUT: t('locationTimeout'),
    UNAVAILABLE: t('locationUnavailable'),
  }[err?.code];
  return detail ? `${t('locationError')}: ${detail}` : t('locationError');
}

// Проверява точността на позицията от браузъра.
// ok=false означава, че позицията е съмнителна (напр. приблизителна, по Wi-Fi/IP).
export function verifyLocation(position) {
  const { accuracy } = position.coords;
  if (accuracy > 20000) return { ok: false, reason: 'accuracy', accuracy };
  return { ok: true };
}
