import React from 'react';
import { useLanguage } from '../LanguageContext.jsx';

function WeatherTips() {
  const { language } = useLanguage();
  
  return (
    <div className="weather-tips">
      <h1>{language === 'bg' ? 'Съвети за времето' : 'Weather Tips'}</h1>
      
      {language === 'bg' ? (
        <div className="tips-content">
          <section>
            <h2>Как да разчетем прогнозата за времето</h2>
            <p>Прогнозата за времето е сложна наука, която обаче може да бъде разбрана от всеки. Когато виждате прогноза за деня, важно е да знаете какво означават различните символи и числа.</p>
            
            <h3>Температура</h3>
            <p>Температурата се измерва в градуси Целзий. Когато виждате прогноза от 25°C, това означава топло време, подходящо за открити дейности. При температури под 0°C се очаква студено време с възможност за снеговалеж. Важно е да знаете, че чувствената температура може да се различава от показаната поради влажността на въздуха и силата на вятъра.</p>
            
            <h3>Влажност на въздуха</h3>
            <p>Влажността показва колко водна пара има във въздуха. При висока влажност (над 70%) се чувстваме по-топло, защото потта не се изпарява лесно. При ниска влажност (под 30%) кожата може да се изсуши. Оптималната влажност за комфорт е между 40-60%.</p>
            
            <h3>Атмосферно налягане</h3>
            <p>Атмосферното налягане влияе върху времето. При високо налягане (над 1013 hPa) времето обикновено е ясно и стабилно. При ниско налягане (под 1013 hPa) се очакват облаци и валежи. Рязкото спадане на налягането често предвещава бурно време.</p>
          </section>
          
          <section>
            <h2>Сезонни съвети</h2>
            
            <h3>През зимата</h3>
            <p>Зимата е времето за внимателно планиране на дейностите. Когато температурата падне под -5°C, важно е да се облечете топло и да избягвате дълго престой на открито. При снеговалеж, пътуването може да бъде затруднено, затова планирайте допълнително време за придвижване. Използвайте зимни гуми и проверете автомобила преди пътуване.</p>
            
            <h3>През лятото</h3>
            <p>Лятото е времето за открити дейности, но внимавайте с горещините. При температури над 35°C, важно е да пиете много вода и да избягвате престой на директна слънчева светлина между 11:00 и 16:00 часа. Използвайте слънцезащитни средства и облека от лека тъкан. Планирайте дейностите рано сутрин или късно вечер.</p>
            
            <h3>През есента</h3>
            <p>Есента е сезонът на промените. Температурите започват да падат, а дните стават по-кратки. Важно е да се адаптирате към промените и да носите подходяща облека. Често има дъждове, затова винаги имайте чадър или дъждобран. Есента е идеалното време за планиране на зимни дейности.</p>
            
            <h3>През пролетта</h3>
            <p>Пролетта е времето на обновяването. Температурите започват да се покачват, но все още може да има неочаквани студени дни. Важно е да се облечете на слоеве, за да можете да се адаптирате към промените в температурата през деня. Пролетта е времето за отваряне на прозорците и проветряване на домовете.</p>
          </section>
          
          <section>
            <h2>Как да се подготвим за екстремни условия</h2>
            
            <h3>При силни ветрове</h3>
            <p>При прогноза за силни ветрове (над 50 км/ч), важно е да се предпазите. Избягвайте откритите пространства и високи сгради. Ако трябва да излезете, носите плътна облека и внимавайте за падащи предмети. Затворете прозорците и вратите, и премахнете предметите от балконите.</p>
            
            <h3>При грозове</h3>
            <p>Грозовете могат да бъдат опасни, особено ако сте на открито. При първите признаци на гръмотевица, потърсете подслон в сграда или автомобил. Избягвайте високи предмети като дървета и метални конструкции. Не използвайте електронни устройства, свързани с електрическата мрежа.</p>
            
            <h3>При горещини</h3>
            <p>При екстремни горещини (над 40°C), важно е да останете в хладно помещение. Ако трябва да излезете, правите това рано сутрин или късно вечер. Пийте много вода и избягвайте тежки физически дейности. Използвайте климатици или вентилатори за охлаждане на помещенията.</p>
            
            <h3>При мъгли</h3>
            <p>При мъгли важно е да се движите внимателно, особено с автомобил. Използвайте фаровете и намалете скоростта. Ако сте пешеходец, носите светли дрехи за по-добра видимост. Избягвайте дълги пътувания при силни мъгли.</p>
          </section>
          
          <section>
            <h2>Полезни съвети за ежедневието</h2>
            
            <h3>Планиране на дейности</h3>
            <p>Винаги проверявайте прогнозата за времето преди да планирате открити дейности. Ако планирате пътуване, проверете прогнозата за целта и по пътя. Планирайте алтернативни дейности за случай на лошо време.</p>
            
            <h3>Облекло според времето</h3>
            <p>Облечете се според прогнозата, но винаги имайте резервна облека. При нестабилно време, облечете се на слоеве. Използвайте подходящи обувки за различните метеорологични условия.</p>
            
            <h3>Здраве и времето</h3>
            <p>Времето може да влияе върху здравето. При високи температури, пийте много вода и избягвайте престой на слънце. При ниски температури, облечете се топло и избягвайте дълго престой на открито. При промени в атмосферното налягане, хората с хронични заболявания трябва да бъдат особено внимателни.</p>
          </section>
        </div>
      ) : (
        <div className="tips-content">
          <section>
            <h2>How to Read Weather Forecasts</h2>
            <p>Weather forecasting is a complex science that can be understood by everyone. When you see a daily forecast, it's important to know what the different symbols and numbers mean.</p>
            
            <h3>Temperature</h3>
            <p>Temperature is measured in Celsius degrees. When you see a forecast of 25°C, this means warm weather suitable for outdoor activities. At temperatures below 0°C, cold weather with possible snowfall is expected. It's important to know that the felt temperature can differ from the displayed one due to air humidity and wind strength.</p>
            
            <h3>Air Humidity</h3>
            <p>Humidity shows how much water vapor is in the air. At high humidity (above 70%), we feel warmer because sweat doesn't evaporate easily. At low humidity (below 30%), the skin can dry out. The optimal humidity for comfort is between 40-60%.</p>
            
            <h3>Atmospheric Pressure</h3>
            <p>Atmospheric pressure affects the weather. At high pressure (above 1013 hPa), the weather is usually clear and stable. At low pressure (below 1013 hPa), clouds and precipitation are expected. A sharp drop in pressure often heralds stormy weather.</p>
          </section>
          
          <section>
            <h2>Seasonal Tips</h2>
            
            <h3>During Winter</h3>
            <p>Winter is the time for careful activity planning. When temperatures drop below -5°C, it's important to dress warmly and avoid long stays outdoors. During snowfall, travel may be difficult, so plan extra time for movement. Use winter tires and check your car before traveling.</p>
            
            <h3>During Summer</h3>
            <p>Summer is the time for outdoor activities, but be careful with heat. At temperatures above 35°C, it's important to drink plenty of water and avoid direct sunlight between 11:00 AM and 4:00 PM. Use sunscreen and light fabric clothing. Plan activities early morning or late evening.</p>
            
            <h3>During Autumn</h3>
            <p>Autumn is the season of changes. Temperatures begin to drop, and days become shorter. It's important to adapt to changes and wear appropriate clothing. There are often rains, so always have an umbrella or raincoat. Autumn is the perfect time to plan winter activities.</p>
            
            <h3>During Spring</h3>
            <p>Spring is the time of renewal. Temperatures begin to rise, but there can still be unexpected cold days. It's important to dress in layers so you can adapt to temperature changes throughout the day. Spring is the time to open windows and air out homes.</p>
          </section>
          
          <section>
            <h2>How to Prepare for Extreme Conditions</h2>
            
            <h3>During Strong Winds</h3>
            <p>When strong winds are forecast (above 50 km/h), it's important to protect yourself. Avoid open spaces and tall buildings. If you must go out, wear tight clothing and watch for falling objects. Close windows and doors, and remove items from balconies.</p>
            
            <h3>During Thunderstorms</h3>
            <p>Thunderstorms can be dangerous, especially if you're outdoors. At the first signs of lightning, seek shelter in a building or car. Avoid tall objects like trees and metal structures. Don't use electronic devices connected to the electrical grid.</p>
            
            <h3>During Heat Waves</h3>
            <p>During extreme heat (above 40°C), it's important to stay in a cool room. If you must go out, do so early morning or late evening. Drink plenty of water and avoid heavy physical activities. Use air conditioners or fans to cool rooms.</p>
            
            <h3>During Fog</h3>
            <p>During fog, it's important to move carefully, especially by car. Use headlights and reduce speed. If you're a pedestrian, wear bright clothing for better visibility. Avoid long trips during heavy fog.</p>
          </section>
          
          <section>
            <h2>Useful Tips for Daily Life</h2>
            
            <h3>Activity Planning</h3>
            <p>Always check the weather forecast before planning outdoor activities. If you're planning a trip, check the forecast for the destination and route. Plan alternative activities in case of bad weather.</p>
            
            <h3>Clothing According to Weather</h3>
            <p>Dress according to the forecast, but always have spare clothing. In unstable weather, dress in layers. Use appropriate footwear for different weather conditions.</p>
            
            <h3>Health and Weather</h3>
            <p>Weather can affect health. At high temperatures, drink plenty of water and avoid sun exposure. At low temperatures, dress warmly and avoid long stays outdoors. During atmospheric pressure changes, people with chronic conditions should be especially careful.</p>
          </section>
        </div>
      )}
    </div>
  );
}

export default WeatherTips;
