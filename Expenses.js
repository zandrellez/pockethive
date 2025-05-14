import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    TextInput,
    Modal,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Dimensions
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomCategoryModal from './CustomCategoryModal';
import { Router } from 'expo-router';


const screenWidth = Dimensions.get("window").width;
const categoryOptions = [
    { label: 'Food', icon: 'fast-food' },
    { label: 'Utilities', icon: 'flash' },
    { label: 'Shopping', icon: 'bag' },
    { label: 'School', icon: 'school' },
    { label: 'Internet', icon: 'wifi' },
    { label: 'Health', icon: 'heart' },
    { label: 'Others', icon: 'help-circle' },
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

const YEARS = Array.from({ length: 2030 - 1990 + 1 }, (_, i) => 1990 + i);

const ExpensesScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0]);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [amount, setAmount] = useState('');
    const [title, setTitle] = useState('');
    const [dailyExpenses, setDailyExpenses] = useState({});
    const [viewMode, setViewMode] = useState('weekly');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [customCategories, setCustomCategories] = useState([]);
    const [customCategoryModalVisible, setCustomCategoryModalVisible] = useState(false);

    const route = useRoute();
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
          const scannedExpense = route.params?.scannedExpense;
          if (scannedExpense) {
            setTitle(scannedExpense.title || "");
            setAmount(scannedExpense.amount?.toString() || "");
            if (scannedExpense.date) {
                const [month, day, year] = scannedExpense.date.split("/").map(Number);
                const parsedDate = new Date(year, month - 1, day);
                if (!isNaN(parsedDate)) {
                  setDate(parsedDate);
                } else {
                  console.warn("Invalid date parsed:", scannedExpense.date);
                }
              }
              
      
            // Find and set matched category from your combinedCategories
            const matchedCategory = combinedCategories.find(
              (cat) => cat.label.toLowerCase() === scannedExpense.category?.toLowerCase()
            );
            if (matchedCategory) {
              setSelectedCategory(matchedCategory);
            }
      
            setModalVisible(true);
      
            // Clear the param so it doesn't keep triggering
            navigation.setParams({ scannedExpense: null });
          }
        }, [route.params?.scannedExpense])
      );
      


    const initialMonthlyData = {};
    MONTHS.forEach(month => {
        initialMonthlyData[month] = { total: 0, categories: [] };
    });

    const initialYearlyData = {};
    YEARS.forEach(year => {
        initialYearlyData[year] = { total: 0, months: {} };
    });

    const [monthlyData, setMonthlyData] = useState(initialMonthlyData);
    const [yearlyData, setYearlyData] = useState(initialYearlyData);

    useEffect(() => {
        if (Object.keys(dailyExpenses).length > 0) {
            calculateMonthlyAndYearlyData();
        }
    }, [dailyExpenses]);

    const calculateMonthlyAndYearlyData = () => {
        const newMonthlyData = {};
        MONTHS.forEach(month => {
            newMonthlyData[month] = { total: 0, categories: [] };
        });

        const newYearlyData = {};
        YEARS.forEach(year => {
            newYearlyData[year] = { total: 0, months: {} };
            MONTHS.forEach(month => {
                newYearlyData[year].months[month] = 0;
            });
        });

        Object.entries(dailyExpenses || {}).forEach(([dateKey, value]) => {
            if (!dateKey) return;

            const dateParts = dateKey.split('/');
            if (dateParts.length !== 3) return;

            const month = parseInt(dateParts[0]) - 1;
            const day = parseInt(dateParts[1]);
            const year = parseInt(dateParts[2]);

            const expenseDate = new Date(year, month, day);
            if (isNaN(expenseDate.getTime())) return;

            const monthName = MONTHS[expenseDate.getMonth()];
            const expenseYear = expenseDate.getFullYear();
            const total = value?.total || 0;
            const categories = value?.categories || [];

            if (newMonthlyData[monthName]) {
                newMonthlyData[monthName].total += total;
                categories.forEach(cat => {
                    if (cat) {
                        const formattedDate = `${expenseDate.getMonth() + 1}/${expenseDate.getDate()}/${expenseDate.getFullYear()}`;
                        newMonthlyData[monthName].categories.push({
                            ...cat,
                            date: formattedDate,
                            formattedDate: expenseDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        });
                    }
                });
            }

            if (newYearlyData[expenseYear]) {
                newYearlyData[expenseYear].total += total;
                newYearlyData[expenseYear].months[monthName] += total;
            }
        });

        setMonthlyData(newMonthlyData);
        setYearlyData(newYearlyData);
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };

    const handleAddExpense = () => {
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        const newAmount = parseFloat(amount.replace(/[^0-9.-]+/g, '')) || 0;

        setDailyExpenses(prev => {
            const prevDay = prev[formattedDate] || { total: 0, categories: [] };
            const newExpenses = {
                ...prev,
                [formattedDate]: {
                    total: (prevDay.total || 0) + newAmount,
                    categories: [
                        ...(prevDay.categories || []),
                        {
                            category: selectedCategory.label || 'Other',
                            amount: newAmount,
                            title: title || 'Expense',
                            icon: selectedCategory.icon || 'help-circle',
                            date: formattedDate
                        }
                    ]
                }
            };
            return newExpenses;
        });

        setAmount('');
        setTitle('');
        setModalVisible(false);
    };

    const deleteExpense = (dateKey, expense) => {
        setDailyExpenses(prev => {
            const updatedDay = { ...prev[dateKey] };
            updatedDay.total -= expense.amount;
            updatedDay.categories = updatedDay.categories.filter(cat => cat.title !== expense.title);

            const newDailyExpenses = { ...prev, [dateKey]: updatedDay };
            if (updatedDay.categories.length === 0) {
                delete newDailyExpenses[dateKey];
            }
            return newDailyExpenses;
        });
    };

    const getCurrentWeekDates = () => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());

        const weekDays = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            const formattedDate = `${day.getMonth() + 1}/${day.getDate()}/${day.getFullYear()}`;
            weekDays.push({
                date: day,
                key: formattedDate
            });
        }
        return weekDays;
    };

    const getMaxTotal = () => {
        if (viewMode === 'weekly') {
            const weekExpenses = getCurrentWeekDates().map(day =>
                Number(dailyExpenses?.[day.key]?.total) || 0
            );
            return Math.max(...weekExpenses, 1);
        }
        else if (viewMode === 'monthly') {
            return Math.max(...Object.values(monthlyData || {}).map(exp => Number(exp?.total) || 0), 1);
        }
        else if (viewMode === 'yearly') {
            return Math.max(...Object.values(yearlyData || {}).map(exp => Number(exp?.total) || 0), 1);
        }
        return 1;
    };

    const maxTotal = getMaxTotal();

    const todayKey = `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`;
    const currentMonth = MONTHS[new Date().getMonth()];
    const currentYear = new Date().getFullYear();

    const getTotalExpenses = () => {
        if (viewMode === 'weekly') {
            return getCurrentWeekDates().reduce((total, day) => {
                return total + (Number(dailyExpenses?.[day.key]?.total) || 0);
            }, 0);
        }
        else if (viewMode === 'monthly') {
            return Number(monthlyData?.[MONTHS[selectedMonth]]?.total) || 0;
        }
        else if (viewMode === 'yearly') {
            return Number(yearlyData?.[selectedYear]?.total) || 0;
        }
        return 0;
    };

    const handleScanPress = () => {
        navigation.navigate('ReceiptScanner');
    };

    const getExpenseListData = () => {
        if (viewMode === 'weekly') {
            const weekDates = getCurrentWeekDates();
            return weekDates.flatMap(({ key }) => {
                const dayExpenses = dailyExpenses?.[key]?.categories || [];
                return dayExpenses.map(item => {
                    const dateParts = key.split('/');
                    const month = parseInt(dateParts[0]) - 1;
                    const day = parseInt(dateParts[1]);
                    const year = parseInt(dateParts[2]);
                    const itemDate = new Date(year, month, day);
                    
                    return {
                        category: item?.category || 'Other',
                        title: item?.title || '',
                        icon: item?.icon || 'help-circle',
                        amount: `-₱${(Number(item?.amount) || 0).toLocaleString()}`,
                        date: key,
                        formattedDate: itemDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                        expense: item 
                    };
                });
            }).sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        else if (viewMode === 'monthly') {
            const monthData = monthlyData[MONTHS[selectedMonth]] || { categories: [] };
            return (monthData.categories || []).map(item => ({
                category: item?.category || 'Other',
                title: item?.title || '',
                icon: item?.icon || 'help-circle',
                amount: `-₱${(Number(item?.amount) || 0).toLocaleString()}`,
                date: item?.date || '',
                formattedDate: item?.formattedDate || '',
                expense: item
            }))
            .sort((a, b) => {
                const aDateParts = a.date.split('/');
                const bDateParts = b.date.split('/');
                if (aDateParts.length !== 3 || bDateParts.length !== 3) return 0;
                
                const aDate = new Date(
                    parseInt(aDateParts[2]), 
                    parseInt(aDateParts[0]) - 1, 
                    parseInt(aDateParts[1])
                );
                
                const bDate = new Date(
                    parseInt(bDateParts[2]), 
                    parseInt(bDateParts[0]) - 1, 
                    parseInt(bDateParts[1])
                );
                
                return bDate - aDate;
            });
        }
        else if (viewMode === 'yearly') {
            const result = [];
            Object.entries(dailyExpenses || {}).forEach(([dateKey, dayData]) => {
                if (!dateKey) return;

                const dateParts = dateKey.split('/');
                if (dateParts.length !== 3) return;

                const month = parseInt(dateParts[0]) - 1;
                const day = parseInt(dateParts[1]);
                const year = parseInt(dateParts[2]);

                if (year === selectedYear) {
                    const expenseDate = new Date(year, month, day);
                    const monthName = MONTHS[month];

                    (dayData.categories || []).forEach(item => {
                        result.push({
                            category: item?.category || 'Other',
                            title: item?.title || '',
                            icon: item?.icon || 'help-circle',
                            amount: `-₱${(Number(item?.amount) || 0).toLocaleString()}`,
                            date: dateKey,
                            formattedDate: `${monthName} ${day}, ${year}`,
                            expense: item
                        });
                    });
                }
            });

            return result.sort((a, b) => {
                const aDateParts = a.date.split('/');
                const bDateParts = b.date.split('/');
                if (aDateParts.length !== 3 || bDateParts.length !== 3) return 0;
                
                const aDate = new Date(
                    parseInt(aDateParts[2]), 
                    parseInt(aDateParts[0]) - 1, 
                    parseInt(aDateParts[1])
                );
                
                const bDate = new Date(
                    parseInt(bDateParts[2]), 
                    parseInt(bDateParts[0]) - 1, 
                    parseInt(bDateParts[1])
                );
                
                return bDate - aDate;
            });
        }

        return [];
    };

    useEffect(() => {
        const loadExpenses = async () => {
            try {
                const storedData = await AsyncStorage.getItem('dailyExpenses');
                if (storedData) {
                    setDailyExpenses(JSON.parse(storedData));
                }
            } catch (error) {
                console.error('Failed to load expenses:', error);
            }
        };
        loadExpenses();
    }, []);

    useEffect(() => {
        const saveExpenses = async () => {
            try {
                await AsyncStorage.setItem('dailyExpenses', JSON.stringify(dailyExpenses));
            } catch (error) {
                console.error('Failed to save expenses:', error);
            }
        };
        saveExpenses();
    }, [dailyExpenses]);

    useEffect(() => {
        const loadCustomCategories = async () => {
            try {
                const storedCategories = await AsyncStorage.getItem('categories');
                if (storedCategories) {
                    setCustomCategories(JSON.parse(storedCategories));
                }
            } catch (error) {
                console.error('Failed to load custom categories:', error);
            }
        };
        loadCustomCategories();
    }, []);
    

    const handleAddCategory = async (label, icon) => {
        const newCategory = { label, icon };
        const updatedCategories = [newCategory, ...customCategories];

        setCustomCategories(updatedCategories);
        setSelectedCategory(newCategory);

        try {
            await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
        } catch (error) {
            console.error('Failed to save custom categories:', error);
        }
    };

    const combinedCategories = [...customCategories, ...categoryOptions].reduce((acc, current) => {
        const x = acc.find(item => item.label === current.label);
        if (!x) {
            return acc.concat([current]);
        } else {
            return acc;
        }
    }, []);

    const filteredExpenseListData = getExpenseListData().filter(item =>
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.category.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Expenses</Text>

            {/* Toggle View Buttons */}
            <View style={styles.toggleContainer}>
                {['weekly', 'monthly', 'yearly'].map((mode) => (
                    <TouchableOpacity
                        key={mode}
                        style={viewMode === mode ? styles.selectedToggle : styles.toggle}
                        onPress={() => setViewMode(mode)}
                    >
                        <Text style={viewMode === mode ? styles.selectedToggleText : styles.toggleText}>
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Weekly Bar Chart */}
{viewMode === 'weekly' && (
    <View style={styles.chartContainer}>
        <Text style={styles.amount}>₱{getTotalExpenses().toLocaleString()}</Text>
        <View style={styles.barChart}>
            {getCurrentWeekDates().map(({ date, key }, index) => {
                const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
                const dailyTotal = Number(dailyExpenses?.[key]?.total) || 0;
                const height = dailyTotal ? (60 * dailyTotal / maxTotal) : 10; // Ensuring minimum height

                return (
                    <View key={key} style={styles.barItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('DailyExpenses', { date: key, expenses: dailyExpenses?.[key]?.categories || [] })}>
                            <View style={[styles.bar, { height, backgroundColor: key === todayKey ? 'orange' : '#ccc' }]} />
                            <Text style={styles.day}>{dayName}</Text>
                        </TouchableOpacity>
                    </View>
                );
            })}
        </View>
    </View>
)}

{/* Monthly Bar Chart */}
{viewMode === 'monthly' && (
    <View style={styles.chartContainer}>
        <Text style={styles.amount}>₱{getTotalExpenses().toLocaleString()}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.barChart}>
                {MONTHS.map((month, index) => {
                    const monthTotal = Number(monthlyData?.[month]?.total) || 0;
                    const height = monthTotal > 0 ? Math.max(10, (60 * monthTotal / maxTotal)) : 10; // Ensuring minimum height

                    return (
                        <View key={month} style={styles.barItemMonth}>
                            <TouchableOpacity
                                style={styles.monthBarTouchable}
                                onPress={() => setSelectedMonth(index)}
                            >
                                <View
                                    style={[
                                        styles.bar,
                                        { height, backgroundColor: index === new Date().getMonth() ? 'orange' : '#ccc', opacity: monthTotal > 0 ? 1 : 0.3 }
                                    ]}
                                />
                                <Text style={[styles.month, index === new Date().getMonth() ? styles.currentMonth : {}]}>
                                    {month.substring(0, 3)}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    </View>
)}

{/* Yearly Bar Chart */}
{viewMode === 'yearly' && (
    <View style={styles.chartContainer}>
        <Text style={styles.amount}>₱{getTotalExpenses().toLocaleString()}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.barChart}>
                {YEARS.map((year) => {
                    const yearTotal = Number(yearlyData?.[year]?.total) || 0;
                    const height = yearTotal > 0 ? Math.max(10, (60 * yearTotal / maxTotal)) : 10; // Ensuring minimum height

                    return (
                        <View key={year} style={styles.barItemYear}>
                            <TouchableOpacity
                                style={styles.yearBarTouchable}
                                onPress={() => setSelectedYear(year)}
                            >
                                <View
                                    style={[
                                        styles.bar,
                                        { height, backgroundColor: year === selectedYear ? 'orange' : '#ccc', opacity: yearTotal > 0 ? 1 : 0.3 }
                                    ]}
                                />
                                <Text style={[styles.year, year === selectedYear ? styles.selectedYear : {}]}>{year}</Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    </View>
)}



            {/* Search Container */}
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Search"
                    style={styles.searchInput}
                    value={searchText}
                    onChangeText={setSearchText}
                />
                <TouchableOpacity onPress={() => console.log('Searching for:', searchText)}>
                    <Ionicons name="search" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Expense List Header
            <View style={styles.listHeaderContainer}>
                <Text style={styles.listHeaderTitle}>
                    {viewMode === 'weekly'
                        ? 'This Week\'s Expenses'
                        : viewMode === 'monthly'
                            ? `${MONTHS[selectedMonth]} Expenses`
                            : `${selectedYear} Expenses`}
                </Text>
            </View> */}

            {/* Expense List */}
<FlatList
    data={filteredExpenseListData}
    keyExtractor={(item, index) => index.toString()}
    ListEmptyComponent={
        <View style={styles.emptyListContainer}>
            <Ionicons name="receipt-outline" size={60} color="#ccc" />
            <Text style={styles.emptyListText}>
                No expenses recorded for this {viewMode === 'weekly' ? 'week' : viewMode === 'monthly' ? 'month' : 'year'}
            </Text>
        </View>
    }
    renderItem={({ item }) => (
        <TouchableOpacity
            style={styles.expenseItem}
            onPress={() =>
                navigation.navigate('ExpenseDetails', { expense: item, deleteExpense: deleteExpense })
            }
        >
            <Ionicons name={item?.icon || 'help-circle'} size={30} color="black" />
            <View style={styles.itemInfo}>
                <Text style={styles.category}>{item?.category || 'Expense'}</Text>
                <Text style={styles.sub}>{item?.title || ''}</Text>
                <Text style={styles.dateText}>{item?.formattedDate || ''}</Text>
            </View>
            <Text style={styles.amountRed}>{item?.amount || '-₱0'}</Text>
        </TouchableOpacity>
    )}
    contentContainerStyle={{ paddingBottom: 80 }} // Add padding to ensure the list doesn't go under the BottomNav
/>

{/* Bottom Navigation Bar */}
<View style={styles.bottomNav}>
    <TouchableOpacity style={styles.touchableStyle} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home" size={24} />
        <Text style={styles.navText}>Home</Text>
    </TouchableOpacity>
    <TouchableOpacity style={[styles.touchableStyle]} onPress={() => navigation.navigate('Expenses')}>
        <Ionicons name="receipt-outline" size={24} color="#FDAA61" />
        <Text style={styles.navTextActive}>Expenses</Text>
    </TouchableOpacity>
    <TouchableOpacity style={[styles.addButton, styles.touchableStyle]} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={30} color="white" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.touchableStyle} onPress={() => navigation.navigate('Savings')}>
        <Ionicons name="wallet" size={24} color="gray" />
        <Text style={styles.navText}>Savings</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.touchableStyle} onPress={() => navigation.navigate('Reminder')}>
        <Ionicons name="notifications" size={24} color="gray" />
        <Text style={styles.navText}>Reminder</Text>
    </TouchableOpacity>
</View>


            {/* Modal for Budget */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalContainer}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Choose Category</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
                            {combinedCategories.map((item) => (
                                <TouchableOpacity
                                    key={item.label}
                                    style={[styles.categoryButton, selectedCategory.label === item.label && styles.selectedCategoryButton]}
                                    onPress={() => {
                                        if (item.label === 'Others') {
                                            setCustomCategoryModalVisible(true);
                                        } else {
                                            setSelectedCategory(item);
                                        }
                                    }}
                                >
                                    <Ionicons name={item.icon} size={30} color="black" />
                                    <Text style={styles.categoryText}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <TextInput
                            placeholder="Title"
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                        />
                        <TextInput
                            placeholder="Amount"
                            style={styles.input}
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />

                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                            <Text style={styles.dateText}>
                                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                onChange={onChangeDate}
                            />
                        )}

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.scanButton} onPress={handleScanPress}>
                                <Ionicons name="qr-code" size={20} color="white" style={styles.icon} />
                                <Text style={styles.scanButtonText}>Scan</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.addButtonModal} onPress={handleAddExpense}>
                                <Ionicons name="add" size={20} color="white" style={styles.icon} />
                                <Text style={styles.addButtonText}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Custom Category Modal */}
            <CustomCategoryModal
                visible={customCategoryModalVisible}
                onClose={() => setCustomCategoryModalVisible(false)}
                onAddCategory={handleAddCategory}
            />
        </View>
    );
};

export default ExpensesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fdf5e6",
        paddingTop: Platform.OS === 'android' ? 60 : 0,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 15,
    },
    toggleContainer: {
        flexDirection: "row",
        marginVertical: 10,
        marginHorizontal: "auto",
        backgroundColor: "white",
        width: "100%",
        justifyContent: "space-evenly",
    },
    toggle: {
        padding: 10,
        marginRight: 5,
    },
    selectedToggle: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: "#FDAA61",
        borderRadius: 8,
        height: 30,
        marginVertical: "auto",
    },
    toggleText: {
        color: "#777",
    },
    selectedToggleText: {
        fontWeight: "bold",
        color: "#000",
    },
    chartContainer: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 15,
        marginBottom: 20,
    },
    chartLabelContainer: {
        alignItems: 'center',
        marginVertical: 5,
    },
    chartLabel: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    amount: {
        fontSize: 24,
        fontWeight: "bold",
    },
    barChart: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "flex-end",
        marginTop: 10,
        minHeight: 100,
    },
    barItem: {
        justifyContent: "center",
        alignItems: "center",
        width: 25,
    },
    barItemMonth: {
        alignItems: "center",
        width: 35,
        marginHorizontal: 5,
    },
    barItemYear: {
        alignItems: "center",
        width: 35,
        marginHorizontal: 5,
    },
    bar: {
        width: 25,
        borderRadius: 5,
        minHeight: 0,
    },
    day: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: 5,
    },
    month: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: 5,
    },
    year: {
        textAlign: 'center',
        fontSize: 10,
        marginTop: 5,
    },
    miniAmount: {
        fontSize: 9,
        color: '#666',
        marginTop: 2,
    },
    listHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    listHeaderTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginVertical: 5,
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        marginRight: 10,
    },
    expenseItem: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        alignItems: 'center',
    },
    itemInfo: {
        flex: 1,
        marginLeft: 15,
    },
    category: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    sub: {
        fontSize: 14,
        color: '#777',
        marginTop: 2,
    },
    dateText: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    amountRed: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'red',
        marginRight: 10,
    },
    emptyListContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        padding: 20,
    },
    emptyListText: {
        fontSize: 16,
        color: '#999',
        marginTop: 10,
        textAlign: 'center',
    },
    bottomNav: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#FFF",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 5,
        shadowColor: "#000",
        alignItems: "center",
    },
    addButton: {
        width: 65,
        height: 65,
        backgroundColor: "orange",
        borderRadius: 32.5,
        justifyContent: "center",
        alignItems: "center",
        marginTop: -50,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    touchableStyle: {
        alignItems: "center",
        justifyContent: "center",
    },
    navText: {
        fontSize: 12,
        color: "gray",
        marginTop: 5,
        textAlign: "center",
    },
    navTextActive: {
        fontSize: 12,
        color: "orange",
        marginTop: 5,
        textAlign: "center",
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    categoryList: {
        flexDirection: 'row',
        paddingVertical: 10,
    },
    categoryButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        padding: 10,
    },
    selectedCategoryButton: {
        backgroundColor: '#FDAA61',
    },
    categoryText: {
        marginTop: 5,
        fontSize: 12,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginVertical: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    scanButton: {
        backgroundColor: '#888',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginRight: 10,
    },
    addButtonModal: {
        backgroundColor: '#FDAA61',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginLeft: 10,
    },
    scanButtonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    icon: {
        marginRight: 5,
    },
});
