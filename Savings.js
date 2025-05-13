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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import ExpenseModal from './ExpenseModal';
import CustomCategoryModal from './CustomCategoryModal';

const screenWidth = Dimensions.get("window").width;

const Savings = () => {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Food");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

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
    <View style={styles.container}>
      

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.touchableStyle} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} color="gray" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.touchableStyle]}
          onPress={() => navigation.navigate('Expenses')}
        >
          <Ionicons name="receipt-outline" size={24} color="gray" />
          <Text style={styles.navText}>Expenses</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.addButton, styles.touchableStyle]} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchableStyle}
          onPress={() => navigation.navigate('Savings')}>
          <Ionicons name="wallet" size={24} color="#FDAA61" />
          <Text style={styles.navTextActive}>Savings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchableStyle}
          onPress={() => navigation.navigate('Reminder')}>
          <Ionicons name="notifications" size={24} color="gray" />
          <Text style={styles.navText}>Reminder</Text>
        </TouchableOpacity>
      </View>

      <ExpenseModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF3E0",
    padding: 20,
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
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '55%', 
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  scanButton: {
    backgroundColor: '#f88a1a',
    borderRadius: 10,
    padding: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    flexDirection: 'row', 
  },
  scanButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButtonModal: {
    backgroundColor: 'orange',
    borderRadius: 10,
    padding: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row', 
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dateText: {
    color: '#333',
  },
  categoryList: {
    marginBottom: 10,
  },
  categoryButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#f8f8f8',
    marginHorizontal: 10,
    paddingVertical: 15,
    width: 80,
    justifyContent: 'center',
    elevation: 1,
  },
  selectedCategoryButton: {
    backgroundColor: '#f88a1a',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Savings;