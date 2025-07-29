import axios, { AxiosError } from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext"; // AuthContext import 경로에 맞게 수정

// 타입 정의
interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    nickname: string;
  };
}

interface ApiError {
  message: string;
}

// axios 기본 설정
const API_BASE_URL = "http://34.64.165.16:8080";
axios.defaults.baseURL = API_BASE_URL;

// axios 요청 인터셉터 - JWT 토큰 자동 헤더 추가
axios.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("jwt_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log("토큰 로드 실패:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default function LoginScreen(): React.JSX.Element {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState<boolean>(true); // true: 로그인, false: 회원가입
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      Alert.alert("오류", "이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post<LoginResponse>("/auth/login", {
        email: email.toLowerCase().trim(),
        password: password,
      });

      const { token, user } = response.data;

      // Context의 login 함수 사용 (SecureStore 저장 + Context 상태 업데이트)
      await login(token, user);

      console.log("Login successful");
      router.replace("/(tabs)/subscriptions" as any);
    } catch (error) {
      console.error("Login error:", error);
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage =
        axiosError.response?.data?.message || "로그인에 실패했습니다.";
      Alert.alert("로그인 실패", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (): Promise<void> => {
    if (!email || !password || !nickname) {
      Alert.alert("오류", "모든 필드를 입력해주세요.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("오류", "비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/auth/signup", {
        email: email.toLowerCase().trim(),
        password: password,
        nickname: nickname.trim(),
      });

      Alert.alert(
        "회원가입 성공",
        "회원가입이 완료되었습니다. 로그인해주세요.",
        [
          {
            text: "확인",
            onPress: () => {
              setIsLogin(true);
              setPassword("");
              setNickname("");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Signup error:", error);
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage =
        axiosError.response?.data?.message || "회원가입에 실패했습니다.";
      Alert.alert("회원가입 실패", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (): void => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setNickname("");
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

          {/* 로그인/회원가입 폼 */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>
              {isLogin ? "로그인" : "회원가입"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="이메일"
              placeholderTextColor="#78909C"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              style={styles.input}
              placeholder="비밀번호"
              placeholderTextColor="#78909C"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="닉네임"
                placeholderTextColor="#78909C"
                value={nickname}
                onChangeText={setNickname}
                autoCapitalize="none"
                autoCorrect={false}
              />
            )}

            <TouchableOpacity
              style={[styles.authButton, loading && styles.authButtonDisabled]}
              onPress={isLogin ? handleLogin : handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.authButtonText}>
                  {isLogin ? "로그인" : "회원가입"}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleMode} style={styles.toggleButton}>
              <Text style={styles.toggleText}>
                {isLogin
                  ? "계정이 없으신가요? 회원가입"
                  : "이미 계정이 있으신가요? 로그인"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 약관 텍스트 */}
          <Text style={styles.termsText}>
            {isLogin ? "로그인" : "회원가입"}하면{" "}
            <Text style={styles.termsLink}>이용약관</Text> 및{" "}
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
    marginBottom: 40,
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
    marginBottom: 40,
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
  formContainer: {
    width: "100%",
    maxWidth: 320,
    marginBottom: 30,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  authButton: {
    backgroundColor: "#4ECDC4",
    borderRadius: 25,
    paddingVertical: 15,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#4ECDC4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  authButtonDisabled: {
    opacity: 0.7,
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  toggleButton: {
    paddingVertical: 10,
  },
  toggleText: {
    fontSize: 14,
    color: "#4ECDC4",
    textAlign: "center",
    textDecorationLine: "underline",
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
