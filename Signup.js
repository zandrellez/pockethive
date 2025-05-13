import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet,
  Alert, ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';


const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    birthdate: new Date(),
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();

  const validateForm = () => {
    const newErrors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm Password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // TODO: Add Firebase authentication here
      Alert.alert('Success', 'Form is valid! Ready for Firebase integration.');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, birthdate: selectedDate }));
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <Image source={require("./assets/Dash.png")} style={styles.dashImage} />
        <Image source={require("./assets/bee.png")} style={styles.beeImage} />
        <Text style={styles.welcomeText}>Hello Buzzmate!</Text>
      </View>

      {/* Form Container */}
      <View style={styles.card}>
        <Text style={styles.signUpHeader}>SIGN UP</Text>
        
        {/* Username */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput 
            style={[styles.input, errors.username && styles.inputError]} 
            placeholder="Enter Username" 
            placeholderTextColor="#666"
            value={formData.username}
            onChangeText={(text) => setFormData(prev => ({ ...prev, username: text }))}
          />
          {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
        </View>

        {/* First Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput 
            style={[styles.input, errors.firstName && styles.inputError]} 
            placeholder="Enter First Name" 
            placeholderTextColor="#666"
            value={formData.firstName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
          />
          {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
        </View>

        {/* Last Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput 
            style={[styles.input, errors.lastName && styles.inputError]} 
            placeholder="Enter Last Name" 
            placeholderTextColor="#666"
            value={formData.lastName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
          />
          {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
        </View>

        {/* Birthdate */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Birthdate</Text>
          <TouchableOpacity 
            style={[styles.input, styles.dateInput]} 
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{formatDate(formData.birthdate)}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={formData.birthdate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        {/* Email Address */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput 
            style={[styles.input, errors.email && styles.inputError]} 
            placeholder="Enter Email Address" 
            placeholderTextColor="#666"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={[styles.passwordContainer, errors.password && styles.inputError]}>
            <TextInput 
              style={styles.passwordInput} 
              placeholder="Enter Password" 
              placeholderTextColor="#666"
              secureTextEntry={!passwordVisible}
              value={formData.password}
              onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
            />
            <TouchableOpacity 
              onPress={() => setPasswordVisible(!passwordVisible)} 
              style={styles.eyeButton}
            >
              <Icon 
                name={passwordVisible ? "eye-off" : "eye"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        {/* Confirm Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={[styles.passwordContainer, errors.confirmPassword && styles.inputError]}>
            <TextInput 
              style={styles.passwordInput} 
              placeholder="Confirm Password" 
              placeholderTextColor="#666"
              secureTextEntry={!confirmPasswordVisible}
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
            />
            <TouchableOpacity 
              onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} 
              style={styles.eyeButton}
            >
              <Icon 
                name={confirmPasswordVisible ? "eye-off" : "eye"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.signUpButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>

        {/* Already have an account? */}
        <View style={styles.signinContainer}>
          <Text style={styles.signinText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.signinLink}>Sign in</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  inputError: {
    borderColor: '#FF0000',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 20,
    fontFamily: 'MonRegular',
  },
  dateInput: {
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: "#FAF3E0",
  },
  header: {
    width: "100%",
    height: 200,
    backgroundColor: "rgba(254, 133, 28, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  dashImage: {
    position: "absolute",
    top: 20,
    right: 10,
    width: 340,
    height: 165,
    resizeMode: "contain",
    zIndex: 1,
  },
  beeImage: {
    position: "absolute",
    top: 150,
    left: 20,
    width: 50,
    height: 50,
    resizeMode: "contain",
    zIndex: 1,
  },
  welcomeText: {
    fontSize: 20,
    fontFamily: "MonSemi",
    color: "#000",
    textAlign: "center",
    marginTop: 30,
  },
  card: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    marginTop: -30,
  },
  signUpHeader: {
    fontSize: 30,
    fontFamily: "MonMedium",
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
    position: "relative",
  },
  label: {
    position: "absolute",
    top: -10,
    left: 20,
    backgroundColor: "#FFF",
    paddingHorizontal: 5,
    fontSize: 14,
    fontFamily: "MonSemi",
    color: "#333",
    zIndex: 1,
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#000",
    paddingHorizontal: 20,
    fontSize: 15,
    fontFamily: "MonRegular",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 25,
    height: 50,
    paddingHorizontal: 20,
    backgroundColor: "#FFF",
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
  },
  eyeButton: {
    position: "absolute",
    right: 15,
  },
  signUpButton: {
    width: "100%",
    height: 50,
    borderRadius: 30,
    backgroundColor: "#FE851C",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    borderColor: "black",
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "MonBold",
  },
  signinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 30,
    marginTop: 15,
  },
  signinText: {
    fontSize: 14,
    fontFamily: "MonRegular",
    color: "#000",
  },
  signinLink: {
    color: "#6176FF",
    fontSize: 14,
    fontFamily: "MonBold",
  },
});

export default Signup;