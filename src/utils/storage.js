// localStorage хвърля в частен режим, при блокирани "бисквитки" или пълно хранилище.
// Тези обвивки никога не хвърлят: четенето връща null, записът и изтриването мълчаливо се пропускат.
export function getItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // няма какво да се направи
  }
}
