import axios, { AxiosError } from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "../components/CustomText";
import { useAuth } from "../context/AuthContext";

// Type definitions
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

// axios configuration
const API_BASE_URL = "http://34.64.165.16:8080";
axios.defaults.baseURL = API_BASE_URL;

// axios request interceptor - auto JWT token header
axios.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("jwt_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log("Token load failed:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const EyeIcon = ({
  visible,
  size = 20,
}: {
  visible: boolean;
  size?: number;
}) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: 16, color: "#9CA3AF" }}>
      {visible ? "🙉" : "🙈"}
    </Text>
  </View>
);

export default function LoginScreen(): React.JSX.Element {
  const { login } = useAuth();
  const insets = useSafeAreaInsets();
  const [currentScreen, setCurrentScreen] = useState<
    "welcome" | "login" | "register"
  >("welcome");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // 패스워드 표시 상태 관리
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  // 포커스 상태 관리 (register 화면용)
  const [isEmailFocused, setIsEmailFocused] = useState<boolean>(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState<boolean>(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState<boolean>(false);

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post<LoginResponse>("/auth/login", {
        email: email.toLowerCase().trim(),
        password: password,
      });

      const { token, user } = response.data;

      // Use Context's login function (SecureStore save + Context state update)
      await login(token, user);

      console.log("Login successful");
      router.replace("/(tabs)/subscriptions" as any);
    } catch (error) {
      console.error("Login error:", error);
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage =
        axiosError.response?.data?.message || "Login failed.";
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (): Promise<void> => {
    if (!email || !password || !username) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/auth/signup", {
        email: email.toLowerCase().trim(),
        password: password,
        nickname: username.trim(),
      });

      Alert.alert(
        "Registration Successful",
        "Registration completed. Please login.",
        [
          {
            text: "OK",
            onPress: () => {
              setCurrentScreen("login");
              setPassword("");
              setConfirmPassword("");
              setUsername("");
              setShowPassword(false);
              setShowConfirmPassword(false);
              setIsEmailFocused(false);
              setIsPasswordFocused(false);
              setIsConfirmPasswordFocused(false);
            },
          },
        ]
      );
    } catch (error) {
      console.error("Signup error:", error);
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage =
        axiosError.response?.data?.message || "Registration failed.";
      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = (): void => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUsername("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsEmailFocused(false);
    setIsPasswordFocused(false);
    setIsConfirmPasswordFocused(false);
  };

  // Welcome Screen
  if (currentScreen === "welcome") {
    return (
      <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
        <View className="flex-1 px-6 py-10">
          {/* Illustration Area */}
          <View className="flex-1 justify-center items-center mb-8">
            <View className="w-96 h-96 justify-center items-center mb-6">
              <Image
                source={require("../../assets/images/welcome-img.gif")}
                style={{ width: 384, height: 384 }}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* App Info */}
          <View className="items-start mb-7 w-full">
            <View className="flex-row items-center mb-3">
              <Image
                source={require("../../assets/images/subpie-logo.png")}
                style={{ width: 35, height: 35 }}
                resizeMode="contain"
                className="mr-2"
              />
              <Text weight="bold" className="text-3xl">
                Sub
              </Text>
              <Text className="text-3xl">pie</Text>
            </View>

            <Text
              weight="bold"
              className="text-3xl text-left leading-normal
               mb-3 w-full"
            >
              All Your Subscriptions, One Smart App
            </Text>
            <Text className="text-base text-gray-600 text-left leading-6 w-full">
              Daily AI updates on your services, smart spending insights, and
              zero missed payments. Finally, subscriptions made simple.
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="gap-4">
            <TouchableOpacity
              className="bg-blue-600 rounded-3xl py-5 items-center shadow-lg"
              style={{
                shadowColor: "#3225eb",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4,
              }}
              onPress={() => {
                resetForm();
                setCurrentScreen("login");
              }}
            >
              <Text weight="semibold" className="text-white text-base">
                Login
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-transparent border border-gray-300 rounded-3xl py-5 items-center"
              onPress={() => {
                resetForm();
                setCurrentScreen("register");
              }}
            >
              <Text weight="semibold" className="text-gray-700 text-base">
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Login Screen
  if (currentScreen === "login") {
    return (
      <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
        <View className="flex-1 px-6">
          <TouchableOpacity
            className="absolute left-6 w-10 h-10 rounded-xl bg-white justify-center items-center shadow-md z-10"
            style={{
              top: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
            onPress={() => setCurrentScreen("welcome")}
          >
            <Text weight="semibold" className="text-lg text-gray-700">
              ←
            </Text>
          </TouchableOpacity>

          <View className="items-center pt-20 pb-10">
            <Image
              source={require("../../assets/images/subpie-logo.png")}
              style={{ width: 70, height: 70 }}
            />
          </View>

          <View className="flex-1 justify-center">
            <View className="items-start mb-10 w-full">
              <Text
                weight="bold"
                className="text-3xl text-black mb-3 text-left"
              >
                Login
              </Text>
              <Text className="text-base text-gray-600 text-left">
                Login to continue using the app
              </Text>
            </View>

            <View className="flex-1 gap-5">
              <View>
                <Text weight="medium" className="text-lg text-gray-700 mb-2">
                  Email
                </Text>
                <TextInput
                  className="bg-gray-100 rounded-3xl px-4 py-4 text-base text-gray-800 border border-gray-200"
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View>
                <Text weight="medium" className="text-lg text-gray-700 mb-2">
                  Password
                </Text>
                <View className="relative">
                  <TextInput
                    className="bg-gray-100 rounded-3xl px-4 py-4 pr-12 text-base text-gray-800 border border-gray-200"
                    placeholder="Enter password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-0 bottom-0 justify-center"
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <EyeIcon visible={showPassword} size={20} />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity className="self-end">
                <Text className="text-gray-600 text-sm">Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`bg-blue-600 rounded-3xl py-5 items-center ${loading ? "opacity-70" : ""}`}
                style={{
                  shadowColor: "#2563EB",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 4,
                }}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text weight="semibold" className="text-white text-base">
                    Login
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center"
                onPress={() => {
                  resetForm();
                  setCurrentScreen("register");
                }}
              >
                <Text className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Text weight="medium" className="text-blue-600">
                    Register
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // 각 필드별로 다른 이동 거리 설정
  const getTranslateY = () => {
    if (isConfirmPasswordFocused) return -250;
    if (isPasswordFocused) return -165;
    if (isEmailFocused) return -65;
    return 0;
  };

  // Register Screen
  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      <View
        className="flex-1 px-6"
        style={{
          transform: [{ translateY: getTranslateY() }],
        }}
      >
        <TouchableOpacity
          className="absolute left-6 w-10 h-10 rounded-xl bg-white justify-center items-center shadow-md z-10"
          style={{
            top: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
          onPress={() => setCurrentScreen("welcome")}
        >
          <Text weight="semibold" className="text-lg text-gray-700">
            ←
          </Text>
        </TouchableOpacity>

        <View className="items-center pt-20 pb-10">
          <Image
            source={require("../../assets/images/subpie-logo.png")}
            style={{ width: 70, height: 70 }}
          />
        </View>

        <View className="flex-1 justify-start">
          <View className="items-start mb-9 w-full">
            <Text weight="bold" className="text-3xl text-black mb-3 text-left">
              Register
            </Text>
            <Text className="text-base text-gray-600 text-left">
              Enter Your Personal Information
            </Text>
          </View>

          <View className="flex-1 gap-5">
            <View>
              <Text weight="medium" className="text-lg text-gray-700 mb-2">
                Username
              </Text>
              <TextInput
                className="bg-gray-100 rounded-3xl px-4 py-4 text-base text-gray-800 border border-gray-200"
                placeholder="Enter your name"
                placeholderTextColor="#9CA3AF"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View>
              <Text weight="medium" className="text-lg text-gray-700 mb-2">
                Email
              </Text>
              <TextInput
                className="bg-gray-100 rounded-3xl px-4 py-4 text-base text-gray-800 border border-gray-200"
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
              />
            </View>

            <View>
              <Text weight="medium" className="text-lg text-gray-700 mb-2">
                Password
              </Text>
              <View className="relative">
                <TextInput
                  className="bg-gray-100 rounded-3xl px-4 py-4 pr-12 text-base text-gray-800 border border-gray-200"
                  placeholder="Enter password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                />
                <TouchableOpacity
                  className="absolute right-4 top-0 bottom-0 justify-center"
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <EyeIcon visible={showPassword} size={20} />
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text weight="medium" className="text-lg text-gray-700 mb-2">
                Confirm password
              </Text>
              <View className="relative">
                <TextInput
                  className="bg-gray-100 rounded-3xl px-4 py-4 pr-12 text-base text-gray-800 border border-gray-200"
                  placeholder="Enter confirm password"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  onFocus={() => setIsConfirmPasswordFocused(true)}
                  onBlur={() => setIsConfirmPasswordFocused(false)}
                />
                <TouchableOpacity
                  className="absolute right-4 top-0 bottom-0 justify-center"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <EyeIcon visible={showConfirmPassword} size={20} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              className={`bg-blue-600 rounded-3xl py-5 items-center mt-3 ${loading ? "opacity-70" : ""}`}
              style={{
                shadowColor: "#2563EB",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4,
              }}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text weight="semibold" className="text-white text-base">
                  Register
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center"
              onPress={() => {
                resetForm();
                setCurrentScreen("login");
              }}
            >
              <Text className="text-sm text-gray-600">
                Already have an account?{" "}
                <Text weight="medium" className="text-blue-600">
                  Login
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
