import { gradients } from "@/context/gradients";
import { useTheme } from "@/context/ThemeContext";
import { Expense, getExpenses, getExpensesRange } from "@/db/expenses";
import { DateRangeType, getDateRange } from "@/utiles/dateRange";
import ExpenseCard from "@/utiles/ExpenseCard";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
   ActivityIndicator,
   FlatList,
   Pressable,
   StyleSheet,
   Text,
   View,
} from "react-native";

export default function Index() {
   const params = useLocalSearchParams();
   const { theme } = useTheme();
   const router = useRouter();
   const [expenses, setExpenses] = useState<Expense[]>([]);
   const [loading, setLoading] = useState(false);
   const [total, setTotal] = useState(0);
   const styles = getStyles(theme);

   const loadExpenses = async () => {
      if (loading) return;
      setLoading(true);
      setExpenses([]);
      setTotal(0);

      const { start, end } = getDateRange(params.range as DateRangeType || "all");
      let rows;
      if (!start || !end) {
            rows = await getExpenses();
      } else {
            rows = await getExpensesRange(
            start.toISOString(),
            end.toISOString()
            );
      }
      
      setExpenses(rows ?? []);

      const total = rows.reduce(
            (sum, e) => sum + e.amount,
            0
      );
      setTotal(total);
      setLoading(false);
   };
   
   useFocusEffect(
      useCallback(() => {
         loadExpenses();
      }, [])
   );

   return (
      <LinearGradient colors={gradients[theme]} style={styles.body}>

         {/* Header */}
         <Pressable style={styles.header} onPress={() => router.back()}>
            <Ionicons
               name="chevron-back"
               size={25}
               color={theme === "dark" ? "#fff" : "#59209b"}
            />
            <Text style={styles.headerText}>Expenses</Text>
         </Pressable>

         {(expenses.length > 0 && !loading) &&
            <>
               <View style={styles.viewTotal}>
                  <Text style={styles.totalExpenseText}>Total Expenses</Text>
               <Text style={styles.totalAmount}>₹ {total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</Text>
               </View>

               <View style={styles.viewReport}>
                  <Text style={styles.recentExpensesText}>Expenses</Text>
               </View>
            </>
         }

         {/* Main Scroll */}
         <FlatList
            data={expenses}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ paddingBottom: 30 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
               loading ? (
                  <View style={styles.loaderWrapper}>
                     <ActivityIndicator size="large" color="#59209bff" />
                  </View>
               ) : (
                  <Text style={styles.emptyText}>No expenses found</Text>
               )
            }

            renderItem={({ item }) => (
               <ExpenseCard
                  item={item}
                  theme={theme}
               />
            )}
         />

      </LinearGradient>
   );
}

const getStyles = (theme: string) =>
   StyleSheet.create({
      body: {
         flex: 1,
         paddingTop: 50,
         paddingHorizontal: 20,
         paddingBottom: 12,
      },
      viewHead: {
         flexDirection: "row",
         alignItems: "center",
         justifyContent: "space-between",
      },
      header: {
         flexDirection: "row",
         alignItems: "center",
         marginTop: 8,
         gap: 5,
      },
      headerText: {
         fontSize: 26,
         fontWeight: "bold",
         color: theme === "dark" ? "#fff" : "#59209b",
      },
      dateWrapper: {
         flexDirection: "row",
         alignItems: "center",
      },
      dateTop: {
         fontSize: 23,
         fontFamily: "Inter-Black",
         color: theme === "dark" ? "white" : "black",
         fontWeight: "700",
      },
      btn: {
         padding: 7,
         backgroundColor: theme === "dark" ? "#3b3b61ff" : "#59209bff",
         borderRadius: 50,
         textAlign: "center",
      },
      btn1: {
         flexDirection: "row",
         alignItems: "center",
         paddingVertical: 8,
         paddingHorizontal: 12,
         backgroundColor: theme === "dark" ? "#3b3b61ff" : "#59209bff",
         borderRadius: 50,
      },
      btn1Text: {
         color: "#fff",
         fontWeight: "600",
         fontSize: 16,
      },
      viewTotal: {
         paddingVertical: 40,
         alignItems: "center",
         justifyContent: "center",
      },
      totalExpenseText: {
         color: theme === "dark" ? "white" : "black",
         fontSize: 17,
         fontWeight: "500",
      },
      totalAmount: {
         color: theme === "dark" ? "white" : "black",
         paddingVertical: 5,
         fontSize: 40,
         fontWeight: "600",
         fontFamily: "Inter-Black",
      },
      viewReport: {
         display: "flex",
         flexDirection: "row",
         justifyContent: 'space-between',
         marginBottom: 10,
      },
      recentExpensesText: {
         fontSize: 17,
         fontWeight: "600",
         color: theme === "dark" ? "white" : "black",
      },
      reportRow: {
         flexDirection: "row",
         alignItems: "center",
         gap: 2,
      },
      reportText: {
         fontSize: 17,
         fontWeight: "600",
         color: theme === "dark" ? "#fff" : "#59209b",
      },
      emptyText: {
         textAlign: "center",
         marginTop: 40,
         color: "#999",
      },

      loaderWrapper: {
         flex: 1,
         justifyContent: "center",
         alignItems: "center",
         marginTop: 50,
      },
   });