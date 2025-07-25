import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

const { width, height } = Dimensions.get("window");

type Subscription = {
  id: number;
  name: string;
  category:
    | "music" // Music streaming (Spotify, Apple Music)
    | "video" // Video streaming (Netflix, YouTube Premium)
    | "ai" // AI services (ChatGPT, Gemini, Perplexity)
    | "design" // Design tools (Adobe, Figma, development tools)
    | "news" // News/content (New York Times, Bloomberg)
    | "gaming" // Gaming (Xbox Game Pass, PlayStation Plus)
    | "fitness" // Fitness/health (fitness apps, meditation apps)
    | "education" // Education (online courses, language learning)
    | "cloud" // Cloud storage (Google Drive, Dropbox)
    | "ecommerce" // E-commerce/shopping (Amazon Prime, etc.)
    | "vpn" // VPN services
    | "utilities" // Utilities (password managers, font subscriptions)
    | "other"; // Other categories not listed above
  price: number;
  currency: "dollar" | "euro";
  payment_day: number; // Day of month (1-31)
  payment_type: string; // User-defined payment method
  is_annual: boolean; // default: False
  is_freetrial: boolean; // default: False
  freetrial_period?: number; // in days
  color: string; // "#FF0000"
  logo: string; // img link
  is_cancelled: boolean; // New field for cancelled subscriptions
};

// Sample subscription data
const initialSubscriptions: Subscription[] = [
  {
    id: 1,
    name: "Netflix",
    category: "video",
    price: 18.99,
    currency: "dollar",
    payment_day: 18,
    payment_type: "Credit Card",
    is_annual: false,
    is_freetrial: false,
    color: "#E50914",
    logo: "https://assets.nflxext.com/ffe/siteui/common/icons/nficon2016.png",
    is_cancelled: false,
  },
  {
    id: 2,
    name: "Spotify",
    category: "music",
    price: 9.99,
    currency: "dollar",
    payment_day: 20,
    payment_type: "Auto Transfer",
    is_annual: false,
    is_freetrial: false,
    color: "#1DB954",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg",
    is_cancelled: false,
  },
  {
    id: 3,
    name: "YouTube Premium",
    category: "video",
    price: 11.99,
    currency: "dollar",
    payment_day: 25,
    payment_type: "Credit Card",
    is_annual: false,
    is_freetrial: false,
    color: "#FF0000",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg",
    is_cancelled: false,
  },
  {
    id: 4,
    name: "Adobe Creative Cloud",
    category: "design",
    price: 20.99,
    currency: "euro",
    payment_day: 30,
    payment_type: "Debit Card",
    is_annual: false,
    is_freetrial: false,
    color: "#FF0000",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg",
    is_cancelled: false,
  },
];

const categories = [
  { key: "music", label: "Music", color: "#1DB954" },
  { key: "video", label: "Video", color: "#E50914" },
  { key: "ai", label: "AI", color: "#FF6B35" },
  { key: "design", label: "Design", color: "#FF0080" },
  { key: "news", label: "News", color: "#0066CC" },
  { key: "gaming", label: "Gaming", color: "#7B68EE" },
  { key: "fitness", label: "Fitness", color: "#32CD32" },
  { key: "education", label: "Education", color: "#FFD700" },
  { key: "cloud", label: "Cloud", color: "#4682B4" },
  { key: "ecommerce", label: "E-commerce", color: "#FF8C00" },
  { key: "vpn", label: "VPN", color: "#8A2BE2" },
  { key: "utilities", label: "Utilities", color: "#20B2AA" },
  { key: "other", label: "Other", color: "#808080" },
];

const currencies = [
  { key: "dollar", label: "USD ($)", symbol: "$" },
  { key: "euro", label: "EUR (€)", symbol: "€" },
];

const colorOptions = [
  "#4ECDC4",
  "#FF6B6B",
  "#1DB954",
  "#E50914",
  "#FF6B35",
  "#FF0080",
  "#0066CC",
  "#7B68EE",
  "#32CD32",
  "#FFD700",
  "#4682B4",
  "#FF8C00",
  "#8A2BE2",
  "#20B2AA",
  "#808080",
];

const paymentTypes = [
  "Credit Card",
  "Debit Card",
  "Auto Transfer",
  "PayPal",
  "Apple Pay",
  "Google Pay",
  "Bank Transfer",
  "Other",
];

