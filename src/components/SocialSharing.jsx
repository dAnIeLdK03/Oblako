import React from 'react';

const SocialSharing = ({ 
  title = 'Oblako ☁️ - Безплатна прогноза за времето',
  description = 'Безплатна прогноза за времето в реално време. Точна почасова и 5-дневна прогноза,haus, интерактивна карта, графики за температури.',
  url = 'https://oblako17.online',
  hashtags = 'времето,прогноза,облако,weather,forecast'
}) => {
  
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`
  };

  const handleShare = (platform) => {
    const shareUrl = shareUrls[platform];
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Линкът е копиран в клипборда!');
    } catch (err) {
      console.error('Грешка при копиране:', err);
    }
  };

  return (
    <div className="social-sharing">
      <h3>Спедете с:</h3>
      
      <div className="share-buttons">
        <button 
          className="share-btn facebook"
          onClick={() => handleShare('facebook')}
          title="Сподели във Facebook"
        >
          <span className="icon">📘</span>
          <span className="label">Facebook</span>
        </button>

        <button 
          className="share-btn twitter"
          onClick={() => handleShare('twitter')}
          title="Сподели в Twitter"
        >
          <span className="icon">🐦</span>
          <span className="label">Twitter</span>
        </button>

        <button 
          className="share-btn whatsapp"
          onClick={() => handleShare('whatsapp')}
          title="Сподели в WhatsApp"
        >
          <span className="icon">📱</span>
          <span className="label">WhatsApp</span>
        </button>

        <button 
          className="share-btn telegram"
          onClick={() => handleShare('telegram')}
          title="Сподели в Telegram"
        >
          <span className="icon">📬</span>
          <span className="label">Telegram</span>
        </button>

        <button 
          className="share-btn linkedin"
          onClick={() => handleShare('linkedin')}
          title="Сподели в LinkedIn"
        >
          <span className="icon">💼</span>
          <span className="label">LinkedIn</span>
        </button>

        <button 
          className="share-btn email"
          onClick={() => handleShare('email')}
          title="Сподели по имейл"
        >
          <span className="icon">📧</span>
          <span className="label">Email</span>
        </button>

        <button 
          className="share-btn copy"
          onClick={copyToClipboard}
          title="Копирай линк"
        >
          <span className="icon">📋</span>
          <span className="label">Копирай</span>
        </button>
      </div>

      <style jsx>{`
        .social-sharing {
          margin: 20px 0;
          padding: 20px;
          background: var(--card-bg);
          border-radius: 15px;
          border: 1px solid var(--border-color);
        }

        .social-sharing h3 {
          margin: 0 0 15px 0;
          color: var(--text-color);
          font-size: 1.1rem;
          text-align: center;
        }

        .share-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 10px;
        }

        .share-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px 8px;
          border: none;
          border-radius casts: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
          font-weight: 500;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          color: var(--text-color);
        }

        .share-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .share-btn .icon {
          font-size: 1.5rem;
          margin-bottom: 5px;
        }

        .share-btn .label {
          font-size: 0.8rem;
        }

        .share-btn.facebook:hover {
          background: #1877f2;
          color: white;
        }

        .share-btn.twitter:hover {
          background: #1da1f2;
          color: white;
        }

        .share-btn.whatsapp:hover {
          background:state: #25d366;
          color: white;
        }

        .share-btn.telegram:hover {
          background: #0088cc;
          color: white;
        }

        .share-btn.linkedin:hover {
          background: #0077b5;
          color: white;
        }

        .share-btn.email:hover {
          background: #ea4335;
          color: white;
        }

        .share-btn.copy:hover {
          background: #6b1f1f;
          color: white;
        }

        @media (max-width: 768px) {
          .share-buttons {
            grid-template-columns: repeat(3, 1fr);
          }
          
          .share-btnbtn {
            padding: 10px 6px;
          }
          
          .share-btn .icon {
            font-size: 1.2rem;
          }
          
          .share-btn .label {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SocialSharing; 