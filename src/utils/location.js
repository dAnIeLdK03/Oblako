// Помощни функции за проверка на засечената локация.

// Проверява точността на позицията от браузъра.
// ok=false означава, че позицията е съмнителна (напр. приблизителна, по Wi-Fi/IP).
export function verifyLocation(position) {
    const { accuracy } = position.coords;
    if (accuracy > 20000) return { ok: false, reason: 'accuracy', accuracy };
    return { ok: true };
}
