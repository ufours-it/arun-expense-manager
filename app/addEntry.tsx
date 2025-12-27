import { gradients } from "@/context/gradients";
import { useTheme } from "@/context/ThemeContext";
import { addExpense, deleteExpense, updateExpense } from "@/db/expenses";
import Dropdown from "@/utiles/Dropdown";
import { showToast } from "@/utiles/Toast";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Yup from "yup";
import DateTimePickerModal from "react-native-modal-datetime-picker";

type Expense = {
   amount: number;
   category: string;
   date: string;
   note?: string;
}

export default function AddEntry() {
   const params = useLocalSearchParams();
   const router = useRouter();
   const { theme } = useTheme();
   const styles = getStyles(theme);
   const options = [
      { label: "Select Category...", value: "" },
      { label: "Food", value: "Food" },
      { label: "Transport", value: "Transport" },
      { label: "Personal", value: "Personal" },
      { label: "Work", value: "Work" },
      { label: "Shopping", value: "Shopping" },
      { label: "Other", value: "Other" },
   ];

   const [showDatePicker, setShowDatePicker] = useState(false);

   const ExpenseSchema = Yup.object().shape({
      amount: Yup.number()
         .typeError("Amount must be a number")
         .positive("Amount must be positive")
         .max(999999, "Amount must be at most 6 digits")
         .required("Amount is required"),
      note: Yup.string()
         .max(500, "Notes cannot exceed 500 characters")
         .required("Notes is required"),
      category: Yup.string().required("Category is required"),
      date: Yup.date().required("Date is required"),
   });

   const initialValues = {
      amount: params.amount ? String(params.amount) : "",
      category: params.category ? String(params.category) : "",
      note: params.note ? String(params.note) : "",
      date: params.date ? new Date(String(params.date)) : new Date(),
   };

   const handleSubmit = async (values: Expense) => {
      try {
         const result = params.id
            ? await updateExpense(
               Number(params.id),
               Number(values.amount),
               values.category.trim(),
               values.date,
               values.note?.trim()
            )
            : await addExpense(
               Number(values.amount),
               values.category.trim(),
               values.date,
               values.note?.trim()
            );

         if (result.changes === 1) {
            if (params.id){
               showToast("Expense Updated!", "success");
            }
            else{
               showToast("Expense Added!", "success");
            }
           
            router.back();
         } else {
            if (params.id) {
               showToast("Failed to Updated!", "error");
            }
            else {
               showToast("Failed to Added!", "error");
            }
         }
      } catch (error) {
         if (params.id) {
            showToast("Failed to Updated!", "error");
         }
         else {
            showToast("Failed to Added!", "error");
         }
      }
   };

   const handleDelete = async () => {
      if(params.id){
         Alert.alert(
            "Delete Expense",
            "Are you sure you want to delete this expense?",
            [
               { text: "Cancel", style: "cancel" },
               {
                  text: "Delete",
                  style: "destructive",
                  onPress: async () => {
                     try {
                        const result = await deleteExpense(Number(params.id));

                        if (result.changes === 1) {
                           showToast("Expense Deleted!", "success");
                           router.back();
                        } else {
                           showToast("Failed to deleted!", "error");
                        }
                     } catch (error) {
                        showToast("Failed to deleted!", "error");
                     }
                  },
               },
            ]
         )
      }
      else{
         showToast("Failed to deleted!", "error");
      }
   }

   return (
      <LinearGradient
         colors={gradients[theme]}
         style={styles.body}
      >
         <KeyboardAwareScrollView
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={Platform.OS === "ios" ? 80 : 100}
            showsVerticalScrollIndicator={false}
         >
            <View style={styles.formContainer}>
               <View style={{ display: "flex" }}>
                  <Pressable onPress={() => router.back()} style={styles.backArrow}>
                     <Ionicons name="arrow-back" size={22} color="white" />
                  </Pressable>
                  <Text style={styles.header}>{params.id ? "Update" : "Add"} Expense</Text>
               </View>

               <Formik
                  initialValues={initialValues}
                  validationSchema={ExpenseSchema}
                  onSubmit={(values, { resetForm }) => {
                     handleSubmit({
                        amount: Number(values.amount),
                        category: values.category,
                        date: values.date.toISOString(),
                        note: values.note || ""
                     });
                     resetForm();
                  }}
               >
                  {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, dirty }) => (
                     <View>

                        <View style={styles.inputGroup}>
                           <Text style={styles.label}>Amount</Text>

                           <View style={styles.inputContainer}>
                              <TextInput
                                 style={styles.input}
                                 placeholder="Enter amount"
                                 placeholderTextColor="#000"
                                 value={values.amount}
                                 onChangeText={handleChange("amount")}
                                 onBlur={handleBlur("amount")}
                                 keyboardType="numeric"
                              />
                              <FontAwesome
                                 name="rupee"
                                 size={16}
                                 color="#000"
                                 style={styles.inputIconRight}
                              />
                           </View>

                           {errors.amount && touched.amount && (
                              <Text style={styles.error}>{errors.amount}</Text>
                           )}
                        </View>

                        <View style={styles.inputGroup}>
                           <Text style={styles.label}>Category</Text>

                           <View style={{ flex: 1 }}>
                              <Dropdown
                                 value={values.category}
                                 onChange={(val: string) => setFieldValue("category", val)}
                                 options={options}
                                 selectStyle={{
                                    height: 48,
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    elevation: 5,
                                 }}
                              />
                           </View>

                           {errors.category && touched.category && (
                              <Text style={styles.error}>{errors.category}</Text>
                           )}
                        </View>

                        <View style={styles.inputGroup}>
                           <Text style={styles.label}>Date</Text>

                           <View style={styles.inputContainer}>
                              <Pressable
                                 style={styles.input}
                                 onPress={() => setShowDatePicker(true)}
                              >
                                 <Text>{values.date.toDateString()}</Text>
                              </Pressable>

                              <Ionicons
                                 name="calendar"
                                 size={18}
                                 color="#000"
                                 style={styles.inputIconRight}
                              />
                           </View>

                           <DateTimePickerModal
                              isVisible={showDatePicker}
                              mode="date"
                              onConfirm={(date) => {
                                 setFieldValue("date", date);
                                 setShowDatePicker(false);
                              }}
                              onCancel={() => setShowDatePicker(false)}
                           />

                           {errors.date && touched.date && (
                              <Text style={styles.error}>{errors.date as string}</Text>
                           )}
                        </View>

                        <View style={styles.inputGroup}>
                           <Text style={styles.label}>Notes</Text>

                           <TextInput
                              style={[styles.input, { height: 100 }]}
                              placeholder="Enter your note"
                              value={values.note}
                              placeholderTextColor="#000"
                              onChangeText={handleChange("note")}
                              onBlur={handleBlur("note")}
                              multiline
                              textAlignVertical="top"
                           />

                           {errors.note && touched.note && (
                              <Text style={styles.error}>{errors.note}</Text>
                           )}
                        </View>

                        {params.id ? (
                           <View style={styles.udBtn}>
                              <Pressable style={styles.deleteBtn} onPress={() => handleDelete()}>
                                 <FontAwesome name="trash" size={16} color="rgba(223, 75, 75, 0.86)" />
                                 <Text style={styles.deleteText}>Delete</Text>
                              </Pressable>
                              <Pressable 
                                 style={styles.updateBtn} 
                                 disabled={!dirty} 
                                 onPress={() => handleSubmit()}
                              >
                                 <FontAwesome name="edit" size={16} color="#fff" />
                                 <Text style={styles.saveText}>Update</Text>
                              </Pressable>
                           </View>) :
                           (<Pressable style={styles.saveBtn} onPress={() => handleSubmit()}>
                              <FontAwesome name="save" size={16} color="#fff" />
                              <Text style={styles.saveText}>Save</Text>
                           </Pressable>)
                        }
                     </View>
                  )}
               </Formik>
            </View>
         </KeyboardAwareScrollView>

      </LinearGradient>
   )
}