export default function SubscriptionsScreen() {
  const [selectedDate, setSelectedDate] = useState("");
  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>(initialSubscriptions);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAnimation] = useState(new Animated.Value(0));
  const scrollViewRef = React.useRef<ScrollView>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "other" as Subscription["category"],
    price: "",
    currency: "dollar" as Subscription["currency"],
    payment_day: "", // Only day (1-31)
    payment_type: "Credit Card",
    is_annual: false,
    is_freetrial: false,
    freetrial_period: "",
    color: "#4ECDC4",
    logo: "",
  });

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "other",
      price: "",
      currency: "dollar",
      payment_day: "",
      payment_type: "Credit Card",
      is_annual: false,
      is_freetrial: false,
      freetrial_period: "",
      color: "#4ECDC4",
      logo: "",
    });
  };

  const calculateNextPaymentDate = (
    day: number,
    isAnnual: boolean,
    isFreeTrialActive: boolean,
    freeTrialDays?: number,
    isCancelled?: boolean
  ) => {
    const today = new Date();

    // If cancelled, don't calculate next payment
    if (isCancelled) {
      return null;
    }

    if (isFreeTrialActive && freeTrialDays) {
      // For free trial, calculate from today + trial period
      const trialEndDate = new Date(today);
      trialEndDate.setDate(today.getDate() + freeTrialDays);
      return trialEndDate.toISOString().split("T")[0];
    }

    // For regular subscriptions
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    let nextPaymentDate: Date;

    if (isAnnual) {
      // Annual subscription - same day next year
      nextPaymentDate = new Date(currentYear + 1, currentMonth, day);

      // If the day doesn't exist in the target month (e.g., Feb 31), use last day of month
      if (nextPaymentDate.getDate() !== day) {
        nextPaymentDate = new Date(currentYear + 1, currentMonth + 1, 0);
      }
    } else {
      // Monthly subscription
      if (day > currentDay) {
        // This month
        nextPaymentDate = new Date(currentYear, currentMonth, day);
      } else {
        // Next month
        nextPaymentDate = new Date(currentYear, currentMonth + 1, day);

        // If the day doesn't exist in the next month (e.g., Feb 31), use last day of month
        if (nextPaymentDate.getDate() !== day) {
          nextPaymentDate = new Date(currentYear, currentMonth + 2, 0);
        }
      }
    }

    return nextPaymentDate.toISOString().split("T")[0];
  };

  const handleAddSubscription = () => {
    if (!formData.name || !formData.price || !formData.payment_day) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const paymentDay = parseInt(formData.payment_day);
    if (paymentDay < 1 || paymentDay > 31) {
      Alert.alert("Error", "Payment day must be between 1 and 31");
      return;
    }

    if (formData.is_freetrial && !formData.freetrial_period) {
      Alert.alert("Error", "Please enter free trial period");
      return;
    }

    const newSubscription: Subscription = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      currency: formData.currency,
      payment_day: paymentDay,
      payment_type: formData.payment_type,
      is_annual: formData.is_annual,
      is_freetrial: formData.is_freetrial,
      freetrial_period: formData.is_freetrial
        ? parseInt(formData.freetrial_period)
        : undefined,
      color: formData.color,
      logo: formData.logo || "",
      is_cancelled: false,
    };

    setSubscriptions([...subscriptions, newSubscription]);
    closeModal();
  };

  const handleCancelSubscription = (id: number) => {
    Alert.alert(
      "Cancel Subscription",
      "Are you sure you want to cancel this subscription?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => {
            setSubscriptions((prevSubs) =>
              prevSubs.map((sub) =>
                sub.id === id ? { ...sub, is_cancelled: true } : sub
              )
            );
          },
        },
      ]
    );
  };

  const handleDeleteSubscription = (id: number) => {
    Alert.alert(
      "Delete Subscription",
      "Are you sure you want to permanently delete this subscription?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => {
            setSubscriptions((prevSubs) =>
              prevSubs.filter((sub) => sub.id !== id)
            );
          },
        },
      ]
    );
  };

  const getMarkedDates = () => {
    const marked: any = {};
    subscriptions.forEach((sub) => {
      const nextPaymentDate = calculateNextPaymentDate(
        sub.payment_day,
        sub.is_annual,
        sub.is_freetrial,
        sub.freetrial_period,
        sub.is_cancelled
      );
      if (nextPaymentDate) {
        marked[nextPaymentDate] = {
          marked: true,
          dotColor: sub.color,
          selectedColor: sub.color,
        };
      }
    });
    return marked;
  };

  const formatPrice = (price: number, currency: string) => {
    switch (currency) {
      case "dollar":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price);
      case "euro":
        return new Intl.NumberFormat("de-DE", {
          style: "currency",
          currency: "EUR",
        }).format(price);
      default:
        return price.toString();
    }
  };

  const getDaysUntilPayment = (date: string | null) => {
    if (!date) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    const paymentDate = new Date(date);
    paymentDate.setHours(0, 0, 0, 0); // Reset time to start of day

    const diffTime = paymentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  // Sort subscriptions by days until payment (closest first)
  // Note: In production, this sorting should be handled by the backend
  // The API should return subscriptions already sorted by payment_date with cancelled ones at the end

  const SubscriptionCard = ({
    item,
    index,
  }: {
    item: Subscription;
    index: number;
  }) => {
    const [cardAnim] = useState(new Animated.Value(0));
    const nextPaymentDate = calculateNextPaymentDate(
      item.payment_day,
      item.is_annual,
      item.is_freetrial,
      item.freetrial_period,
      item.is_cancelled
    );
    const daysUntil = getDaysUntilPayment(nextPaymentDate);

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
          colors={
            item.is_cancelled ? ["#6B7280", "#4B5563"] : ["#2D3748", "#1A202C"]
          }
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.logoContainer}>
                {item.logo ? (
                  <Image
                    source={{ uri: item.logo }}
                    style={[
                      styles.logo,
                      item.is_cancelled && styles.cancelledLogo,
                    ]}
                    resizeMode="contain"
                  />
                ) : (
                  <View
                    style={[
                      styles.logoPlaceholder,
                      {
                        backgroundColor: item.is_cancelled
                          ? "#6B7280"
                          : item.color,
                      },
                    ]}
                  >
                    <Text style={styles.logoText}>
                      {item.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.serviceInfo}>
                <View style={styles.serviceNameContainer}>
                  <Text
                    style={[
                      styles.serviceName,
                      item.is_cancelled && styles.cancelledText,
                    ]}
                  >
                    {item.name}
                  </Text>
                </View>
                <Text style={styles.serviceCategory}>{item.category}</Text>
                {item.is_freetrial && !item.is_cancelled && (
                  <Text style={styles.freeTrialLabel}>
                    Free Trial
                    {item.freetrial_period
                      ? ` (${item.freetrial_period} days)`
                      : ""}
                  </Text>
                )}
              </View>
              <View style={styles.priceContainer}>
                <Text
                  style={[
                    styles.price,
                    item.is_cancelled && styles.cancelledText,
                  ]}
                >
                  {formatPrice(item.price, item.currency)}
                </Text>
                <Text style={styles.priceLabel}>
                  {item.is_annual ? "Annual" : "Monthly"}
                </Text>
              </View>

              {/* Delete Button */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteSubscription(item.id)}
              >
                <Text style={styles.deleteButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentLabel}>
                  {item.is_cancelled ? "Last Payment" : "Next Payment"}
                </Text>
                <Text style={styles.paymentDate}>
                  {nextPaymentDate || "No upcoming payments"}
                </Text>
                <Text style={styles.paymentType}>{item.payment_type}</Text>
              </View>
              <View style={styles.actionContainer}>
                {daysUntil !== null && !item.is_cancelled && (
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
                )}
                {!item.is_cancelled && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleCancelSubscription(item.id)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                )}
                {item.is_cancelled && (
                  <View style={styles.cancelledContainer}>
                    <Text style={styles.cancelledLabel}>CANCELLED</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>My Subscriptions</Text>
          <TouchableOpacity style={styles.addButton} onPress={openModal}>
            <LinearGradient
              colors={["#4ECDC4", "#44A08D"]}
              style={styles.addButtonGradient}
            >
              <Text style={styles.addButtonText}>+</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

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
      </SafeAreaView>

      {/* Add Subscription Modal - Full Screen Overlay */}
      {isModalVisible && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            onPress={closeModal}
            activeOpacity={1}
          />
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={["#2D3748", "#1A202C"]}
              style={styles.modalGradient}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Subscription</Text>
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                ref={scrollViewRef}
                style={styles.modalContent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalScrollContent}
              >
                {/* Service Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Service Name *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.name}
                    onChangeText={(text) =>
                      setFormData({ ...formData, name: text })
                    }
                    placeholder="e.g., Netflix, Spotify"
                    placeholderTextColor="#78909C"
                  />
                </View>

                {/* Category */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Category</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoryScrollView}
                  >
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category.key}
                        style={[
                          styles.categoryButton,
                          formData.category === category.key && {
                            backgroundColor: category.color,
                          },
                        ]}
                        onPress={() =>
                          setFormData({
                            ...formData,
                            category: category.key as Subscription["category"],
                            color: category.color,
                          })
                        }
                      >
                        <Text
                          style={[
                            styles.categoryButtonText,
                            formData.category === category.key &&
                              styles.categoryButtonTextSelected,
                          ]}
                        >
                          {category.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Price and Currency */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Price *</Text>
                  <View style={styles.priceInputContainer}>
                    <TextInput
                      style={[styles.textInput, styles.priceInput]}
                      value={formData.price}
                      onChangeText={(text) =>
                        setFormData({ ...formData, price: text })
                      }
                      placeholder="0.00"
                      placeholderTextColor="#78909C"
                      keyboardType="numeric"
                    />
                    <View style={styles.currencyContainer}>
                      {currencies.map((currency) => (
                        <TouchableOpacity
                          key={currency.key}
                          style={[
                            styles.currencyButton,
                            formData.currency === currency.key &&
                              styles.currencyButtonSelected,
                          ]}
                          onPress={() =>
                            setFormData({
                              ...formData,
                              currency:
                                currency.key as Subscription["currency"],
                            })
                          }
                        >
                          <Text
                            style={[
                              styles.currencyButtonText,
                              formData.currency === currency.key &&
                                styles.currencyButtonTextSelected,
                            ]}
                          >
                            {currency.symbol}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Payment Day */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Payment Day *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.payment_day}
                    onChangeText={(text) =>
                      setFormData({ ...formData, payment_day: text })
                    }
                    placeholder="Day of month (1-31)"
                    placeholderTextColor="#78909C"
                    keyboardType="numeric"
                    maxLength={2}
                  />
                  <Text style={styles.helpText}>
                    Enter the day of the month for{" "}
                    {formData.is_annual ? "annual" : "monthly"} billing
                  </Text>
                </View>

                {/* Payment Type */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Payment Method</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.paymentTypeScrollView}
                  >
                    {paymentTypes.map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.paymentTypeButton,
                          formData.payment_type === type &&
                            styles.paymentTypeButtonSelected,
                        ]}
                        onPress={() =>
                          setFormData({ ...formData, payment_type: type })
                        }
                      >
                        <Text
                          style={[
                            styles.paymentTypeButtonText,
                            formData.payment_type === type &&
                              styles.paymentTypeButtonTextSelected,
                          ]}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Color Selection */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Color</Text>
                  <View style={styles.colorGrid}>
                    {colorOptions.map((color) => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorOption,
                          { backgroundColor: color },
                          formData.color === color &&
                            styles.colorOptionSelected,
                        ]}
                        onPress={() =>
                          setFormData({ ...formData, color: color })
                        }
                      >
                        {formData.color === color && (
                          <Text style={styles.colorCheckmark}>✓</Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Toggle Options */}
                <View style={styles.toggleContainer}>
                  <TouchableOpacity
                    style={styles.toggleOption}
                    onPress={() =>
                      setFormData({
                        ...formData,
                        is_annual: !formData.is_annual,
                      })
                    }
                  >
                    <View
                      style={[
                        styles.checkbox,
                        formData.is_annual && styles.checkboxSelected,
                      ]}
                    >
                      {formData.is_annual && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                    <Text style={styles.toggleText}>Annual Subscription</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.toggleOption}
                    onPress={() => {
                      const newValue = !formData.is_freetrial;
                      setFormData({ ...formData, is_freetrial: newValue });
                      // Auto scroll to show free trial period input when enabled
                      if (newValue && scrollViewRef.current) {
                        setTimeout(() => {
                          scrollViewRef.current?.scrollToEnd({
                            animated: true,
                          });
                        }, 100);
                      }
                    }}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        formData.is_freetrial && styles.checkboxSelected,
                      ]}
                    >
                      {formData.is_freetrial && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                    <Text style={styles.toggleText}>Free Trial</Text>
                  </TouchableOpacity>

                  {formData.is_freetrial && (
                    <View style={styles.freeTrialPeriodContainer}>
                      <Text style={styles.inputLabel}>
                        Free Trial Period (days) *
                      </Text>
                      <TextInput
                        style={styles.textInput}
                        value={formData.freetrial_period}
                        onChangeText={(text) =>
                          setFormData({ ...formData, freetrial_period: text })
                        }
                        placeholder="30"
                        placeholderTextColor="#78909C"
                        keyboardType="numeric"
                      />
                    </View>
                  )}
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleAddSubscription}
                >
                  <LinearGradient
                    colors={["#4ECDC4", "#44A08D"]}
                    style={styles.saveButtonGradient}
                  >
                    <Text style={styles.saveButtonText}>Add Subscription</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  safeArea: {
    flex: 1,
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
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addButtonGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
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
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    backgroundColor: "#374151",
  },
  logo: {
    width: 32,
    height: 32,
  },
  cancelledLogo: {
    opacity: 0.5,
  },
  logoPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  serviceInfo: {
    flex: 1,
  },
  serviceNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginRight: 8,
  },
  cancelledText: {
    opacity: 0.6,
    textDecorationLine: "line-through",
  },
  cancelledContainer: {
    backgroundColor: "#FF6B6B20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  cancelledLabel: {
    fontSize: 12,
    color: "#FF6B6B",
    fontWeight: "bold",
  },
  serviceCategory: {
    fontSize: 14,
    color: "#78909C",
    textTransform: "capitalize",
  },
  freeTrialLabel: {
    fontSize: 12,
    color: "#4ECDC4",
    fontWeight: "600",
    marginTop: 2,
  },
  priceContainer: {
    alignItems: "flex-end",
    marginRight: 10,
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
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
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
  paymentType: {
    fontSize: 12,
    color: "#78909C",
    marginTop: 2,
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
  cancelButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  cancelButtonText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },

  // Modal Styles - Using absolute positioning instead of Modal component
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    elevation: 10,
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: height * 0.75,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#2D3748",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  modalGradient: {
    height: "100%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#374151",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  modalContent: {
    maxHeight: height * 0.55,
    padding: 20,
  },
  modalScrollContent: {
    paddingBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#374151",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#4A5568",
  },
  categoryScrollView: {
    flexDirection: "row",
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#374151",
    borderWidth: 1,
    borderColor: "#4A5568",
  },
  categoryButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  categoryButtonTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  priceInput: {
    flex: 1,
  },
  currencyContainer: {
    flexDirection: "row",
    backgroundColor: "#374151",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#4A5568",
    overflow: "hidden",
  },
  currencyButton: {
    paddingHorizontal: 12,
    paddingVertical: 15,
    backgroundColor: "transparent",
  },
  currencyButtonSelected: {
    backgroundColor: "#4ECDC4",
  },
  currencyButtonText: {
    fontSize: 14,
    color: "#78909C",
    fontWeight: "600",
  },
  currencyButtonTextSelected: {
    color: "#FFFFFF",
  },
  paymentTypeScrollView: {
    flexDirection: "row",
  },
  paymentTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#374151",
    borderWidth: 1,
    borderColor: "#4A5568",
  },
  paymentTypeButtonSelected: {
    backgroundColor: "#4ECDC4",
    borderColor: "#4ECDC4",
  },
  paymentTypeButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  paymentTypeButtonTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  toggleContainer: {
    marginTop: 10,
  },
  toggleOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#4A5568",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#4ECDC4",
    borderColor: "#4ECDC4",
  },
  checkmark: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  toggleText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#374151",
  },
  saveButton: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },
  saveButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorOptionSelected: {
    borderColor: "#FFFFFF",
    borderWidth: 3,
  },
  colorCheckmark: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  freeTrialPeriodContainer: {
    marginTop: 15,
    marginLeft: 32,
  },
  helpText: {
    fontSize: 12,
    color: "#78909C",
    marginTop: 5,
    fontStyle: "italic",
  },
});
