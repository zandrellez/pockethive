import React, { useState } from 'react';
import { Modal, View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomCategoryModal = ({ visible, onClose, onAddCategory }) => {
  const [newCategoryLabel, setNewCategoryLabel] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('');

  const handleAddCategory = () => {
    if (newCategoryLabel && newCategoryIcon) {
      onAddCategory(newCategoryLabel, newCategoryIcon);
      setNewCategoryLabel('');
      setNewCategoryIcon('');
      onClose();
    } else {
      console.log("Category label and icon are required!");
    }
  };

  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
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
          <TouchableOpacity onPress={handleAddCategory} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Custom Category</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10 },
  input: { backgroundColor: '#f5f5f5', borderRadius: 10, padding: 10, marginVertical: 5 },
  addButton: { backgroundColor: '#FDAA61', borderRadius: 10, padding: 10, marginTop: 10 },
  addButtonText: { color: 'white', textAlign: 'center' },
});

export default CustomCategoryModal;
