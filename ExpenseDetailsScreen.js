import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExpenseDetailsScreen = ({ route, navigation }) => {
  const { expense, deleteExpense } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date(expense.date));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [amount, setAmount] = useState(expense.amount.toString());
  const [title, setTitle] = useState(expense.title || '');

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleEditExpense = async () => {
    const updatedExpense = {
      ...expense,
      title,
      amount: parseFloat(amount),
      date: date.toISOString(),
    };

    try {
      const storedData = await AsyncStorage.getItem('dailyExpenses');
      const dailyExpenses = storedData ? JSON.parse(storedData) : {};
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

      if (dailyExpenses[formattedDate]) {
        dailyExpenses[formattedDate].categories = dailyExpenses[formattedDate].categories.map(cat =>
          cat.title === expense.title ? updatedExpense : cat
        );
      }

      await AsyncStorage.setItem('dailyExpenses', JSON.stringify(dailyExpenses));
      setModalVisible(false);
      console.log('Expense Edited');
    } catch (error) {
      console.error('Failed to edit expense:', error);
    }
  };

  const handleDeleteExpense = () => {
    // Use the passed deleteExpense function here
    deleteExpense(expense.date, expense);  // Call deleteExpense with the expense's date and item
    navigation.goBack();  // Go back after deletion
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{expense.title || 'Expense Details'}</Text>
      </View>

      {/* Expense Details */}
      <View style={styles.detailsContainer}>

        {/* Category */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Category:</Text>
          <Text style={styles.value}>{expense.category}</Text>
        </View>

        {/* Amount */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.value}>{expense.amount.toLocaleString()}</Text>
        </View>

        {/* Date */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{expense.formattedDate}</Text>
        </View>

        {/* Description */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{expense.title}</Text>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.touchableStyle} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchableStyle} onPress={() => navigation.navigate('Expenses')}>
          <Ionicons name="receipt-outline" size={24} color="#FDAA61" />
          <Text style={styles.navTextActive}>Expenses</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.addButton, styles.touchableStyle]} onPress={() => setModalVisible(true)}>
          <Ionicons name="pencil" size={30} color="white" />
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

      {/* Edit/Delete Expense Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Expense</Text>
            <TextInput placeholder="Title" style={styles.input} value={title} onChangeText={setTitle} />
            <TextInput
              placeholder="Amount"
              style={styles.input}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
              <Text style={styles.dateText}>
                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Text>
            </TouchableOpacity>
            {showDatePicker && <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.addButtonModal} onPress={handleEditExpense}>
                <Ionicons name="save" size={20} color="white" style={styles.icon} />
                <Text style={styles.addButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButtonModal} onPress={handleDeleteExpense}>
                <Ionicons name="trash" size={20} color="white" style={styles.icon} />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf5e6", // Light background for the main container
    paddingTop: Platform.OS === 'android' ? 60 : 0,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Dark color for the header title
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  expenseName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 15,
    color: '#333', // Dark color for expense name
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 15, // More space between each row for clarity
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444', // Slightly lighter for labels
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#555', // Light gray for values
    flex: 2,
    textAlign: 'right', // Align values to the right for better readability
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for the modal
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333', // Dark color for modal title
  },
  input: {
    backgroundColor: '#f5f5f5', // Subtle light gray background for inputs
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginVertical: 8,
    fontSize: 16,
  },
  dateText: {
    fontSize: 16,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  addButtonModal: {
    backgroundColor: '#FDAA61', // Orange color for save button
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  deleteButtonModal: {
    backgroundColor: 'red', // Red color for delete button
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
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
});

export default ExpenseDetailsScreen;
