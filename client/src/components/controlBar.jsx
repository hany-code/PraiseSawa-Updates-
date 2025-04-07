import React, { useState, useEffect } from "react";
import { Plus, Maximize2, Monitor, X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import './controlBar.css'; // Import the CSS file

const ControlBar = ({
  selectedVerse,
  screens = [], // Default value for screens
  setScreens = () => {}, // Default value for setScreens
  isEndOfSong, // Add isEndOfSong prop
}) => {
  const [externalWindows, setExternalWindows] = useState({});
  const [blackScreens, setBlackScreens] = useState({});

  // Update external window content
  const updateExternalWindow = (window, verse, displayOptions, fontSizes, isBlackScreen) => {
    const shouldShowBlackScreen = isBlackScreen || isEndOfSong;
    
    if (shouldShowBlackScreen) {
      window.document.querySelector(".content").innerHTML = `
        <div style="width: 100vw; height: 100vh; background: black; position: fixed; top: 0; left: 0; display: flex; justify-content: center; align-items: center;">
          <img src="https://res.cloudinary.com/dtcr7vypb/image/upload/v1736086718/cee93lnyiospefvpmwvp.svg" alt="placeholder" style="max-width: 80%; max-height: 80%; object-fit: contain;" />
        </div>
      `;
      return;
    }

    // If no verse is selected, show black screen
    if (!verse) {
      window.document.querySelector(".content").innerHTML = `
        <div style="width: 100vw; height: 100vh; background: black; position: fixed; top: 0; left: 0;"></div>
      `;
      return;
    }

    // Ensure fontSizes is defined
    const safeFontSizes = fontSizes || {
      arabic: 2.5,
      english: 2.0,
      franco: 1.8,
    };

    // Calculate the number of active languages
    const activeLanguages = Object.values(displayOptions).filter(Boolean).length;

    // Set font size based on the number of active languages
    let fontSize;
    if (activeLanguages === 1) {
      fontSize = `${safeFontSizes.arabic}rem`;
    } else if (activeLanguages === 2) {
      fontSize = `${safeFontSizes.arabic}rem`;
    } else {
      fontSize = `${safeFontSizes.arabic}rem`;
    }

    const content = `
      <div class="content" style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 1rem;">
        ${displayOptions.arabic ? `<div class="verse arabic" style="font-size: ${fontSize}; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">${verse.arabic || ""}</div>` : ""}
        ${displayOptions.english ? `<div class="verse english" style="font-size: ${fontSize}; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">${verse.english || ""}</div>` : ""}
        ${displayOptions.franco ? `<div class="verse franco" style="font-size: ${fontSize}; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">${verse.franco || ""}</div>` : ""}
      </div>
    `;

    window.document.querySelector(".content").innerHTML = content;
  };

  // Adjust font size for all languages
  const adjustFontSize = (screenId, increase) => {
    setScreens((prev) =>
      prev.map((screen) => {
        if (screen.id === screenId) {
          const updatedScreen = {
            ...screen,
            fontSizes: {
              arabic: Math.max(0.8, Math.min(20, (screen.fontSizes?.arabic || 2.5) + (increase ? 0.2 : -0.2))),
              english: Math.max(0.8, Math.min(20, (screen.fontSizes?.english || 2.0) + (increase ? 0.2 : -0.2))),
              franco: Math.max(0.8, Math.min(20, (screen.fontSizes?.franco || 1.8) + (increase ? 0.2 : -0.2))),
            },
          };

          const externalWindow = externalWindows[screenId];
          if (externalWindow && !externalWindow.closed && selectedVerse) {
            updateExternalWindow(
              externalWindow,
              selectedVerse,
              updatedScreen.displayOptions,
              updatedScreen.fontSizes,
              blackScreens[screenId]
            );
          }

          return updatedScreen;
        }
        return screen;
      })
    );
  };

  // Reset font sizes to default
  const resetFontSizes = (screenId) => {
    setScreens((prev) =>
      prev.map((screen) => {
        if (screen.id === screenId) {
          const updatedScreen = {
            ...screen,
            fontSizes: {
              arabic: 2.5,
              english: 2.0,
              franco: 1.8,
            },
          };

          const externalWindow = externalWindows[screenId];
          if (externalWindow && !externalWindow.closed && selectedVerse) {
            updateExternalWindow(
              externalWindow,
              selectedVerse,
              updatedScreen.displayOptions,
              updatedScreen.fontSizes,
              blackScreens[screenId]
            );
          }

          return updatedScreen;
        }
        return screen;
      })
    );
  };

  // Toggle black screen
  const toggleBlackScreen = (screenId) => {
    setBlackScreens((prev) => {
      const newBlackScreens = {
        ...prev,
        [screenId]: !prev[screenId],
      };

      const externalWindow = externalWindows[screenId];
      if (externalWindow && !externalWindow.closed) {
        updateExternalWindow(
          externalWindow,
          selectedVerse,
          screens.find((s) => s.id === screenId).displayOptions,
          screens.find((s) => s.id === screenId).fontSizes,
          newBlackScreens[screenId]
        );
      }

      return newBlackScreens;
    });
  };

  // Add a new screen
  const addScreen = () => {
    const newId = screens.length + 1;
    setScreens((prev) => [
      ...prev,
      {
        id: newId,
        displayOptions: {
          arabic: true,
          english: true,
          franco: true,
        },
        fontSizes: {
          arabic: 2.5,
          english: 2.0,
          franco: 1.8,
        },
      },
    ]);
  };

  // Remove a screen
  const removeScreen = (id) => {
    if (externalWindows[id] && !externalWindows[id].closed) {
      externalWindows[id].close();
    }
    setExternalWindows((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    setScreens((prev) => prev.filter((screen) => screen.id !== id));
  };

  // Open external window
  const openExternalWindow = (screen) => {
    if (externalWindows[screen.id] && !externalWindows[screen.id].closed) {
      externalWindows[screen.id].close();
    }

    const newWindow = window.open(
      "",
      `screen_${screen.id}`,
      "popup=yes,width=800,height=600"
    );

    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Lyrics Display - Screen ${screen.id}</title>
            <style>
              body {
                margin: 0;
                padding: 2rem;
                background: #000;
                color: #fff;
                font-family: Arial, sans-serif;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                overflow: hidden;
              }
              .content {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 1rem;
              }
              .verse {
                margin-bottom: 2rem;
                padding: 1.5rem;
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.1);
                transition: font-size 0.3s ease;
              }
              .arabic {
                direction: rtl;
                text-align: right;
                font-family: Arial, sans-serif;
              }
              .english {
                text-align: center;
              }
              .franco {
                text-align: center;
                font-style: italic;
              }
            </style>
          </head>
          <body>
            <div class="content"></div>
          </body>
        </html>
      `);

      updateExternalWindow(
        newWindow,
        selectedVerse,
        screen.displayOptions,
        screen.fontSizes,
        blackScreens[screen.id]
      );
      newWindow.document.close();

      setExternalWindows((prev) => ({
        ...prev,
        [screen.id]: newWindow,
      }));
    }
  };

  // Update external windows when selectedVerse, screens, or isEndOfSong change
  useEffect(() => {
    Object.entries(externalWindows).forEach(([screenId, window]) => {
      if (!window.closed) {
        const screen = screens.find((s) => s.id === parseInt(screenId));
        if (screen) {
          updateExternalWindow(
            window,
            selectedVerse,
            screen.displayOptions,
            screen.fontSizes,
            blackScreens[screenId] || isEndOfSong
          );
        }
      }
    });
  }, [selectedVerse, screens, externalWindows, blackScreens, isEndOfSong]);

  return (
    <div className="control-bar fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gray-800 to-gray-900 p-3 rounded-xl shadow-2xl backdrop-blur-sm border border-gray-700 z-50">
      <div className="flex items-center gap-3">
        <button
          onClick={addScreen}
          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-all duration-300 hover:scale-110"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>

        {screens.map((screen) => (
          <div
            key={screen.id}
            className="flex items-center gap-2 bg-gray-700 p-2 rounded-lg"
          >
            <span className="text-sm text-white">Screen {screen.id}</span>

            <div className="flex gap-1">
              {["arabic", "english", "franco"].map((option) => (
                <button
                  key={option}
                  onClick={() =>
                    setScreens((prev) =>
                      prev.map((s) =>
                        s.id === screen.id
                          ? {
                              ...s,
                              displayOptions: {
                                ...s.displayOptions,
                                [option]: !s.displayOptions[option],
                              },
                            }
                          : s
                      )
                    )
                  }
                  className={`p-2 w-8 h-8 flex items-center justify-center rounded-full ${
                    screen.displayOptions[option] ? "bg-blue-600" : "bg-gray-600"
                  } hover:bg-blue-700 transition-colors`}
                >
                  <span className="text-xs text-white uppercase">{option[0]}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => toggleBlackScreen(screen.id)}
              className={`p-2 rounded-full ${
                blackScreens[screen.id] ? "bg-yellow-600" : "bg-gray-600"
              } hover:bg-yellow-700 transition-colors`}
            >
              <Monitor className="w-4 h-4 text-white" />
            </button>

            <div className="flex gap-1">
              <button
                onClick={() => adjustFontSize(screen.id, true)}
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
              >
                <ZoomIn className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => adjustFontSize(screen.id, false)}
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
              >
                <ZoomOut className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => resetFontSizes(screen.id)}
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-white" />
              </button>
            </div>

            <button
              onClick={() => openExternalWindow(screen)}
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
            >
              <Maximize2 className="w-4 h-4 text-white" />
            </button>

            <button
              onClick={() => removeScreen(screen.id)}
              className="p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ControlBar;