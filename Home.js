import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { PieChart } from "react-native-chart-kit";
import DateTimePicker from '@react-native-community/datetimepicker';
import ExpenseModal from './ExpenseModal';
import CustomCategoryModal from './CustomCategoryModal';

const screenWidth = Dimensions.get("window").width;

const Homepage = () => {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Food");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const recentActivity = [
    { id: "1", category: "Education", detail: "Tuition Fee", amount: -6849 },
    { id: "2", category: "Food", detail: "Groceries", amount: -1867 },
    { id: "3", category: "Others", detail: "Others", amount: -5000 },
  ];

  const upcomingDues = [
    { category: "Utilities", detail: "Electricity Bill", amount: -3000, dueIn: 9 },
  ];

  const availableBalance = "₱18,255";

  const generateExpenseData = (activityData, duesData) => {
    const allData = [...activityData, ...duesData];
    const categoryNames = [...new Set(allData.map(item => item.category))];
    return categoryNames.map((category) => {
      const totalAmount = allData
        .filter(item => item.category === category)
        .reduce((sum, item) => sum + Math.abs(item.amount), 0);
      return {
        name: category,
        amount: totalAmount,
        color: getCategoryColor(category),
      };
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      Education: "#E57373",
      Food: "#FFCDD2",
      Utilities: "#EF5350",
      Health: "#81C784", // Added Health color
      Others: "#B71C1C",
    };
    return colors[category] || "#808080";
  };

  const expenseData = generateExpenseData(recentActivity, upcomingDues);

  const chartData = expenseData.map((item) => ({
    name: item.name,
    population: item.amount,
    color: item.color,
    legendFontColor: "#000",
    legendFontSize: 12,
  }));

  const categoryIcons = {
    Food: "fast-food",
    Utilities: "flash",
    School: "school",
    Internet: "wifi",
    Health: "heart", // Added Health icon
    Others: "help-circle",
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Expense Distribution</Text>

        {/* Pie Chart Section */}
        <View style={styles.chartWrapper}>
          <PieChart
            data={chartData}
            width={screenWidth * 0.9}
            height={180}
            chartConfig={{
              color: () => "black",
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="2"
            absolute
          />
        </View>

        {/* Recent Activity Section */}
        <View style={styles.sectionHeaderWrapper}>
          <Text style={styles.sectionHeader}>Recent Activity</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Expenses')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        {recentActivity.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardContent}>
              <Ionicons
                name={categoryIcons[item.category] || categoryIcons["Others"]}
                size={30}
                color="black"
                style={styles.icon}
              />
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{item.category}</Text>
                <Text style={styles.cardDetail}>{item.detail}</Text>
              </View>
              <Text style={styles.cardAmount}>{`₱ -${Math.abs(item.amount).toLocaleString()}`}</Text>
            </View>
          </View>
        ))}

        {/* Upcoming Dues Section */}
        <View style={styles.sectionHeaderWrapper}>
          <Text style={styles.sectionHeader}>Upcoming Dues</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Reminder')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        {upcomingDues.map((due, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardContent}>
              <Ionicons
                name={categoryIcons["Utilities"]}
                size={30}
                color="black"
                style={styles.icon}
              />
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{due.category}</Text>
                <Text style={styles.cardDetail}>{due.detail}</Text>
              </View>
              <Text style={[styles.cardAmount, styles.dueInText]}>{`${due.dueIn}d`}</Text>
            </View>
          </View>
        ))}

        {/* Available Balance Section */}
        <Text style={styles.sectionHeader}>Available Balance</Text>
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Ionicons
              name={categoryIcons["Budget"]}
              size={30}
              color="black"
              style={styles.icon}
            />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Balance</Text>
              <Text style={styles.cardBalance}>{availableBalance}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.touchableStyle}>
          <Ionicons name="home" size={24} color="#FDAA61" />
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchableStyle}
          onPress={() => navigation.navigate('Expenses')}
        >
          <Ionicons name="receipt-outline" size={24} color="gray" />
          <Text style={styles.navText}>Expenses</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.addButton, styles.touchableStyle]} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchableStyle} onPress={() => navigation.navigate('Savings')}>
          <Ionicons name="wallet" size={24} color="gray" />
          <Text style={styles.navText}>Savings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchableStyle} onPress={() => navigation.navigate('Reminder')}>
          <Ionicons name="notifications" size={24} color="gray" />
          <Text style={styles.navText}>Reminder</Text>
        </TouchableOpacity>
      </View>

      {/* Expense Modal */}
      <ExpenseModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF3E0",
    paddingTop: Platform.OS === 'android' ? 60 : 0,
    paddingHorizontal: 20,
  },
  scrollView: {
    flexGrow: 1,
    marginBottom: 80,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    paddingTop: 10,
  },
  chartWrapper: {
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  sectionHeaderWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
  },
  viewAllText: {
    fontSize: 14,
    color: "gray",
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    marginRight: 10,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardDetail: {
    fontSize: 14,
    color: "gray",
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
    textAlign: "right",
  },
  cardBalance: {
    fontSize: 14,
    color: "gray",
  },
  dueInText: {
    color: "gray",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 5,
    shadowColor: "#000",
    alignItems: "center",
  },
  addButton: {
    width: 65,
    height: 65,
    backgroundColor: "orange",
    borderRadius: 32.5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -50,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  touchableStyle: {
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
    textAlign: "center",
  },
  navTextActive: {
    fontSize: 12,
    color: "orange",
    marginTop: 5,
    textAlign: "center",
  },
});


export default Homepage;
