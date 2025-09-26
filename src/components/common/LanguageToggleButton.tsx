"use client";

import React, { useState } from "react";
import { Globe, Languages } from "lucide-react";

export const LanguageToggleButton: React.FC = () => {
  // state demo, có thể thay bằng context i18n thực tế
  const [isGlobe, setIsGlobe] = useState(true);

  function toggleIcon() {
    setIsGlobe(!isGlobe);
    // ở đây bạn có thể gọi hàm đổi ngôn ngữ, ví dụ i18n.changeLanguage(...)
  }

  return (
    <button
      onClick={toggleIcon}
      className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-900 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
    >
      {isGlobe ? (
        <Globe className="w-5 h-5" />
      ) : (
        <Languages className="w-5 h-5" />
      )}
    </button>
  );
};
