import { ReactNode, useState, createContext, useContext, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

type Theme = "light" | "dark";

interface ThemeContextType {
   theme: Theme;
   toggleTheme: () => void;
}

const defaultThemeContext: ThemeContextType = {
   theme: "light",
   toggleTheme: () => { },
};

const THEME_KEY = "@app_theme";

const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
   const colorScheme = useColorScheme();
   const themeColor: Theme = colorScheme === "dark" ? "dark" : "light";
   const [theme, setTheme] = useState<Theme>(themeColor);

   useEffect(() => {
      const loadTheme = async () => {
         try {
            const storedTheme = await AsyncStorage.getItem(THEME_KEY);
            if (storedTheme === "light" || storedTheme === "dark") {
               setTheme(storedTheme);
            }
         } catch (error) {
            console.log("Error loading theme:", error);
         } 
      };

      loadTheme();
   }, []);

   const toggleTheme = async () => {
      try {
         const newTheme: Theme = theme === "light" ? "dark" : "light";
         setTheme(newTheme);
         await AsyncStorage.setItem(THEME_KEY, newTheme);
      } catch (error) {
         console.log("Error saving theme:", error);
      }
   };

   return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
         {children}
      </ThemeContext.Provider>
   )
}

export const useTheme = () => useContext(ThemeContext);