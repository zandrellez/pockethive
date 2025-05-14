import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Button, Pressable, StyleSheet, Text, View, Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OpenAI from "openai";

const GOOGLE_CLOUD_VISION_API_KEY = 'AIzaSyDJOQXA7Wd4aw8s90_DODAhMhRXkd0JptQ';

export default function ReceiptScanner() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef(null);
  const [uri, setUri] = useState(null);
  const [mode, setMode] = useState("camera");
  const [facing, setFacing] = useState("back");
  const [extractedText, setExtractedText] = useState("");
  

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
    if (photo?.uri) {
      setUri(photo.uri);
      extractTextFromImage(photo.uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });
    if (!result.canceled && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setUri(selectedAsset.uri);
      extractTextFromImage(selectedAsset.uri);
    }
  };

  const extractTextFromImage = async (imageUri) => {
    try {
      const base64Image = await getBase64Image(imageUri);
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requests: [
              {
                image: {
                  content: base64Image,
                },
                features: [
                  {
                    type: "TEXT_DETECTION",
                  },
                ],
              },
            ],
          }),
        }
      );
      const result = await response.json();
      const detectedText = result.responses[0]?.fullTextAnnotation?.text || "";
      setExtractedText(detectedText);
      processReceiptWithOpenAI(detectedText);
    } catch (error) {
      console.error("Error extracting text from image:", error);
      Alert.alert("Error", "Failed to extract text from the image.");
    }
  };

  const processReceiptWithOpenAI = async (rawText) => {
    try {
      const prompt = `
  You are an expense tracking assistant. Given the following receipt text, extract:
  
  - Title (merchant/store name)
  - Date of transaction (MM/DD/YYYY)
  - Total Amount
  - Category (choose one: Health, Internet, Food, Utilities, School, Shopping, Others)
  
  Return ONLY the result in this JSON format without any explanations or markdown formatting:
  
  {
    "title": "",
    "date": "",
    "amount": "",
    "category": ""
  }
  
  Receipt text:
  ${rawText}
  `;
  
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer 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`,
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1:free",
          messages: [
            {
              role: "system",
              content: "You are an AI that extracts structured expense data from receipt text.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.2,
        }),
      });
  
      const data = await response.json();
      console.log("OpenAI response data:", JSON.stringify(data, null, 2));
  
      const message = data?.choices?.[0]?.message?.content;
  
      if (!message) {
        console.error("OpenAI response missing message content.");
        Alert.alert("Error", "OpenAI didn't return valid content.");
        return;
      }
  
      // ✅ Strip markdown formatting if present
      let cleanedMessage = message.trim();
      if (cleanedMessage.startsWith("```")) {
        cleanedMessage = cleanedMessage.replace(/```(?:json)?\n?/, "").replace(/```$/, "").trim();
      }
  
      let extractedInfo;
      try {
        extractedInfo = JSON.parse(cleanedMessage);
      } catch (err) {
        console.error("JSON Parse Error:", err, "\nRaw message:", cleanedMessage);
        Alert.alert("Error", "Could not parse OpenAI response as JSON.");
        return;
      }
      const { title, date, amount, category } = extractedInfo;

      // ✅ Format date correctly for Date object
      const [month, day, year] = date.split("/");
      const formattedDate = `${parseInt(month)}/${parseInt(day)}/${year}`;
  
      // ✅ Fetch categories from AsyncStorage
      const storedCategories = await AsyncStorage.getItem("categories");
      const parsedCategories = storedCategories ? JSON.parse(storedCategories) : [];
  
      // ✅ Find matching category object
      const matchedCategory = parsedCategories.find(cat => cat.label.toLowerCase() === category.toLowerCase());
  
  
      // ✅ Navigate with the full data
      navigation.goBack();
      navigation.navigate("Expenses", {
        scannedExpense: {
          title,
          amount,
          category,
          date: formattedDate,
        },
      });

  
    } catch (error) {
      console.error("OpenAI Processing Error:", error);
      Alert.alert("Failed", "Could not process or send receipt data.");
    }
  };
  
  

  const getBase64Image = async (imageUri) => {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result.split(",")[1];
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const toggleMode = () => {
    if (mode === "camera") {
      pickImage();
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

  const handleBackButton = () => {
    navigation.goBack();
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

      {/* Extracted Text 
      {extractedText ? (
        <View style={styles.textContainer}>
          <Text style={styles.extractedText}>{extractedText}</Text>
        </View>
      ) : null}*/}

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
              setUri(null);
              setExtractedText("");
            } else {
              takePicture();
            }
          }}
        >
          <View
            style={[
              styles.shutterBtnInner,
              { backgroundColor: uri ? "white" : "#FAA053" },
            ]}
          >
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
    zIndex: 10,
    padding: 10,
  },
  cameraWrapper: {
    flex: 4,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  imageWrapper: {
    position: "relative",
    width: "80%",
    aspectRatio: 3 / 4,
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
    aspectRatio: 3 / 4,
    backgroundColor: "gray",
  },
  textContainer: {
    flex: 1,
    padding: 20,
  },
  extractedText: {
    fontSize: 16,
    color: "#333",
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
