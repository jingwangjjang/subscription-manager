import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

const { width } = Dimensions.get("window");

// Sample subscription data
const subscriptions = [
  {
    id: "1",
    name: "Netflix",
    price: 17000,
    nextPayment: "2025-07-18",
    color: "#E50914",
    icon: "tv",
    category: "Entertainment",
  },
  {
    id: "2",
    name: "Spotify",
    price: 10900,
    nextPayment: "2025-07-20",
    color: "#1DB954",
    icon: "musical-notes",
    category: "Music",
  },
  {
    id: "3",
    name: "YouTube Premium",
    price: 11900,
    nextPayment: "2025-07-25",
    color: "#FF0000",
    icon: "play-circle",
    category: "Entertainment",
  },
  {
    id: "4",
    name: "Adobe Creative Cloud",
    price: 24000,
    nextPayment: "2025-07-30",
    color: "#FF0000",
    icon: "brush",
    category: "Design",
  },
];

export default function SubscriptionsScreen() {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [selectedDate, setSelectedDate] = useState("");
  const [fadeAnim] = useState(new Animated.Value(1));

  const toggleView = (mode: "calendar" | "list") => {
    if (mode === viewMode) return;

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setViewMode(mode);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  const getMarkedDates = () => {
    const marked: any = {};
    subscriptions.forEach((sub) => {
      marked[sub.nextPayment] = {
        marked: true,
        dotColor: sub.color,
        selectedColor: sub.color,
      };
    });
    return marked;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

  const getDaysUntilPayment = (date: string) => {
    const today = new Date();
    const paymentDate = new Date(date);
    const diffTime = paymentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const SubscriptionCard = ({ item, index }: { item: any; index: number }) => {
    const [cardAnim] = useState(new Animated.Value(0));
    const daysUntil = getDaysUntilPayment(item.nextPayment);

    React.useEffect(() => {
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.subscriptionCard,
          {
            opacity: cardAnim,
            transform: [
              {
                translateY: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={["#2D3748", "#1A202C"]}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View
                style={[styles.iconContainer, { backgroundColor: item.color }]}
              >
                <Ionicons name={item.icon as any} size={24} color="white" />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{item.name}</Text>
                <Text style={styles.serviceCategory}>{item.category}</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>{formatPrice(item.price)}</Text>
                <Text style={styles.priceLabel}>monthly</Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentLabel}>Next payment</Text>
                <Text style={styles.paymentDate}>{item.nextPayment}</Text>
              </View>
              <View style={styles.daysContainer}>
                <Text
                  style={[
                    styles.daysText,
                    { color: daysUntil <= 3 ? "#FF6B6B" : "#4ECDC4" },
                  ]}
                >
                  {daysUntil} days
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Subscriptions</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === "calendar" && styles.activeToggle,
            ]}
            onPress={() => toggleView("calendar")}
          >
            <Ionicons
              name="calendar"
              size={20}
              color={viewMode === "calendar" ? "#1a1a2e" : "#78909C"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === "list" && styles.activeToggle,
            ]}
            onPress={() => toggleView("list")}
          >
            <Ionicons
              name="list"
              size={20}
              color={viewMode === "list" ? "#1a1a2e" : "#78909C"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {viewMode === "calendar" ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.calendarContainer}>
              <Calendar
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={getMarkedDates()}
                theme={{
                  backgroundColor: "#1a1a2e",
                  calendarBackground: "#2D3748",
                  textSectionTitleColor: "#4ECDC4",
                  selectedDayBackgroundColor: "#4ECDC4",
                  selectedDayTextColor: "#1a1a2e",
                  todayTextColor: "#4ECDC4",
                  dayTextColor: "#FFFFFF",
                  textDisabledColor: "#78909C",
                  dotColor: "#4ECDC4",
                  selectedDotColor: "#1a1a2e",
                  arrowColor: "#4ECDC4",
                  monthTextColor: "#FFFFFF",
                  indicatorColor: "#4ECDC4",
                  textDayFontWeight: "600",
                  textMonthFontWeight: "bold",
                  textDayHeaderFontWeight: "600",
                  textDayFontSize: 16,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 14,
                }}
                style={styles.calendar}
              />
            </View>

            <View style={styles.upcomingSection}>
              <Text style={styles.sectionTitle}>Upcoming Payments</Text>
              {subscriptions.map((item, index) => (
                <SubscriptionCard key={item.id} item={item} index={index} />
              ))}
            </View>
          </ScrollView>
        ) : (
          <FlatList
            data={subscriptions}
            renderItem={({ item, index }) => (
              <SubscriptionCard item={item} index={index} />
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#2D3748",
    borderRadius: 25,
    padding: 4,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeToggle: {
    backgroundColor: "#4ECDC4",
  },
  content: {
    flex: 1,
  },
  calendarContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  calendar: {
    borderRadius: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  upcomingSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  subscriptionCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
  },
  cardGradient: {
    borderRadius: 15,
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  serviceCategory: {
    fontSize: 14,
    color: "#78909C",
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4ECDC4",
  },
  priceLabel: {
    fontSize: 12,
    color: "#78909C",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#374151",
  },
  paymentInfo: {
    flex: 1,
  },
  paymentLabel: {
    fontSize: 12,
    color: "#78909C",
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  daysContainer: {
    backgroundColor: "#374151",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  daysText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
