import { useState } from 'react';
import html2canvas from 'html2canvas';

export function useShare() {
  const [isSharing, setIsSharing] = useState(false);

  // Generate shareable URL with weather data
  const generateShareUrl = (weatherData, city) => {
    if (!weatherData) return '';
    
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      city: city || weatherData.name,
      temp: Math.round(weatherData.main.temp),
      condition: weatherData.weather[0].main,
      description: weatherData.weather[0].description,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind?.speed || 0,
      timestamp: Date.now()
    });
    
    return `${baseUrl}?share=weather&${params.toString()}`;
  };

  // Generate share text
  const generateShareText = (weatherData, city, language = 'en') => {
    if (!weatherData) return '';
    
    const temp = Math.round(weatherData.main.temp);
    const condition = weatherData.weather[0].description;
    const cityName = city || weatherData.name;
    
    const texts = {
      en: `🌤️ Weather in ${cityName}: ${temp}°C, ${condition}. Check it out!`,
      bg: `🌤️ Времето в ${cityName}: ${temp}°C, ${condition}. Вижте тук!`
    };
    
    return texts[language] || texts.en;
  };

  // Take screenshot of weather card
  const takeScreenshot = async (elementId = 'weather-card') => {
    setIsSharing(true);
    
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Weather card element not found');
      }

      // Configure html2canvas options
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: element.offsetWidth,
        height: element.offsetHeight,
        scrollX: 0,
        scrollY: 0
      });

      // Convert to blob
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png', 0.9);
      });
    } catch (error) {
      console.error('Screenshot failed:', error);
      throw error;
    } finally {
      setIsSharing(false);
    }
  };

  // Native Web Share API
  const nativeShare = async (weatherData, city, language = 'en') => {
    if (!navigator.share) {
      throw new Error('Web Share API not supported');
    }

    const shareData = {
      title: 'Weather App',
      text: generateShareText(weatherData, city, language),
      url: generateShareUrl(weatherData, city)
    };

    try {
      await navigator.share(shareData);
      return true;
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Native share failed:', error);
      }
      throw error;
    }
  };

  // Share with screenshot
  const shareWithScreenshot = async (weatherData, city, language = 'en') => {
    if (!navigator.share) {
      throw new Error('Web Share API not supported');
    }

    try {
      const screenshot = await takeScreenshot();
      const file = new File([screenshot], 'weather-forecast.png', { type: 'image/png' });
      
      const shareData = {
        title: 'Weather Forecast',
        text: generateShareText(weatherData, city, language),
        files: [file]
      };

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return true;
      } else {
        // Fallback to URL share
        return await nativeShare(weatherData, city, language);
      }
    } catch (error) {
      console.error('Screenshot share failed:', error);
      throw error;
    }
  };

  // Social media share URLs
  const getSocialShareUrls = (weatherData, city, language = 'en') => {
    const shareUrl = generateShareUrl(weatherData, city);
    const shareText = generateShareText(weatherData, city, language);
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=weather,forecast`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`,
      email: `mailto:?subject=Weather Forecast&body=${encodedText}%0A%0A${encodedUrl}`
    };
  };

  // Copy to clipboard
  const copyToClipboard = async (weatherData, city, type = 'url') => {
    try {
      let textToCopy;
      
      if (type === 'url') {
        textToCopy = generateShareUrl(weatherData, city);
      } else if (type === 'text') {
        textToCopy = generateShareText(weatherData, city);
      } else {
        textToCopy = `${generateShareText(weatherData, city)}\n${generateShareUrl(weatherData, city)}`;
      }

      await navigator.clipboard.writeText(textToCopy);
      return true;
    } catch (error) {
      console.error('Copy to clipboard failed:', error);
      
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  };

  // Download screenshot
  const downloadScreenshot = async (weatherData, city) => {
    try {
      const screenshot = await takeScreenshot();
      const url = URL.createObjectURL(screenshot);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `weather-${city || 'forecast'}-${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Download screenshot failed:', error);
      throw error;
    }
  };

  return {
    isSharing,
    generateShareUrl,
    generateShareText,
    takeScreenshot,
    nativeShare,
    shareWithScreenshot,
    getSocialShareUrls,
    copyToClipboard,
    downloadScreenshot
  };
}
