import React from 'react';


interface ThemeButtonProps {
    themeName: string;
    gifUrl: string;
    isApplied: boolean;
    onClick: () => void;
}

const ThemeButton: React.FC<ThemeButtonProps> = ({ themeName, gifUrl, isApplied, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 rounded-full shadow ${isApplied ? 'border-2 border-blue-500' : ''}`}
      style={{
        backgroundImage: `url(${gifUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      aria-label={`Apply ${themeName} theme`}
    />
  );
};

export default ThemeButton;
