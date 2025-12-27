import { ThemeProvider } from "@/context/themeContext";
import { initDB } from "@/db/database";
import { Stack } from "expo-router";
import { useEffect } from "react";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  useEffect(() => {
    (async () => {
      await initDB();
      console.log("Database initialized");
    })();
  }, []);

  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          animation: "fade",
          headerShown: false
        }}
      >
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="addEntry" options={{ title: "AddEntry" }} />
        <Stack.Screen name="report" options={{ title: "Report" }} />
      </Stack>
      <Toast />
    </ThemeProvider>
  )
}
