import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// 타입 정의
interface User {
  id?: string;
  email?: string;
  nickname?: string;
  token: string;
  isLoggedIn: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData?: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Context 생성
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// AuthProvider 컴포넌트
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 앱 시작시 토큰 확인
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async (): Promise<void> => {
    try {
      const token = await SecureStore.getItemAsync("jwt_token");
      if (token) {
        // const isValid = await validateToken(token);
        const isValid = true; // 임시로 true로 설정, 나중에 실제 검증 로직으로 변경
        if (isValid) {
          // axios 헤더에 토큰 설정
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          setUser({ token, isLoggedIn: true });
        } else {
          // 토큰이 유효하지 않으면 삭제
          await SecureStore.deleteItemAsync("jwt_token");
        }
      }
    } catch (error) {
      console.log("토큰 확인 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const validateToken = async (token: string): Promise<boolean> => {
  //   try {
  //     // 임시 토큰 검증 엔드포인트 - 백엔드 완성 후 실제 URL로 변경
  //     const response = await axios.get("/auth/validate", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     return response.status === 200;
  //   } catch (error) {
  //     console.log("토큰 검증 실패:", error);
  //     return false;
  //   }
  // };

  const login = async (
    token: string,
    userData: Partial<User> = {}
  ): Promise<void> => {
    try {
      // 1. SecureStore에 영구 저장
      await SecureStore.setItemAsync("jwt_token", token);

      // 2. axios 기본 헤더에 토큰 설정
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // 3. Context에 저장 (앱 전체에서 사용)
      setUser({
        token,
        isLoggedIn: true,
        ...userData, // 사용자 정보가 있으면 추가
      });

      console.log("로그인 성공 - 토큰 저장 완료");
    } catch (error) {
      console.error("로그인 처리 중 오류:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // 1. SecureStore에서 토큰 삭제
      await SecureStore.deleteItemAsync("jwt_token");

      // 2. axios 헤더에서 토큰 제거
      delete axios.defaults.headers.common["Authorization"];

      // 3. Context 상태 초기화
      setUser(null);

      console.log("로그아웃 완료");
    } catch (error) {
      console.error("로그아웃 처리 중 오류:", error);
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isLoggedIn: user?.isLoggedIn || false,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// 커스텀 훅 - useAuth
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
