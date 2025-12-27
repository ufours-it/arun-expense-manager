import { Platform, ToastAndroid } from "react-native";
import Toast from "react-native-toast-message";

export const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
   if (Platform.OS === "android") {
      ToastAndroid.show(
         message,
         ToastAndroid.SHORT
      );
   } else {
      Toast.show({
         type,
         text1: message,
         position: "top",
         visibilityTime: 1000,
      });
   }
};
