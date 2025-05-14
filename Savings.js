import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Progress from "react-native-progress";

const screenWidth = Dimensions.get("window").width;

const Savings = () => {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState("");
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);

  useEffect(() => {
    loadGoals();
  }, []);

  useEffect(() => {
    saveGoals();
  }, [goals]);

  const saveGoals = async () => {
    try {
      await AsyncStorage.setItem("savings_goals", JSON.stringify(goals));
    } catch (e) {
      console.error("Failed to save goals", e);
    }
  };

  const loadGoals = async () => {
    try {
      const storedGoals = await AsyncStorage.getItem("savings_goals");
      if (storedGoals) {
        setGoals(JSON.parse(storedGoals));
      }
    } catch (e) {
      console.error("Failed to load goals", e);
    }
  };

  const addGoal = () => {
    const target = parseFloat(targetAmount);
    const saved = parseFloat(savedAmount);

    if (!goalName || isNaN(target) || isNaN(saved)) return;

    const newGoal = {
      id: Date.now().toString(),
      name: goalName,
      target: target,
      saved: saved,
    };

    setGoals([...goals, newGoal]);
    setGoalName("");
    setTargetAmount("");
    setSavedAmount("");
    setModalVisible(false);
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter((goal) => goal.id !== id));
    setSelectedGoal(null);
  };

  const updateGoal = () => {
    const updatedGoals = goals.map((goal) =>
      goal.id === selectedGoal.id ? selectedGoal : goal
    );
    setGoals(updatedGoals);
    setSelectedGoal(null);
  };

  const renderGoal = ({ item }) => {
    const progress = item.target > 0 ? item.saved / item.target : 0;
    return (
      <TouchableOpacity onPress={() => setSelectedGoal(item)}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardDetail}>Target: ₱{item.target}</Text>
          <Progress.Bar
            progress={progress}
            width={screenWidth - 70}
            color="orange"
            height={10}
            borderRadius={5}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Savings Goals</Text>

      {selectedGoal ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <Text style={styles.detailTitle}>{selectedGoal.name}</Text>
          <Progress.Circle
            size={150}
            progress={
              selectedGoal.target > 0
                ? selectedGoal.saved / selectedGoal.target
                : 0
            }
            showsText={true}
            color="orange"
            style={{ alignSelf: "center", marginVertical: 20 }}
          />
          <Text style={styles.detailText}>
            Saved: ₱{selectedGoal.saved} / ₱{selectedGoal.target}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Edit Saved Amount"
            keyboardType="numeric"
            value={selectedGoal.saved.toString()}
            onChangeText={(value) =>
              setSelectedGoal({
                ...selectedGoal,
                saved:
                  value === "" ? 0 : parseFloat(value.replace(/[^0-9.]/g, "")) || 0,
              })
            }
          />
          <TouchableOpacity style={styles.addButtonModal} onPress={updateGoal}>
            <Text style={styles.addButtonText}>Update Goal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.cancelButton, { marginBottom: 10 }]}
            onPress={() => deleteGoal(selectedGoal.id)}
          >
            <Text style={styles.cancelButtonText}>Delete Goal</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedGoal(null)}>
            <Text style={[styles.cancelButtonText, { textAlign: "center" }]}>
              Back to Goals
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <>
          {goals.length === 0 ? (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>No savings goals yet.</Text>
              <TouchableOpacity
                style={styles.placeholderButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.placeholderButtonText}>Add a New Goal</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={goals}
              keyExtractor={(item) => item.id}
              renderItem={renderGoal}
              contentContainerStyle={{ paddingBottom: 120 }}
            />
          )}
        </>
      )}

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1, justifyContent: "flex-end" }}
              keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
            >
              <View style={styles.modalContainer}>
                <ScrollView
                  contentContainerStyle={styles.modalContent}
                  keyboardShouldPersistTaps="handled"
                >
                  <Text style={styles.modalTitle}>Add Savings Goal</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Goal Name"
                    value={goalName}
                    onChangeText={setGoalName}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Target Amount"
                    keyboardType="numeric"
                    value={targetAmount}
                    onChangeText={(value) =>
                      setTargetAmount(value.replace(/[^0-9.]/g, ""))
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Amount Saved"
                    keyboardType="numeric"
                    value={savedAmount}
                    onChangeText={(value) =>
                      setSavedAmount(value.replace(/[^0-9.]/g, ""))
                    }
                  />
                  <TouchableOpacity
                    style={styles.addButtonModal}
                    onPress={addGoal}
                  >
                    <Text style={styles.addButtonText}>Add Goal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.touchableStyle}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home" size={24} color="gray" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchableStyle}
          onPress={() => navigation.navigate("Expenses")}
        >
          <Ionicons name="receipt-outline" size={24} color="gray" />
          <Text style={styles.navText}>Expenses</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.addButton, styles.touchableStyle]}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchableStyle}>
          <Ionicons name="wallet" size={24} color="#FDAA61" />
          <Text style={styles.navTextActive}>Savings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchableStyle}
          onPress={() => navigation.navigate("Reminder")}
        >
          <Ionicons name="notifications" size={24} color="gray" />
          <Text style={styles.navText}>Reminder</Text>
        </TouchableOpacity>
      </View>
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
  cardTitle: { fontSize: 16, fontWeight: "bold" },
  cardDetail: { fontSize: 14, color: "gray", marginBottom: 10 },
  detailTitle: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginTop: 20 },
  detailText: { fontSize: 16, textAlign: "center", marginBottom: 10 },
  input: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, marginBottom: 12,
  },
  modalOverlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white", borderTopLeftRadius: 20, borderTopRightRadius: 20,
    maxHeight: "85%",
  },
  modalContent: { padding: 20 },
  modalTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  addButtonModal: {
    backgroundColor: "orange", borderRadius: 10, padding: 12, alignItems: "center", marginBottom: 10,
  },
  addButtonText: { color: "white", fontWeight: "bold" },
  cancelButton: { alignItems: "center" },
  cancelButtonText: { color: "gray", fontSize: 16 },
  placeholderContainer: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 },
  placeholderText: { fontSize: 16, color: "#666", marginBottom: 10 },
  placeholderButton: { backgroundColor: "orange", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  placeholderButtonText: { color: "white", fontWeight: "bold" },
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

export default Savings;
