import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const handleGoogleLogin = async () => {
    try {
      // 구글 로그인 로직이 여기에 들어갈 예정
      console.log("Google login pressed");

      // 임시로 로그인 성공 처리 - 메인 탭으로 이동
      router.replace("/(tabs)/subscriptions" as any);
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460"]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* 로고 영역 */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>SM</Text>
            </View>
            <Text style={styles.appName}>Subscription Manager</Text>
            <Text style={styles.subtitle}>구독 서비스를 쉽게 관리하세요</Text>
          </View>

          {/* 구독 아이콘들 */}
          <View style={styles.subscriptionIcons}>
            <View style={styles.iconRow}>
              <View style={[styles.iconBox, { backgroundColor: "#FF6B6B" }]}>
                <Text style={styles.iconText}>N</Text>
              </View>
              <View style={[styles.iconBox, { backgroundColor: "#4ECDC4" }]}>
                <Text style={styles.iconText}>S</Text>
              </View>
              <View style={[styles.iconBox, { backgroundColor: "#45B7D1" }]}>
                <Text style={styles.iconText}>Y</Text>
              </View>
            </View>
            <View style={styles.iconRow}>
              <View style={[styles.iconBox, { backgroundColor: "#FFA726" }]}>
                <Text style={styles.iconText}>A</Text>
              </View>
              <View style={[styles.iconBox, { backgroundColor: "#AB47BC" }]}>
                <Text style={styles.iconText}>D</Text>
              </View>
            </View>
          </View>

          {/* 구글 로그인 버튼 */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
          >
            <View style={styles.googleButtonContent}>
              <View style={styles.googleIconContainer}>
                <Text style={styles.googleIcon}>G</Text>
              </View>
              <Text style={styles.googleButtonText}>Google로 시작하기</Text>
            </View>
          </TouchableOpacity>

          {/* 약관 텍스트 */}
          <Text style={styles.termsText}>
            로그인하면 <Text style={styles.termsLink}>이용약관</Text> 및{" "}
            <Text style={styles.termsLink}>개인정보처리방침</Text>에 동의하게
            됩니다.
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4ECDC4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#4ECDC4",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a2e",
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#B0BEC5",
    textAlign: "center",
  },
  subscriptionIcons: {
    marginBottom: 80,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  iconText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
    maxWidth: 300,
  },
  googleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4285F4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  googleIcon: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  termsText: {
    fontSize: 12,
    color: "#78909C",
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  termsLink: {
    color: "#4ECDC4",
    textDecorationLine: "underline",
  },
});
