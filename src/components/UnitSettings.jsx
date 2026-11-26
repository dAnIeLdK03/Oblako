import { useLanguage } from '../LanguageContext.jsx';
import { useTheme } from '../ThemeContext.jsx';
import { UNIT_OPTIONS } from '../utils/units.js';
import styles from './UnitSettings.module.css';

// Избор на единици в страничното меню.
function UnitSettings() {
  const { t } = useLanguage();
  const { units, setUnit } = useTheme();

  return (
    <div className={styles.settings}>
      {Object.entries(UNIT_OPTIONS).map(([kind, options]) => (
        <div key={kind} className={styles.row}>
          <span>{t(kind)}:</span>
          <div className={styles.switch} role="group" aria-label={t(kind)}>
            {options.map((unit) => (
              <button
                key={unit}
                type="button"
                className={`${styles.button} ${units[kind] === unit ? styles.active : ''}`}
                onClick={() => setUnit(kind, unit)}
                aria-pressed={units[kind] === unit}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default UnitSettings;
