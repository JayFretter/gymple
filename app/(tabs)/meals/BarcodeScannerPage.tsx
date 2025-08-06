import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import GradientPressable from "@/components/shared/GradientPressable";
import { router } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const CAMERA_FACING: CameraType = 'back';

export default function BarcodeScannerPage() {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  const onBarcodeScanned = (result: BarcodeScanningResult) => {
    const barcode = result.data;
    router.replace({ pathname: '/meals/TrackMealPage', params: { barcode } })
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="h-full w-full bg-primary p-4 flex items-center">
        <Text className="text-3xl text-txt-primary font-semibold">Scan Barcode</Text>
        <Text className="text-txt-primary mt-4">We need your permission to use the camera.</Text>
        <GradientPressable className="w-full mt-4" style="default" onPress={requestPermission}>
          <Text className="text-txt-primary text-center my-2">Grant Permission</Text>
        </GradientPressable>
      </View>
    );
  }

  return (
    <View className="bg-primary h-full p-4 flex items-center">
      <View className="flex-row items-center gap-2 mb-12 mt-8">
        <Text className="text-2xl text-txt-primary font-semibold">Scan Food Barcode</Text>
        <MaterialCommunityIcons name="barcode-scan" size={20} color="white" />
      </View>
      <CameraView
        style={styles.camera} 
        facing={CAMERA_FACING}
        onBarcodeScanned={onBarcodeScanned}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  camera: {
    height: '70%',
    width: '100%',
    borderRadius: 32,
  }
});
