import React, { useState, useRef, useCallback, useEffect } from 'react'; // Import useState, useRef, useCallback, and useEffect hooks
import { StyleSheet, Text, View, SafeAreaView, StatusBar, Platform, ImageBackground, ScrollView, TouchableOpacity, Animated, Dimensions, RefreshControl } from 'react-native'; // Import RefreshControl
import LectureCard from '../components/LectureCard';
import styles from './homeStyles';
// Get screen width for sidebar animation
const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.7; // Sidebar takes 70% of screen width

// Mock data to simulate lecture information, now including a 'day' property.
const MOCK_LECTURES = [
    { id: '1', subject: 'Software Engineering', time: '10:00 AM - 11:00 AM', venue: 'Lab 1', lecturer: 'Dr. A. Perera', isCurrent: true, day: 'Monday' },
    { id: '2', subject: 'Data Structures & Algorithms', time: '11:30 AM - 12:30 PM', venue: 'Lecture Hall B', lecturer: 'Prof. S. Gunawardena', isCurrent: false, day: 'Monday' },
    { id: '3', subject: 'Operating Systems', time: '01:00 PM - 02:00 PM', venue: 'Lecture Hall A', lecturer: 'Ms. K. Dias', isCurrent: false, day: 'Tuesday' },
    { id: '4', subject: 'Database Management', time: '02:30 PM - 03:30 PM', venue: 'Lab 2', lecturer: 'Dr. C. Silva', isCurrent: false, day: 'Wednesday' },
    { id: '5', subject: 'Computer Networks', time: '04:00 PM - 05:00 PM', venue: 'Lecture Hall C', lecturer: 'Mr. N. Fernando', isCurrent: false, day: 'Thursday' },
    { id: '6', subject: 'Artificial Intelligence', time: '09:00 AM - 10:00 AM', venue: 'Lab 3', lecturer: 'Dr. M. Samaraweera', isCurrent: false, day: 'Friday' },
    { id: '7', subject: 'Mobile Application Dev', time: '09:00 AM - 10:00 AM', venue: 'Lab 4', lecturer: 'Dr. P. Siriwardana', isCurrent: false, day: 'Monday' },
    { id: '8', subject: 'Cloud Computing', time: '01:00 PM - 02:00 PM', venue: 'Lecture Hall D', lecturer: 'Prof. J. Silva', isCurrent: false, day: 'Tuesday' },
];

// Header component with a background image (USJP logo) and a menu icon.
const Header = ({ onMenuPress }) => {
    const usjpLogoUrl = "https://www.sjp.ac.lk/wp-content/uploads/2020/10/usjp-logo.png";

    return (
        <ImageBackground
            source={{ uri: usjpLogoUrl }} // Use { uri: ... } for network images, or require('./path/to/image.png') for local assets
            style={styles.headerBackground}
            imageStyle={styles.headerImageStyle}
        >
            {/* Overlay for better text readability */}
            <View style={styles.headerOverlay}>
                {/* Menu Icon */}
                <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    Lecture Timetable
                </Text>
            </View>
        </ImageBackground>
    );
};

// LectureCard component for displaying individual lecture details.


