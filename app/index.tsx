import Dropdown from "@/components/Dropdown";
import ExpenseCard from "@/components/ExpenseCard";
import { gradients } from "@/context/gradients";
import { useTheme } from "@/context/themeContext";
import { Expense, getExpenses, getExpensesRange } from "@/db/expenses";
import { DateRangeType, getDateRange } from "@/utiles/dateRange";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

export default function Report() {
  const { theme, toggleTheme } = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [range, setRange] = useState<DateRangeType>("all");
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

  const options = [
    { label: "Today", value: "today" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
    { label: "Year", value: "year" },
    { label: "All", value: "all" },
  ];

  const CATEGORY_OPTIONS = [
    "Food",
    "Transport",
    "Personal",
    "Work",
    "Shopping",
    "Other",
  ];

  const BAR_WIDTH = 70;
  const chartWidth = CATEGORY_OPTIONS.length * BAR_WIDTH;

  const loadExpenses = async () => {
    if (loading) return;
    setLoading(true);

    const { start, end } = getDateRange(range);
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

  const getCategoryBarData = () => {
    const totals = CATEGORY_OPTIONS.map(cat =>
        expenses
          .filter(e => e.category === cat)
          .reduce((sum, e) => sum + e.amount, 0)
    );

    return {
        labels: CATEGORY_OPTIONS,
        datasets: [
          {
              data: totals,
          },
        ],
    };
  };

  const formatAmount = (
    value: number,
    options?: { compact?: boolean }
  ) => {
    if (options?.compact) {
      if (value >= 1e7) return (value / 1e7).toFixed(2) + " Cr";
      if (value >= 1e5) return (value / 1e5).toFixed(2) + " L";
    }

    return value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const chartConfig = {
    backgroundGradientFrom:
        theme === "dark" ? "#3b3b61ff" : "#ffffff",
    backgroundGradientTo:
        theme === "dark" ? "#3b3b61ff" : "#ffffff",
    decimalPlaces: 0,

    color: (opacity = 1) =>
        theme === "dark"
          ? `rgba(255,255,255,${opacity})`
          : `rgba(89,32,155,${opacity})`,

    labelColor: (opacity = 1) =>
        theme === "dark"
          ? `rgba(255,255,255,${opacity})`
          : `rgba(0,0,0,${opacity})`,

    propsForBackgroundLines: {
        stroke:
          theme === "dark"
              ? "rgba(255,255,255,0.15)"
              : "rgba(0,0,0,0.08)",
    },
    propsForLabels: {
      fontSize: 10,
    },
    formatYLabel: (yValue: string) => "   ₹ " + formatAmount(Number(yValue), { compact: true }),
  };

  useFocusEffect(
    useCallback(() => {
      setExpenses([]);
      setTotal(0)
      loadExpenses();
    }, [range])
  );

  return (
    <LinearGradient
      colors={gradients[theme]}
      style={styles.body}
    >
      {/* Header */}
      <View style={styles.viewHead}>
        <View style={styles.btn}>
            <Pressable onPress={toggleTheme}>
            <Ionicons
              name={theme === "dark" ? "sunny" : "moon-outline"}
              size={25}
              color="white"
            />
            </Pressable>
        </View>

        <View style={styles.dateWrapper}>
            <Ionicons
            name="calendar-outline"
            size={25}
            color={theme === "dark" ? "white" : "black"}
            style={{ marginRight: 6 }}
            />
            <Text style={styles.dateTop}>{today}</Text>
        </View>

        <Link href="/addEntry" asChild>
            <Pressable style={styles.btn1}>
            <Ionicons
              name="add-outline"
              size={20}
              color="white"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.btn1Text}>
              Add
            </Text>
            </Pressable>
        </Link>

      </View>

      {/* Total */}
      <View style={styles.totalCard}>
        <View style={styles.leftTotalCard}>
          <Text style={styles.totalLabel}>Total Expenses</Text>
          <Text style={styles.totalValue}>₹ {formatAmount(total)}</Text>
        </View>
        <View style={styles.rightCard}>
            <Dropdown
              value={range}
              onChange={(val: string) => setRange(val as DateRangeType)}
              options={options}
            />
        </View>
      </View>

      {/* Chart */}
      <View style={styles.chartCard}>
        {loading && <View style={styles.chartSkeleton} />}

        {!loading && expenses.length === 0 && (
          <View style={styles.emptyWrapper}>
            <Text style={styles.welcomeTitle}>Welcome Buddy!</Text>
            <Image
              source={require("@/assets/images/splash-icon.png")}
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyText}>No expenses found</Text>
          </View>
        )}

        {!loading && expenses.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={getCategoryBarData()}
              width={chartWidth}
              height={260}
              fromZero
              yAxisLabel=""
              yAxisSuffix=""
              showValuesOnTopOfBars
              chartConfig={chartConfig}

            />
          </ScrollView>
        )}
      </View>

      {/* Expenses */}
      {(expenses.length > 0 && !loading) && 
        <View style={styles.expensesView}>
          <Text style={styles.expensesText}>{options.find(o => o.value === range)?.label} Expenses</Text>
            {expenses.length > 5 && 
              <Pressable onPress={() =>
                router.push({
                  pathname: "/report",
                  params: {
                    range
                  },
                })
              }>
                <Text style={styles.expensesTextSeeAll}>See All</Text>
              </Pressable>
            }
        </View>
      }
      <FlatList
        data={expenses.slice(0, 5)}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={loading ? (
            <View style={styles.loaderWrapper}>
              <ActivityIndicator size="large" color="#59209bff" />
            </View>
            ) : (
              null
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
  )
}

const getStyles = (theme: string) =>
  StyleSheet.create({
    body: {
        flex: 1,
        paddingHorizontal: 20,
    },
    container: {
        flex: 1,
    },

    viewHead: {
        marginTop: 50,
        marginBottom: 25,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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

    totalCard: {
        padding: 15,
        borderRadius: 12,
        backgroundColor: theme === "dark" ? "#3b3b61ff" : "#59209bff",
        elevation: 4,
        flexDirection: "row",
    },
    leftTotalCard: {
        flex: 2,
    },
    rightCard: {
        flex: 1,
    },
    
    totalLabel: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
    },
    totalValue: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "bold",
        marginTop: 4,
    },

    chartCard: {
      marginTop: 30,
      height: 260,
    },
    emptyText: {
        textAlign: "center",
        marginTop: 30,
        color: "#999",
    },

    expensesView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 20,
        marginBottom: 10,
    },
    expensesText: {
        fontSize: 18,
        fontWeight: "bold",
        color: theme === "dark" ? "#fff" : "#59209b",
    },
    expensesTextSeeAll: {
        fontWeight: 500,
        color: theme === "dark" ? "#fff" : "#59209b",
    },
    loaderWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    chartSkeleton:{
        height: 260,
        borderRadius: 12,
        backgroundColor: theme === "dark"
          ? "rgba(255,255,255,0.12)"
          : "rgba(89,32,155,0.12)",
    },

    emptyWrapper: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      padding: 40,
    },
    welcomeTitle: {
      fontSize: 32,
      fontWeight: "700",
      color: theme === "dark" ? "white" : "black",
      marginBottom: 50,
    },
    emptyImage: {
      width: 260,
      height: 260,
      marginBottom: 20,
    },
  });