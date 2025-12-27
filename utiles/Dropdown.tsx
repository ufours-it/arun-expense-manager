import { useState, useRef } from "react";
import {
   View,
   Text,
   Pressable,
   StyleSheet,
   StyleProp,
   ViewStyle,
   Modal,
   TouchableWithoutFeedback,
   Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Option = {
   label: string;
   value: string;
};

type Props = {
   value: string;
   onChange: (value: string) => void;
   options: Option[];
   containerStyle?: StyleProp<ViewStyle>;
   selectStyle?: StyleProp<ViewStyle>;
   dropdownStyle?: StyleProp<ViewStyle>;
};

const screenWidth = Dimensions.get("window").width;

export default function Dropdown({
   value,
   onChange,
   options,
   containerStyle,
   selectStyle,
   dropdownStyle,
}: Props) {
   const [open, setOpen] = useState(false);
   const [position, setPosition] = useState({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
   });

   const selectRef = useRef<View>(null);

   const openDropdown = () => {
      selectRef.current?.measureInWindow((x, y, width, height) => {
         setPosition({ x, y, width, height });
         setOpen(true);
      });
   };

   const selected = options.find(o => o.value === value);

   return (
      <>
         {/* Select */}
         <View ref={selectRef} style={[styles.container, containerStyle]}>
            <Pressable
               style={[styles.select, selectStyle]}
               onPress={openDropdown}
            >
               <Text style={styles.selectText}>
                  {selected?.label ?? "Select option"}
               </Text>
               <Ionicons
                  name={open ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#555"
               />
            </Pressable>
         </View>

         {/* Dropdown */}
         <Modal
            visible={open}
            transparent
            animationType="fade"
            onRequestClose={() => setOpen(false)}
         >
            <TouchableWithoutFeedback onPress={() => setOpen(false)}>
               <View style={styles.overlay}>
                  <View
                     style={[
                        styles.dropdown,
                        {
                           top: position.y + position.height + 10,
                           left: position.x,
                           width: position.width,
                        },
                        dropdownStyle,
                     ]}
                  >
                     {options.map(option => (
                        <Pressable
                           key={option.value}
                           style={styles.option}
                           disabled={option.value === ""}
                           onPress={() => {
                              onChange(option.value);
                              setOpen(false);
                           }}
                        >
                           <Text
                              style={[
                                 styles.optionText,
                                 option.value === "" && styles.disabledText,
                              ]}
                           >
                              {option.label}
                           </Text>
                        </Pressable>
                     ))}
                  </View>
               </View>
            </TouchableWithoutFeedback>
         </Modal>
      </>
   );
}

const styles = StyleSheet.create({
   container: {
      position: "relative",
   },

   select: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 8,
      borderRadius: 6,
      backgroundColor: "#fff",
   },

   selectText: {
      fontSize: 16,
      paddingRight: 4,
   },

   overlay: {
      flex: 1,
   },

   dropdown: {
      position: "absolute",
      backgroundColor: "#fff",
      borderRadius: 6,
      elevation: 10,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
   },

   option: {
      padding: 12,
   },

   optionText: {
      fontSize: 16,
   },

   disabledText: {
      color: "#aaa",
   },
});
