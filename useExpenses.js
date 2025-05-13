import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Default categories with icons
const defaultCategories = [
  { label: 'Food', icon: 'fast-food' },
  { label: 'Utilities', icon: 'flash' },
  { label: 'School', icon: 'school' },
  { label: 'Internet', icon: 'wifi' },
  { label: 'Health', icon: 'heart' },
  { label: 'Others', icon: 'help-circle' },
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const useExpenses = () => {
  const [dailyExpenses, setDailyExpenses] = useState({});
  const [categories, setCategories] = useState(defaultCategories);

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
    const loadCategories = async () => {
      try {
        const storedCategories = await AsyncStorage.getItem('categories');
        if (storedCategories) {
          setCategories(JSON.parse(storedCategories));
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const saveCategories = async () => {
      try {
        await AsyncStorage.setItem('categories', JSON.stringify(categories));
      } catch (error) {
        console.error('Failed to save categories:', error);
      }
    };
    saveCategories();
  }, [categories]);

  const addExpense = (newAmount, selectedCategory, title, date) => {
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
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
              date: formattedDate,
            }
          ]
        }
      };
      return newExpenses;
    });
  };

  const addCustomCategory = (label, icon) => {
    setCategories(prevCategories => [
      { label, icon },
      ...prevCategories.filter(cat => cat.label !== 'Others'),
      prevCategories.find(cat => cat.label === 'Others')
    ]);
  };

  return {
    dailyExpenses,
    setDailyExpenses,
    categories,
    addExpense,
    addCustomCategory,
  };
};

export default useExpenses;
