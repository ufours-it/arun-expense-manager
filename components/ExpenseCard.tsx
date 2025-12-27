import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Expense } from "@/db/expenses";

const categoryIcons: Record<string, any> = {
   Food: "fast-food-outline",
   Transport: "car-outline",
   Personal: "person-outline",
   Work: "briefcase-outline",
   Shopping: "cart-outline",
   Other: "apps-outline",
};

type Props = {
   item: Expense;
   theme: string;
};

export default function ExpenseCard({ item, theme }: Props) {
   const router = useRouter();
   const styles = getStyles(theme);
   const itemDate = new Date(item.date).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
   });
   const iconName = categoryIcons[item.category] || "apps-outline";

   return (
      <Pressable
         onPress={() =>
            router.push({
               pathname: "/addEntry",
               params: {
                  id: item.id,
                  amount: item.amount.toString(),
                  category: item.category,
                  note: item.note ?? "",
                  date: item.date,
               },
            })
         }
      >
         <View style={styles.expenseCard}>
            <View style={styles.leftColumn}>
               <View style={styles.leftIcon}>
                  <Ionicons
                     name={iconName}
                     size={22}
                     color="#333"
                     style={styles.expenseIcon}
                  />
               </View>
               <View style={styles.cnText}>
                  <Text style={styles.category}>{item.category}</Text>
                  <Text style={styles.note}>{item.note || "N/A"}</Text>
               </View>
            </View>

            <View style={styles.rightColumn}>
               <Text style={styles.amount}>₹ {item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</Text>
               <Text style={styles.dateText}>{itemDate}</Text>
            </View>
         </View>
      </Pressable>
   );
}

const getStyles = (theme: string) =>
   StyleSheet.create({
      expenseCard: {
         flexDirection: "row",
         justifyContent: "space-between",
         padding: 12,
         minHeight: 70,
         marginVertical: 6,
         borderRadius: 8,
         //Shadow for iOS
         shadowColor: "#000",
         shadowOffset: { width: 0, height: 2 },
         shadowOpacity: 0.1,
         shadowRadius: 4,
         //Shadow for Android
         elevation: 3,
         backgroundColor: theme === "dark" ? "#24243e" : "#ffffffff",
         borderWidth: 1,
         borderColor: theme === "dark" ? "rgba(255,255,255,0.18)" : "rgba(29, 27, 27, 0.18)",
      },
      expenseIcon: {
         padding: 8,
         color: "white",
         marginRight: 8,
         borderRadius: 10,
         alignItems: "center",
         justifyContent: "center",
         backgroundColor: theme === "dark" ? "#3b3b61ff" : "#59209bff",
      },
      leftColumn: {
         flex: 2,
         flexDirection: "row",
         alignItems: "center",
      },
      cnText: {
         width: "100%",
         paddingRight: 15
      },
      leftIcon: {
         display: "flex",
         alignItems: "flex-start",
         height: "100%"
      },
      rightColumn: {
         flex: 1,
         alignItems: "flex-end",
         justifyContent: "flex-start",
      },
      category: {
         fontSize: 16,
         fontWeight: "600",
         color: theme === "dark" ? "#ffffff" : "#333333",
      },
      note: {
         fontSize: 14,
         color: theme === "dark"
            ? "rgba(255,255,255,0.7)"
            : "#666666",
         marginTop: 2,
      },
      amount: {
         fontSize: 16,
         fontWeight: "700",
         color: theme === "dark"
            ? "#2a9d8f"
            : "#059669",
      },
      dateText: {
         fontSize: 14,
         color: theme === "dark"
            ? "rgba(255,255,255,0.55)"
            : "#575454ff",
         marginTop: 4,
         fontWeight: "600",
      },
   });
