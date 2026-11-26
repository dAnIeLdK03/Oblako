import { useLanguage } from '../LanguageContext.jsx';
import { moonPhase, nextMoonPhase } from '../services/astronomy/index.js';
import styles from './MoonPhase.module.css';

// Осветената част: половин окръжност откъм Слънцето + елипса по терминатора.
function litPath(angle) {
  const rx = Math.abs(Math.cos((angle * Math.PI) / 180)) * 20;
  const waxing = angle <= 180;
  const crescent = angle < 90 || angle > 270;
  const outer = waxing ? 1 : 0;
  const inner = crescent === waxing ? 0 : 1;
  return `M 0 -20 A 20 20 0 0 ${outer} 0 20 A ${rx} 20 0 0 ${inner} 0 -20 Z`;
}

function MoonPhase({ now, place, utcOffset }) {
  const { language, t } = useLanguage();
  const { phase, illumination, angle } = moonPhase(now);

  // Датата е по времето на самото място
  const formatDate = (time) =>
    new Date((time + utcOffset) * 1000).toLocaleDateString(language === 'bg' ? 'bg-BG' : 'en-GB', {
      day: 'numeric',
      month: 'long',
      timeZone: 'UTC',
    });

  return (
    <div className={styles.moon}>
      <div className={styles.current}>
        {/* В южното полукълбо Луната се вижда огледално */}
        <svg
          className={styles.disc}
          viewBox="-21 -21 42 42"
          aria-hidden="true"
          style={place.lat < 0 ? { transform: 'scaleX(-1)' } : undefined}
        >
          <circle r="20" className={styles.shadow} />
          <path d={litPath(angle)} className={styles.lit} />
        </svg>
        <div>
          <div className={styles.label}>{t('moonPhase')}</div>
          <strong>{t(`moon_${phase}`)}</strong>
          <div className={styles.label}>
            {t('moonIllumination')}: {Math.round(illumination * 100)}%
          </div>
        </div>
      </div>

      <dl className={styles.upcoming}>
        {[
          ['moonNextFull', 180],
          ['moonNextNew', 0],
        ].map(([label, target]) => (
          <div key={label}>
            <dt className={styles.label}>{t(label)}</dt>
            <dd>{formatDate(nextMoonPhase(now, target))}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default MoonPhase;
