import React, { useEffect, useState } from "react";

function LocalClock({ timezoneOffset }) {
  const [time, setTime] = useState("--:--:--");

  function getLocalTime() {
    if (typeof timezoneOffset !== "number") return "--:--:--";
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const local = new Date(utc + timezoneOffset * 1000);
    return local.toLocaleTimeString();
  }

  useEffect(() => {
    setTime(getLocalTime());
    const interval = setInterval(() => {
      setTime(getLocalTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [timezoneOffset]);

  return (
    <div className="header-clock">
      <span role="img" aria-label="clock" style={{marginRight: 4}}>🕒</span>
      {time}
    </div>
  );
}

export default LocalClock;