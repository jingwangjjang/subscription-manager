import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#1a1a2e" />
      <Stack
        screenOptions={{
          headerShown: false, // This hides all headers
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      ></Stack>
    </>
  );
}
