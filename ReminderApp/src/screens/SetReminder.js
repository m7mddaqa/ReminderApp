import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Platform, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import uuid from 'react-native-uuid';
import * as Notifications from 'expo-notifications';

export default function SetReminder({ navigation }) {
    const [text, setText] = useState('');
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const saveReminder = async () => {
        try {
            const id = uuid.v4();
            const stored = await AsyncStorage.getItem('reminders');
            const reminders = stored ? JSON.parse(stored) : [];

            const newReminder = { id, text, date: date.toISOString() };
            const updated = [...reminders, newReminder];
            await AsyncStorage.setItem('reminders', JSON.stringify(updated));

            scheduleNotification(text, date);

            navigation.goBack();
        } catch (e) {
            console.error('Error saving reminder:', e);
        }
    };

    const scheduleNotification = async (body, dateTime) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: '⏰ Reminder',
                body,
            },
            trigger: dateTime,
        });
    };

    const onChange = (event, selectedDate) => {
        setShowPicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Enter reminder..."
                value={text}
                onChangeText={setText}
                style={styles.input}
            />

            <Button title="Pick Date & Time" onPress={() => setShowPicker(true)} />
            {showPicker && (
                <DateTimePicker
                    value={date}
                    mode="datetime"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={onChange}
                />
            )}
            <Text style={{ marginTop: 10 }}>Selected: {date.toLocaleString()}</Text>

            <Button title="Save Reminder" onPress={saveReminder} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    input: {
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        borderRadius: 6,
    },
});
