import { CameraMode, CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useNavigation } from '@react-navigation/native'; // Import navigation for back functionality

export default function ReceiptScanner() {
  const navigation = useNavigation(); // Access the navigation object
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef(null);
  const [uri, setUri] = useState(null);
  const [mode, setMode] = useState("camera"); // camera or imagePicker mode
  const [facing, setFacing] = useState("back");

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    setUri(photo?.uri);  // Save the URI of the taken picture
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setUri(result.uri);  // Save the URI of the picked image
    }
  };

  const toggleMode = () => {
    if (mode === "camera") {
      pickImage(); // Automatically pick an image when switching to imagePicker mode
    }
    setMode((prev) => (prev === "camera" ? "imagePicker" : "camera"));
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const renderCamera = () => {
    return (
      <CameraView
        style={styles.camera}
        ref={ref}
        mode="picture"
        facing={facing}
        mute={false}
        responsiveOrientationWhenOrientationLocked
      />
    );
  };

  // Back Button functionality
  const handleBackButton = () => {
    navigation.goBack(); // Go back to the previous screen
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <View style={styles.header}>
        <Pressable onPress={handleBackButton}>
          <AntDesign name="arrowleft" size={32} color="black" />
        </Pressable>
      </View>

      {/* Camera Wrapper */}
      <View style={styles.cameraWrapper}>
        {uri ? (
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri }}
              contentFit="contain"
              style={styles.image}
            />
          </View>
        ) : (
          mode === "camera" && renderCamera()
        )}
      </View>


      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        {/* Toggle Mode Button */}
        <Pressable style={styles.toggleButton} onPress={toggleMode}>
          <AntDesign name="picture" size={32} color="gray" />
        </Pressable>

        {/* Shutter Button */}
        <Pressable
        style={styles.shutterButton}
        onPress={() => {
            if (uri) {
            setUri(null); // Reset to no image, allowing the user to retake a picture
            } else {
            takePicture(); // Take a picture
            }
        }}
        >
        <View
            style={[
            styles.shutterBtnInner,
            { backgroundColor: uri ? "white" : "#FAA053" }, // Change color when image is taken
            ]}
        >
            {/* Display icon based on whether an image is taken or not */}
            {uri ? (
            <AntDesign name="reload1" size={40} color="#FAA053" />
            ) : (
            <AntDesign name="camera" size={40} color="white" />
            )}
        </View>
        </Pressable>


        {/* Toggle Facing Button */}
        <Pressable style={styles.toggleButton} onPress={toggleFacing}>
          <FontAwesome6 name="rotate-left" size={32} color="gray" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FAF3E0",
      alignItems: "center",
    },
    header: {
      position: "absolute",
      top: 40,
      left: 20,
      zIndex: 10, // Ensure the back button is above other elements
      padding: 10,
    },
    cameraWrapper: {
      flex: 4,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 60, // Make space for the back button
    },
    imageWrapper: {
      position: "relative",
      width: "80%",
      aspectRatio: 3 / 4, // Adjust the aspect ratio as needed
      alignItems: "center",
      justifyContent: "center",
    },
    image: {
      width: "100%",
      height: "100%",
      borderRadius: 10,
    },
    camera: {
      width: "80%",
      aspectRatio: 3 / 4, // 9:16 aspect ratio for camera view
      backgroundColor: "gray", // Placeholder color for the camera
    },
    controlsContainer: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      width: "100%",
      paddingBottom: 150,
    },
    shutterButton: {
      backgroundColor: "transparent",
      borderWidth: 5,
      borderColor: "#FAA053",
      width: 85,
      height: 85,
      borderRadius: 45,
      alignItems: "center",
      justifyContent: "center",
    },
    shutterBtnInner: {
      width: 70,
      height: 70,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
    },
    toggleButton: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });
  