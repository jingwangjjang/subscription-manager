import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function MyPage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogout = async (): Promise<void> => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "로그아웃",
        onPress: async () => {
          setLoading(true);
          try {
            await logout();
            console.log("로그아웃 성공");
            router.replace("/(auth)/login" as any);
          } catch (error) {
            console.error("로그아웃 오류:", error);
            Alert.alert("오류", "로그아웃 중 문제가 발생했습니다.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleEditProfile = (): void => {
    Alert.alert("알림", "프로필 수정 기능은 준비 중입니다.");
  };

  const handleSettings = (): void => {
    Alert.alert("알림", "설정 기능은 준비 중입니다.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460"]}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>마이페이지</Text>
          </View>

          {/* 프로필 섹션 */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.nickname ? user.nickname.charAt(0).toUpperCase() : "U"}
                </Text>
              </View>
            </View>

            <Text style={styles.nickname}>{user?.nickname || "사용자"}</Text>

            <Text style={styles.email}>
              {user?.email || "user@example.com"}
            </Text>
          </View>

          {/* 구독 통계 (임시 데이터) */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>활성 구독</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>₩45,000</Text>
              <Text style={styles.statLabel}>월 결제액</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>알림 설정</Text>
            </View>
          </View>

          {/* 메뉴 항목들 */}
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleEditProfile}
            >
              <View style={styles.menuIconContainer}>
                <Text style={styles.menuIcon}>👤</Text>
              </View>
              <Text style={styles.menuText}>프로필 수정</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
              <View style={styles.menuIconContainer}>
                <Text style={styles.menuIcon}>⚙️</Text>
              </View>
              <Text style={styles.menuText}>설정</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() =>
                Alert.alert("알림", "고객센터 기능은 준비 중입니다.")
              }
            >
              <View style={styles.menuIconContainer}>
                <Text style={styles.menuIcon}>💬</Text>
              </View>
              <Text style={styles.menuText}>고객센터</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() =>
                Alert.alert("알림", "앱 정보 기능은 준비 중입니다.")
              }
            >
              <View style={styles.menuIconContainer}>
                <Text style={styles.menuIcon}>ℹ️</Text>
              </View>
              <Text style={styles.menuText}>앱 정보</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* 로그아웃 버튼 */}
          <TouchableOpacity
            style={[
              styles.logoutButton,
              loading && styles.logoutButtonDisabled,
            ]}
            onPress={handleLogout}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.logoutButtonText}>로그아웃</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#4ECDC4",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4ECDC4",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1a1a2e",
  },
  nickname: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: "#B0BEC5",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 40,
    alignItems: "center",
    justifyContent: "space-around",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4ECDC4",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#B0BEC5",
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  menuContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    marginBottom: 30,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(78, 205, 196, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuIcon: {
    fontSize: 18,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  menuArrow: {
    fontSize: 20,
    color: "#B0BEC5",
    fontWeight: "300",
  },
  logoutButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 25,
    paddingVertical: 15,
    marginTop: 20,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutButtonDisabled: {
    opacity: 0.7,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
});
