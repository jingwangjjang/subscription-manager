import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';

export default function LoginScreen() {
  const BACKEND_URL = Config.BACKEND_URL || "http://localhost:8080/auth/google-login";

  useEffect(() => {
    // Google Sign-In 설정
    GoogleSignin.configure({
      webClientId: Config.GOOGLE_WEB_CLIENT_ID, // 웹 클라이언트 ID
      offlineAccess: true, // 서버에서 refresh token이 필요한 경우
      hostedDomain: '', // 특정 도메인으로 제한하려면 설정
      forceCodeForRefreshToken: true, // Android에서 refresh token을 받기 위해
      accountName: '', // Android에서 특정 계정으로 제한
      iosClientId: '1081259194070-your-ios-client-id.apps.googleusercontent.com', // iOS용 클라이언트 ID (필요시)
      googleServicePlistPath: '', // iOS용 (필요시)
      profileImageSize: 120, // 프로필 이미지 크기
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      // Google Play Services 사용 가능 여부 확인
      await GoogleSignin.hasPlayServices();
      
      // Google 로그인 실행
      const userInfo = await GoogleSignin.signIn();
      console.log('Google Sign-In Success:', userInfo);
      
      // ID Token을 별도로 가져오기
      const tokens = await GoogleSignin.getTokens();
      const idToken = tokens.idToken;
      
      if (!idToken) {
        throw new Error('ID Token을 받지 못했습니다.');
      }

      console.log('ID Token received:', idToken);

      // 서버로 ID Token 전송
      await sendTokenToServer(idToken);
      
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('로그인 취소', '사용자가 로그인을 취소했습니다.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('로그인 진행 중', '이미 로그인이 진행 중입니다.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Google Play Services 오류', 'Google Play Services를 사용할 수 없습니다.');
      } else {
        Alert.alert('로그인 오류', `구글 로그인 중 오류가 발생했습니다: ${error.message}`);
      }
    }
  };

  const sendTokenToServer = async (idToken: string) => {
    try {
      console.log("Sending ID Token to backend:", idToken);
      
      const backendResponse = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken: idToken,
        }),
      });

      if (!backendResponse.ok) {
        throw new Error(`HTTP error! status: ${backendResponse.status}`);
      }

      const result = await backendResponse.json();
      console.log("Backend response:", result);

      // 로그인 성공 처리
      if (result.token) {
        // 필요한 경우 사용자 정보를 AsyncStorage에 저장
        // await AsyncStorage.setItem('userToken', result.token);
        // await AsyncStorage.setItem('userInfo', JSON.stringify({
        //   email: result.email,
        //   name: result.name
        // }));
        
        Alert.alert("로그인 성공", `환영합니다, ${result.name || result.email}!`);
        router.replace("/(tabs)/subscriptions" as any);
      } else {
        throw new Error("토큰을 받지 못했습니다.");
      }
    } catch (error) {
      console.error("Backend request error:", error);
      Alert.alert("로그인 오류", `서버와의 통신 중 오류가 발생했습니다: ${error}`);
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

          {/* 구글 로그인 버튼 - 커스텀 버튼 */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
          >
            <View style={styles.googleButtonContent}>
              <View style={styles.googleIconContainer}>
                <Text style={styles.googleIcon}>G</Text>
              </View>
              <Text style={styles.googleButtonText}>Google로 시작하기</Text>
            </View>
          </TouchableOpacity>

          {/* 또는 Google 공식 버튼 사용 (선택사항) */}
          {/* 
          <GoogleSigninButton
            style={styles.googleSigninButton}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={handleGoogleSignIn}
          />
          */}

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
  // Google 공식 버튼용 스타일 (선택사항)
  googleSigninButton: {
    width: 300,
    height: 48,
    marginBottom: 30,
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