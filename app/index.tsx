import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "./context/AuthContext";

export default function Index() {
  const { user, isLoading, isLoggedIn } = useAuth();

  useEffect(() => {
    checkAuthStatus();
  }, [isLoading, isLoggedIn]);

  const checkAuthStatus = async () => {
    // AuthContext의 로딩이 완료될 때까지 기다림
    if (isLoading) {
      return;
    }

    try {
      // Small delay to show loading screen (선택사항 - 나중에 삭제 가능)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (isLoggedIn && user) {
        // 사용자가 로그인된 상태, 메인 탭으로 이동
        console.log("사용자 로그인 확인됨, 메인으로 이동");
        router.replace("/(tabs)/subscriptions" as any);
      } else {
        // 사용자가 로그인되지 않은 상태, 로그인 화면으로 이동
        console.log("사용자 로그인 안됨, 로그인 화면으로 이동");
        router.replace("/(auth)/login" as any);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      // 오류 발생 시 로그인 화면으로 이동
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
