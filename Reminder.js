import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
  Platform,
} from "react-native";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExpenseModal from './ExpenseModal';
import LoadingIndicator from './components/LoadingIndicator';
import ErrorDisplay from './components/ErrorDisplay';

const Reminder = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const formatDate = (date) => {
    const options = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
    const parts = date.toLocaleDateString('en-GB', options).split(' ');
    return `${parts[0]}, ${parts.slice(1).join(' ')}`;
  };

  const fetchReminders = useCallback(async () => {
    try {
      setError(null);
      const storedData = await AsyncStorage.getItem('dailyExpenses');
      console.log('Stored Data:', storedData);
  
      if (storedData) {
        const parsedData = JSON.parse(storedData);
  
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to midnight for accurate comparison
  
        const transformedData = Object.entries(parsedData)
          .map(([dateKey, data]) => {
            // Parse MM/DD/YYYY string manually
            const [month, day, year] = dateKey.split('/').map(Number);
            const parsedDate = new Date(year, month - 1, day); 
            parsedDate.setHours(0, 0, 0, 0);
            
            return {
              dateObj: parsedDate,
              payments: data.categories.map(expense => ({
                id: expense.id || `${expense.title}-${dateKey}`,
                name: expense.title,
                amount: formatAmount(expense.amount),
              })),
            };
          })
          // Only keep today or future dates
          .filter(group => group.payments.length > 0 && group.dateObj >= today)
          .sort((a, b) => a.dateObj - b.dateObj);
  
        const finalData = transformedData.map(group => ({
          date: formatDate(group.dateObj),
          payments: group.payments,
        }));
  
        setReminders(finalData);
      } else {
        setReminders([]);
      }
    } catch (err) {
      console.error('Error fetching reminders:', err);
      setError('Failed to load reminders. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);
  

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchReminders();
  }, [fetchReminders]);

  const formatAmount = (amount) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return numAmount >= 0 ?
      numAmount.toLocaleString() :
      `-${Math.abs(numAmount).toLocaleString()}`;
  };

  const renderPaymentItem = ({ item }) => (
    <View style={styles.paymentItem}>
      <Text style={styles.paymentName}>{item.name}</Text>
      <Text style={[
        styles.paymentAmount,
        { color: item.amount.startsWith('-') ? '#FF4B4B' : '#2ECC71' }
      ]}>
        {item.amount}
      </Text>
    </View>
  );

  const renderDateGroup = ({ item }) => (
    <View style={styles.dateGroup}>
      <Text style={styles.dateHeader}>{item.date}</Text>
      <FlatList
        data={item.payments}
        renderItem={renderPaymentItem}
        keyExtractor={(payment) => payment.id}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="calendar-outline" size={80} color="#FDAA61" />
      <Text style={styles.emptyStateText}>No upcoming payments</Text>
      <Text style={styles.emptyStateSubText}>
        Add your first reminder by tapping the + button below
      </Text>
    </View>
  );

  if (loading) {
    return <LoadingIndicator message="Loading reminders..." />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={fetchReminders} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payments</Text>

      <FlatList
        data={reminders}
        renderItem={renderDateGroup}
        ListEmptyComponent={renderEmptyState}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={[
          styles.listContent,
          reminders.length === 0 && styles.emptyListContent
        ]}
        style={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FDAA61"]}
            tintColor="#FDAA61"
          />
        }
      />

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.touchableStyle} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.touchableStyle]} onPress={() => navigation.navigate('Expenses')}>
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
          <Ionicons name="notifications" size={24} color="#FDAA61" />
          <Text style={styles.navTextActive}>Reminder</Text>
        </TouchableOpacity>
      </View>

      <ExpenseModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onSave={fetchReminders}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF3E0",
    paddingTop: Platform.OS === 'android' ? 60 : 0,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  list: {
    marginBottom: 80,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
  },
  paymentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  paymentName: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 20,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 40,
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

export default Reminder;
