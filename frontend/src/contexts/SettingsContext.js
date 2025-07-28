// frontend/src/contexts/SettingsContext.js
import { createContext, useContext, useState } from "react";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    // 프로필
    name: "",
    email: "",
    department: "",

    // 이메일 톤
    defaultTone: "polite",

    // AI 분석
    analysisLevel: "detailed",
    autoCorrection: true,

    // 알림
    emailNotifications: true,
    browserNotifications: false,
    weeklyReport: true,

    // 데이터
    saveHistory: true,
    dataRetention: "30"
  });

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};


export const useSettings = () => useContext(SettingsContext);
