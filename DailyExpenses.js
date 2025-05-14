import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ExpenseModal from './ExpenseModal';
import CustomCategoryModal from './CustomCategoryModal';

const DailyExpensesScreen = () => {
    const navigation = useNavigation();

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Food");
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

    const route = useRoute();
    const { date, expenses } = route.params;

    const totalAmount = expenses.reduce((total, item) => total + item.amount, 0);
    
    const formatDate = (input) => {
    const [month, day, year] = input.split('/');

    const dateObj = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
    if (isNaN(dateObj)) return "Invalid Date";

    const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    const parts = dateObj.toLocaleDateString('en-US', options).split(' ');
    
    return `${parts[0]} ${parts[1]} ${parts[2]} ${parts[3]}`;
};

    return (
        <View style={styles.container}>
            {/* Header with back button and date */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.dateText}>{formatDate(date)}</Text>
            </View>

            {totalAmount === 0 ? (
                <Text style={styles.totalAmount}>No expenses</Text>
            ) : (
                <Text style={styles.totalAmount}>
                    Total: ₱{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Text>
            )}

            <FlatList
                contentContainerStyle={{ paddingBottom: 100 }}
                data={expenses}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.expenseItem}>
                        <Ionicons name={item.icon} size={30} color="black" />
                        <View style={styles.itemInfo}>
                            <Text style={styles.category}>{item.category}</Text>
                            <Text style={styles.sub}>{item.title}</Text>
                        </View>
                        <Text style={styles.amountRed}>₱{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
                    </View>
                )}
            />

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.touchableStyle} onPress={() => navigation.navigate('Home')}>
                    <Ionicons name="home" size={24} />
                    <Text style={styles.navText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.touchableStyle]} onPress={() => navigation.navigate('Expenses')}>
                    <Ionicons name="receipt-outline" size={24} color="#FDAA61" />
                    <Text style={styles.navTextActive}>Expenses</Text>
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

            <ExpenseModal modalVisible={modalVisible} setModalVisible={setModalVisible} />

        </View>
    );
};

export default DailyExpensesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fdf5e6',
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    dateText: {
        fontSize: 18,
        marginLeft: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 50,
        marginBottom: 10,
        textAlign: 'center',
    },
    expenseItem: {
        backgroundColor: 'white',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginBottom: 10,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 10,
    },
    category: {
        fontWeight: 'bold',
    },
    sub: {
        color: '#888',
    },
    amountRed: {
        color: 'red',
        fontWeight: 'bold',
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
