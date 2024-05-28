import { useEffect, useState } from 'react';
import ThemeButton from './components/themebutton';
type Theme = {
  name: string;
  gifUrl: string;
  bodyColor: string;
  compColor: string;
};
export default function App() {
  const [isGifApplied, setIsGifApplied] = useState(false);
  const [appliedTheme, setAppliedTheme] = useState<string | null>(null);

  const originalSrcMap = new Map();
  const themes = [
    {
      name: 'Dog',
      gifUrl: 'https://media.tenor.com/rkAH9R3AyBMAAAAM/dog-meme-black-dog-meme.gif',
      bodyColor: '#f0f8ff', // Light blue color to match a friendly dog theme
      compColor: '#333333', // Example color
    },
    {
      name: 'Goku',
      gifUrl: 'https://giffiles.alphacoders.com/339/33944.gif',
      bodyColor: '#f0e68c', // Light yellow to match Goku's Super Saiyan aura
      compColor: '#333333', // Example color
    },
    {
      name: 'Ok',
      gifUrl: 'https://i.pinimg.com/originals/20/d7/8e/20d78ebeeb5c059eaba70dc979ab8fa9.gif',
      bodyColor: '#fffacd', // Lemon chiffon to match a calm reaction
      compColor: '#333333', // Example color
    },
    {
      name: 'Shocked',
      gifUrl: 'https://i.imgflip.com/4/6woq7y.jpg',
      bodyColor: '#ffebcd', // Blanched almond to match a shocked expression
      compColor: '#333333', // Example color
    },
  ];

  useEffect(() => {
    console.log('content UI loaded');
    
  
    insertChangeProfileButton();
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'changePhotos') {
        handleTogglePhotos(themes.find(theme => theme.name === appliedTheme)?.gifUrl || '');
        sendResponse({ status: 'photosChanged' });
      }
    });
  }, []);
  
  const handleTogglePhotos = (gifUrl: string) => {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (appliedTheme) {
        img.src = originalSrcMap.get(img); // Restore original image source
      } else {
        if (!originalSrcMap.has(img)) {
          originalSrcMap.set(img, img.src);
        }
        img.src = gifUrl;
      }
    });
    setAppliedTheme(appliedTheme ? null : gifUrl);
  };
  const applyStyles = (theme: Theme) => {
    document.body.style.setProperty('background-color', theme.bodyColor, 'important');
    document.body.style.color = theme.compColor;
    handleTogglePhotos(theme.gifUrl);
  };

  const handleThemeClick = (theme: Theme) => {
    if (appliedTheme === theme.name) {
      handleTogglePhotos('');
    } else {
      applyStyles(theme);
    }
    setAppliedTheme(appliedTheme === theme.name ? null : theme.name);
  };


  function insertChangeProfileButton() {

    const xpathExpression = '//body/div[5]/div[3]/div[1]/div[1]/div[2]/div[1]/div[1]/main[1]/section[1]/div[2]/div[3]';
    const result = document.evaluate(xpathExpression, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    const parentDiv = result.singleNodeValue;
  
    if (parentDiv) {
      // Create the new button element
      // const newButton = document.createElement('button');
      // newButton.innerText = 'Change Profile Photos';
      // newButton.className = 'artdeco-button artdeco-button--2 artdeco-button--primary m0 mr2';
      // newButton.style.marginLeft = '10px'; // Add margin to the left to position it correctly
     
      const newDiv = document.createElement('div');
      newDiv.style.display = 'flex';
      newDiv.style.gap = '5px';
      // newDiv.style.padding = '1rem';

      themes.forEach((theme) => {
        const newButton = document.createElement('button');
        newButton.className = 'artdeco-button artdeco-button--2 artdeco-button--primary m0 mr2';
        // newButton.style.width = '64px';
        // newButton.style.height = '64px';
        newButton.style.borderRadius = '50%';
        newButton.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
        newButton.style.border = '2px solid #ccc';
        newButton.style.backgroundImage = `url(${theme.gifUrl})`;
        newButton.style.backgroundSize = 'cover';
        newButton.style.backgroundPosition = 'center';
        newButton.addEventListener('click', () => handleThemeClick(theme));
        newDiv.appendChild(newButton);
      });
      parentDiv.appendChild(newDiv);
      // Insert the new button into the parent div
    } else {
      console.warn('Parent div not found.');
    }
  }

  return (
    <div className="flex gap-1 text-blue-500">
      {/* <button 
        onClick={handleTogglePhotos} 
        className="font-bold py-2 px-4 rounded shadow bg-blue-500 text-white hover:bg-blue-700"
      >
        {isGifApplied ? 'Restore Original Photos' : 'Change Profile Photos'}
      </button> */}
    </div>
  );
}