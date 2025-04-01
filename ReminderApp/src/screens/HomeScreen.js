import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
const HomeScreen = ({ navigation }) => {
    const [reminders, setReminders] = useState([]);
    const isFocused = useIsFocused();

    //load reminders from AsyncStorage
    useEffect(() => {
        if (isFocused) {
            loadReminders();
        }
    }, [isFocused]);

    const loadReminders = async () => {
        try {
            const stored = await AsyncStorage.getItem('reminders');
            if (stored) setReminders(JSON.parse(stored));
        } catch (e) {
            console.error('Failed to load reminders', e);
        }
    };

    const saveReminders = async (data) => {
        try {
            await AsyncStorage.setItem('reminders', JSON.stringify(data));
            setReminders(data);
        } catch (e) {
            console.error('Failed to save reminders', e);
        }
    };

    const deleteReminder = (id) => {
        Alert.alert('Delete Reminder', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                    const updated = reminders.filter(r => r.id !== id);
                    saveReminders(updated);
                }
            }
        ]);
    };

    const renderReminder = ({ item }) => (
        <View style={styles.reminderItem}>
            <Text style={styles.reminderText}>{item.text}</Text>
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('SetReminder', { id: item.id })}>
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteReminder(item.id)}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reminders</Text>

            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('SetReminder')}>
                <Text style={styles.buttonText}>+ Set Reminder 🔔</Text>
            </TouchableOpacity>

            {reminders.length === 0 ? (
                <Text style={styles.noReminder}>No reminders set.</Text>
            ) : (
                <FlatList
                    data={reminders}
                    renderItem={renderReminder}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    addButton: {
        backgroundColor: '#4a90e2',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: { color: 'white', fontWeight: 'bold' },
    noReminder: { fontSize: 18, color: 'gray', textAlign: 'center', marginTop: 50 },
    list: { paddingBottom: 20 },
    reminderItem: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    reminderText: { fontSize: 16, marginBottom: 10 },
    buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
    editButton: { backgroundColor: '#ffa500', padding: 8, borderRadius: 8, marginRight: 10 },
    deleteButton: { backgroundColor: '#ff4d4d', padding: 8, borderRadius: 8 },
});

export default HomeScreen;
