import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Index() {
  useEffect(() => {
    // Check authentication status
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isAuthenticated = false; // This will be replaced with actual auth check

      // Small delay to show loading screen -> delete later
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (isAuthenticated) {
        // User is logged in, redirect to main tabs
        router.replace("/(tabs)" as any);
      } else {
        // User is not logged in, redirect to login
        router.replace("/(auth)/login" as any);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      // On error, redirect to login
      router.replace("/(auth)/login" as any);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#1a1a2e" />
      <ActivityIndicator size="large" color="#4ECDC4" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
  },
});
