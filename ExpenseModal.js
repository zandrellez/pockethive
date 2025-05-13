import React, { useState } from 'react';
import { Modal, View, TextInput, TouchableOpacity, Text, StyleSheet, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import useExpenses from './useExpenses';  // Import the custom hook
import CustomCategoryModal from './CustomCategoryModal'; 
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const ExpenseModal = ({ modalVisible, setModalVisible }) => {
  const { addExpense, categories, addCustomCategory } = useExpenses();  // Custom hook for managing expenses
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]);  // Default category
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newCategoryLabel, setNewCategoryLabel] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('');
  const [customCategoryModalVisible, setCustomCategoryModalVisible] = useState(false);

  const navigation = useNavigation();  // Use navigation hook

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleAddExpense = () => {
    const newAmount = parseFloat(amount.replace(/[^0-9.-]+/g, '')) || 0;
    addExpense(newAmount, category, title, date);  // Add the expense using the custom hook
    setAmount('');
    setTitle('');
    setModalVisible(false);
  };

  const handleScan = () => {
    navigation.navigate('ReceiptScanner');  // Navigate to ReceiptScanner screen when Scan button is clicked
  };

  const handleAddCustomCategory = (label, icon) => {
    addCustomCategory(label, icon);
    setCategory({ label, icon });
  };

  return (
    <>
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
              {categories.filter(item => item.label !== 'Others').map(item => (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.categoryButton, category.label === item.label && styles.selectedCategoryButton]}
                  onPress={() => setCategory(item)}
                >
                  <Ionicons name={item.icon} size={30} color="black" />
                  <Text style={styles.categoryText}>{item.label}</Text>
                </TouchableOpacity>
              ))}

              {/* "Others" category at the end */}
              <TouchableOpacity
                key="Others"
                style={[styles.categoryButton, category.label === 'Others' && styles.selectedCategoryButton]}
                onPress={() => setCustomCategoryModalVisible(true)}
              >
                <Ionicons name="help-circle" size={30} color="black" />
                <Text style={styles.categoryText}>Others</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Input fields for title and amount */}
            <TextInput
              placeholder="Title"
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              placeholder="Amount"
              style={styles.input}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
              <Text style={styles.dateText}>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
            </TouchableOpacity>

            {showDatePicker && <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />}

            {/* Conditional rendering of custom category input only when "Others" is selected */}
            {category.label === 'Others' && (
              <View>
                <TextInput
                  placeholder="New Category Label"
                  style={styles.input}
                  value={newCategoryLabel}
                  onChangeText={setNewCategoryLabel}
                />
                <TextInput
                  placeholder="New Category Icon (e.g., 'star')"
                  style={styles.input}
                  value={newCategoryIcon}
                  onChangeText={setNewCategoryIcon}
                />
                <TouchableOpacity onPress={() => setCustomCategoryModalVisible(true)} style={styles.addButtonModal}>
                  <Text style={styles.addButtonText}>Add Custom Category</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Button container for Scan and Add Expense buttons */}
            <View style={styles.buttonContainer}>
              {/* Scan Button */}
              <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
                <Ionicons name="qr-code" size={20} color="white" style={styles.icon} />
                <Text style={styles.scanButtonText}>Scan</Text>
              </TouchableOpacity>

              {/* Add Expense Button */}
              <TouchableOpacity style={styles.addButtonModal} onPress={handleAddExpense}>
                <Ionicons name="add" size={20} color="white" style={styles.icon} />
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <CustomCategoryModal
        visible={customCategoryModalVisible}
        onClose={() => setCustomCategoryModalVisible(false)}
        onAddCategory={handleAddCustomCategory}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  categoryList: { flexDirection: 'row', paddingVertical: 10 },
  categoryButton: { alignItems: 'center', justifyContent: 'center', marginRight: 15, width: 80, height: 80, borderRadius: 12, backgroundColor: '#f5f5f5', padding: 10 },
  selectedCategoryButton: { backgroundColor: '#FDAA61' },
  categoryText: { marginTop: 5, fontSize: 12 },
  input: { backgroundColor: '#f5f5f5', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 15, marginVertical: 8 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  scanButton: { backgroundColor: '#888', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1, marginRight: 10 },
  addButtonModal: { backgroundColor: '#FDAA61', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1, marginLeft: 10 },
  scanButtonText: { color: 'white', fontWeight: 'bold', marginLeft: 5 },
  addButtonText: { color: 'white', fontWeight: 'bold', marginLeft: 5 },
  icon: { marginRight: 5 },
});

export default ExpenseModal;
