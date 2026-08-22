import { createContext, useContext, useState, useEffect } from "react";

type ThemePalette = "coral" | "sage" | "blue" | "purple" | "yellow" | "black";
type ThemeMode = "light" | "dark";
type ThemeModePreference = "light" | "dark" | "system";
type ThemeFont = "clean" | "sketch" | "pocket";

interface ThemeContextType {
  palette: ThemePalette;
  mode: ThemeMode;
  modePreference: ThemeModePreference;
  font: ThemeFont;
  setPalette: (p: ThemePalette) => void;
  setMode: (m: ThemeMode) => void;
  setModePreference: (m: ThemeModePreference) => void;
  setFont: (f: ThemeFont) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  palette: "coral",
  mode: "light",
  modePreference: "light",
  font: "pocket",
  setPalette: () => {},
  setMode: () => {},
  setModePreference: () => {},
  setFont: () => {},
  toggleMode: () => {},
});

const VALID_FONTS: ThemeFont[] = ["clean", "sketch", "pocket"];

export function useTheme() {
  return useContext(ThemeContext);
}

const PALETTE_KEY = "couple-app-palette";
const MODE_KEY = "couple-app-mode";
const FONT_KEY = "couple-app-font";

const VALID_PALETTES: ThemePalette[] = ["coral", "sage", "blue", "purple", "yellow", "black"];

function resolveSystemMode(): ThemeMode {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPaletteState] = useState<ThemePalette>(() => {
    const saved = localStorage.getItem(PALETTE_KEY);
    return VALID_PALETTES.includes(saved as ThemePalette) ? (saved as ThemePalette) : "coral";
  });

  const [modePreference, setModePrefState] = useState<ThemeModePreference>(() => {
    const saved = localStorage.getItem(MODE_KEY);
    if (saved === "dark" || saved === "light" || saved === "system") return saved;
    return "light";
  });

  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(MODE_KEY);
    if (saved === "dark") return "dark";
    if (saved === "light") return "light";
    if (saved === "system") return resolveSystemMode();
    return "light";
  });

  const [font, setFontState] = useState<ThemeFont>(() => {
    const saved = localStorage.getItem(FONT_KEY);
    return VALID_FONTS.includes(saved as ThemeFont) ? (saved as ThemeFont) : "pocket";
  });

  const setPalette = (p: ThemePalette) => {
    setPaletteState(p);
    localStorage.setItem(PALETTE_KEY, p);
  };

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    setModePrefState(m);
    localStorage.setItem(MODE_KEY, m);
  };

  const setModePreference = (m: ThemeModePreference) => {
    setModePrefState(m);
    localStorage.setItem(MODE_KEY, m);
    if (m === "system") {
      setModeState(resolveSystemMode());
    } else {
      setModeState(m);
    }
  };

  const setFont = (f: ThemeFont) => {
    setFontState(f);
    localStorage.setItem(FONT_KEY, f);
  };

  const toggleMode = () => setMode(mode === "light" ? "dark" : "light");

  useEffect(() => {
    if (modePreference !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setModeState(e.matches ? "dark" : "light");
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [modePreference]);

  useEffect(() => {
    document.documentElement.setAttribute("data-palette", palette);
    document.documentElement.setAttribute("data-mode", mode);
    document.documentElement.setAttribute("data-font", font);
  }, [palette, mode, font]);

  return (
    <ThemeContext.Provider
      value={{ palette, mode, modePreference, font, setPalette, setMode, setModePreference, setFont, toggleMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
