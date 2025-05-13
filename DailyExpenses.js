import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DailyExpensesScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { date, expenses } = route.params;

    const totalAmount = expenses.reduce((total, item) => total + item.amount, 0);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Expenses for Today!</Text>
            <Text style={styles.date}>{date}</Text>
            <Text style={styles.totalAmount}>Total: ₱{totalAmount.toFixed(2)}</Text>

            <FlatList
                data={expenses}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.expenseItem}>
                        <Ionicons name={item.icon} size={30} color="black" />
                        <View style={styles.itemInfo}>
                            <Text style={styles.category}>{item.category}</Text>
                            <Text style={styles.sub}>{item.title}</Text>
                        </View>
                        <Text style={styles.amountRed}>₱{item.amount.toFixed(2)}</Text>
                    </View>
                )}
            />

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
        </View>
    );
};

export default DailyExpensesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fdf5e6',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
        marginTop: 15,
    },
    date: {
        fontSize: 18,
        fontWeight: 'normal',
        marginBottom: 10,
        textAlign: 'center',
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    expenseItem: {
        backgroundColor: 'white',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginBottom: 10,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 10,
    },
    category: {
        fontWeight: 'bold',
    },
    sub: {
        color: '#888',
    },
    amountRed: {
        color: 'red',
        fontWeight: 'bold',
    },
    backButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: 'orange',
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 40,
    },
    backButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