const getStyles = (theme: string) =>
   StyleSheet.create({
      body: {
         flex: 1,
         paddingHorizontal: 20,
      },
      formContainer: {
         marginTop: 50
      },
      backArrow: {
         display: "flex",
         alignItems: "center",
         justifyContent: "center",
         width: 36,
         height: 35,
         backgroundColor: theme === "dark" ? "#3b3b61ff" : "#59209bff",
         borderRadius: 50,
         textAlign: "center",
      },
      header: {
         fontSize: 26,
         fontWeight: "bold",
         marginBottom: 50,
         color: theme === "dark" ? "white" : "black",
         textAlign: "center"
      },
      inputGroup: {
         marginBottom: 15,
      },
      label: {
         fontSize: 20,
         fontWeight: "600",
         marginBottom: 5,
         color: theme === "dark" ? "white" : "black",
      },
      input: {
         backgroundColor: theme === "dark" ? "#f3f3f3ff" : "white",
         justifyContent: "center",
         padding: 12,
         borderRadius: 5,
         height: 50,
         // iOS shadow
         shadowColor: "#000",
         color: "black",
         shadowOffset: { width: 0, height: 2 },
         shadowOpacity: 0.25,
         shadowRadius: 3.84,
         // Android shadow
         elevation: 5,
         paddingRight: 35,
      },
      inputContainer: {
         position: "relative",
      },
      inputIconRight: {
         position: "absolute",
         right: 10,
         top: "50%",
         transform: [{ translateY: -8 }],
         color: "#555",
      },
      saveBtn: {
         gap: 4,
         flexDirection: "row",
         justifyContent: "center",
         backgroundColor: "#59209bff",
         padding: 15,
         borderRadius: 10,
         alignItems: "center",
         marginTop: 30,
         // iOS shadow
         shadowColor: "#000",
         shadowOffset: { width: 0, height: 4 },
         shadowOpacity: 0.3,
         shadowRadius: 4.65,
         // Android shadow
         elevation: 8,
      },
      saveText: {
         color: "#fff",
         fontWeight: "bold",
         fontSize: 16,
      },
      error: {
         color: "red",
         marginTop: 5,
      },
      udBtn:{
         display: "flex",
         flexDirection: "row",
         gap: 10
      },
      deleteBtn: {
         flex: 1,
         gap: 4,
         flexDirection: "row",
         justifyContent: "center",
         backgroundColor: "#ffffffff",
         padding: 15,
         borderRadius: 10,
         alignItems: "center",
         borderColor: "rgba(223, 75, 75, 0.41)",
         borderWidth: 1,
         marginTop: 30,
         // iOS shadow
         shadowColor: "#000",
         shadowOffset: { width: 0, height: 2 },
         shadowOpacity: 0.15,
         shadowRadius: 3,
         // Android shadow
         elevation: 3,
      },
      deleteText: {
         color: "rgba(223, 75, 75, 0.86)",
         fontWeight: "700",
         fontSize: 16,
      },
      updateBtn: {
         flex: 1,
         gap: 4,
         flexDirection: "row",
         justifyContent: "center",
         backgroundColor: "#59209bff",
         padding: 15,
         borderRadius: 10,
         alignItems: "center",
         marginTop: 30,
         // iOS shadow
         shadowColor: "#000",
         shadowOffset: { width: 0, height: 4 },
         shadowOpacity: 0.3,
         shadowRadius: 4.65,
         // Android shadow
         elevation: 8,
      }
   });