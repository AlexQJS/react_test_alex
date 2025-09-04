import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Represents a theme
 * @property theme - Unique identifier for the task.
 * @property toggleTheme - Toggle themes function
 */
interface ThemeContextProps {
    theme: string;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

/**
 * Custom hook to get the page theme
 * @returns {ThemeContextProps}
 */
const useTheme = (): ThemeContextProps => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

/**
 * Handles theme swap and saves data in localStorage
 * @param children
 * @returns 
 */
const ThemeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    //Themes constant structure improved for future changes
    const THEMES_LIST = { LIGHT: 'light', DARK: 'dark' };
    const THEMES_KEY = 'themes';

    const [theme, setTheme] = useState(THEMES_LIST.LIGHT);

    //Save theme status in localStorage
    useEffect(() => {
        const storedTheme = localStorage.getItem(THEMES_KEY);
        setTheme(storedTheme ?? THEMES_LIST.LIGHT);
    }, []);

    //Toggles between light and dark theme.
    //Logic should be updated if there is one more theme in the project
    const toggleTheme = () => {
        const newTheme = theme === THEMES_LIST.LIGHT ? THEMES_LIST.DARK : THEMES_LIST.LIGHT;
        localStorage.setItem(THEMES_KEY, newTheme);
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div className={theme}> {children} </div>
        </ThemeContext.Provider>
    );
};

export { ThemeProvider, ThemeContext, useTheme };