// Sidebar component to display weekdays and allow selection.
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Sidebar = ({ selectedDay, onSelectDay, onClose }) => (
    <View style={styles.sidebar}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.sidebarTitle}>Days</Text>
        <ScrollView contentContainerStyle={styles.sidebarScrollView}>
            {weekdays.map(day => (
                <TouchableOpacity
                    key={day}
                    style={[
                        styles.sidebarItem,
                        selectedDay === day && styles.sidebarItemSelected
                    ]}
                    onPress={() => {
                        onSelectDay(day);
                        onClose(); // Close sidebar after selecting a day
                    }}
                >
                    <Text style={[
                        styles.sidebarItemText,
                        selectedDay === day && styles.sidebarItemTextSelected
                    ]}>
                        {day}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    </View>
);


// Main App component that renders the entire home page.
const App = () => {
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current; // Initial position off-screen
    const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
    const [lastUpdateTime, setLastUpdateTime] = useState(''); // State for last update time
    const today = new Date(); // Creates a new Date object representing the current date and time
    const options = { weekday: 'long' }; // Specifies that we want the full weekday name

    const todayAsString = today.toLocaleDateString('en-US', options); // Formats the date to a string, e.g., "Monday"

    // Function to format the current time for display
    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${date.toLocaleDateString()} ${hours}:${minutes}:${seconds}`;
    };

    // Set initial update time when component mounts
    useEffect(() => {
        setLastUpdateTime(formatTime(new Date()));
    }, []);

    // Function to handle pull-to-refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // Simulate fetching new data or updating state
        setTimeout(() => {
            setLastUpdateTime(formatTime(new Date())); // Update last update time
            setRefreshing(false); // End refreshing
        }, 1500); // Simulate network request delay
    }, []);

    // Function to toggle sidebar visibility
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        Animated.timing(sidebarAnim, {
            toValue: isSidebarOpen ? -SIDEBAR_WIDTH : 0, // Slide out or slide in
            duration: 300,
            useNativeDriver: true, // Use native driver for smoother animation
        }).start();
    };

    // Filter lectures based on the selected day
    const filteredLectures = MOCK_LECTURES.filter(lecture => lecture.day === selectedDay);

    // Find the current lecture for the selected day (if any)
    // Note: 'isCurrent' in MOCK_LECTURES is static. For real-time 'current',
    // you'd compare lecture time with current time.
    const currentLecture = filteredLectures.find(lecture => lecture.isCurrent);

    // Filter upcoming lectures for the selected day
    const upcomingLectures = filteredLectures.filter(lecture => !currentLecture || !lecture.isCurrent); // Exclude current lecture from upcoming

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} backgroundColor="#2c3e50" />

            {/* Main content area */}
            <View style={styles.mainContentArea}>
                <Header onMenuPress={toggleSidebar} />

                {/* Display Last Update Time */}
                <View style={styles.lastUpdateContainer}>
                    <Text style={[styles.lastUpdateText, { fontWeight: 'bold' }]}>Last Updated: {lastUpdateTime}</Text>
                </View>

                <ScrollView
                    contentContainerStyle={styles.mainScrollViewContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#3498db" // Color of the refresh indicator
                            title="Refreshing..." // Text displayed next to the indicator (Android only)
                            titleColor="#3498db"
                        />
                    }
                >
                    <View style={{ marginBottom: 10 }}>

                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{selectedDay === todayAsString ? `Today` : `${selectedDay}`}</Text>

                    </View>
                    {/* Current Lecture Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Current Lecture
                        </Text>
                        {currentLecture ? (
                            <LectureCard {...currentLecture} />
                        ) : (
                            <View style={styles.noLectureCard}>
                                <Text style={styles.noLectureText}>
                                    No lecture currently in progress for {selectedDay}.
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Upcoming Lectures Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Upcoming Lectures
                        </Text>
                        {upcomingLectures.length > 0 ? (
                            <View style={styles.upcomingLecturesContainer}>
                                {upcomingLectures.map(lecture => (
                                    <LectureCard key={lecture.id} {...lecture} />
                                ))}
                            </View>
                        ) : (
                            <View style={styles.noLectureCard}>
                                <Text style={styles.noLectureText}>
                                    No upcoming lectures scheduled for {selectedDay}.
                                </Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>

            {/* Sidebar Overlay and Sidebar */}
            {isSidebarOpen && (
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1} // Prevents opacity change on press
                    onPress={toggleSidebar} // Close sidebar when backdrop is pressed
                />
            )}
            <Animated.View style={[styles.animatedSidebar, { transform: [{ translateX: sidebarAnim }] }]}>
                <Sidebar selectedDay={selectedDay} onSelectDay={setSelectedDay} onClose={toggleSidebar} />
            </Animated.View>
        </SafeAreaView>
    );
};

// StyleSheet.create is used for defining styles in React Native.

export default App;
