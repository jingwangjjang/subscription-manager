import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" backgroundColor="#1a1a2e" />
      <Stack
        screenOptions={{
          headerShown: false, // This hides all headers
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      ></Stack>
    </AuthProvider>
  );
}
