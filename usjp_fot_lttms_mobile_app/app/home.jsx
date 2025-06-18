import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react'; // Import useState, useRef, useCallback, and useEffect hooks
import { ActivityIndicator, Animated, Dimensions, ImageBackground, Platform, RefreshControl, SafeAreaView, ScrollView, StatusBar, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'; // Import RefreshControl
import LectureCard from '../components/LectureCard';
import SideBar from '../components/SideBar';
import API_URL from '../utils/API_URL';
import styles from './homeStyles';
// Get screen width for sidebar animation
const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = 260; // Sidebar takes 70% of screen width

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

    useEffect(() => {
        // Function to get the current day of the week as a string
        const getCurrentDayName = () => {
            const days = [
                'Sunday',    // getDay() returns 0 for Sunday
                'Monday',    // getDay() returns 1 for Monday
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday'
            ];
            const date = new Date();
            const dayIndex = date.getDay(); // getDay() returns 0 (Sunday) to 6 (Saturday)
            return days[dayIndex];
        };

        // Set the selectedDay state to the current day when the component mounts
        setSelectedDay(getCurrentDayName());

        // You could also fetch courses here if they depend on the current day
        // fetchCourses(); // If fetchCourses uses selectedDay

    }, []); // The empty dependency array ensures this effect runs only once after the initial render

    const [upcommingLectures, setUpcommingLectures] = useState([]);


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

        fetchCurrentLecture();
        fetchUpcommingLecture();
        setLastUpdateTime(formatTime(new Date())); // Update last update time
        setRefreshing(false); // End refreshing

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



    const [currentLectureLoading, setCurrentLectureLoading] = useState(false);
    const [upcommingLectureLoading, setUpcommingLectureLoading] = useState(false);

    const [userCourse, setUserCourse] = useState(null);
    const [userSemester, setUserSemester] = useState(null);
    const [userSpeciaLizationArea, setUserSpecializationArea] = useState(null);

    const navigator = useNavigation();
    useEffect(() => {

        const checkConfig = async () => {
            const config = await AsyncStorage.getItem('configData');
            if (!config) {

                navigator.navigate('config');
                return;
            } else {

                const parsedConfig = JSON.parse(config);
                setUserCourse(parsedConfig.course);
                setUserSemester(parsedConfig.study_semester);
                setUserSpecializationArea(parsedConfig.specialization_area);

                // console.log('Config Data:', parsedConfig);
            }
        }

        checkConfig();

    }, []);
    const [currentLecture, setCurrentLecture] = useState(null);


    const fetchCurrentLecture = async () => {



        //console.log(selectedDay);

        if (selectedDay == null || selectedDay == '') {

            //  ToastAndroid.show('Please select a day', ToastAndroid.LONG);
            return;
        }

        if (userCourse == null || userCourse == '') {

            //ToastAndroid.show('Please select a course', ToastAndroid.LONG);
            return;
        }


        if (userSemester == null || userSemester == '') {

            // ToastAndroid.show('Please select a semester', ToastAndroid.LONG);
            return;
        }
        setCurrentLectureLoading(true);

        try {

            const response = await axios.get(`${API_URL}/api/timetables/fetch/current`, {
                params: {
                    course: userCourse?.id ?? null,
                    semester: userSemester,
                    specialization_area: userSpeciaLizationArea?.id ?? null,
                    day: selectedDay

                }
            });

            //   console.log(response);
            if (response.status === 200) {
                if (response.data.status) {
                    console.log(response.data.data);
                    setCurrentLecture(response.data.data);

                } else {
                    ToastAndroid.show('Something went wrong', ToastAndroid.LONG);
                }


            } else {

                ToastAndroid.show('Something went wrong', ToastAndroid.LONG);
            }



        } catch (error) {
            console.error('Error fetching lectures:', error);

            ToastAndroid.show('Something went wrong', ToastAndroid.LONG);
        }

        setCurrentLectureLoading(false);
    }



    const fetchUpcommingLecture = async () => {




        if (selectedDay == null || selectedDay == '') {

            // ToastAndroid.show('Please select a day', ToastAndroid.LONG);
            return;
        }

        if (userCourse == null || userCourse == '') {

            // ToastAndroid.show('Please select a course', ToastAndroid.LONG);
            return;
        }


        if (userSemester == null || userSemester == '') {

            //ToastAndroid.show('Please select a semester', ToastAndroid.LONG);
            return;
        }
        setUpcommingLectureLoading(true);

        try {

            const response = await axios.get(`${API_URL}/api/timetables/fetch/upcomming`, {
                params: {
                    course: userCourse?.id ?? null,
                    semester: userSemester ?? null,
                    specialization_area: userSpeciaLizationArea?.id ?? null,
                    day: selectedDay

                }
            });

            //   console.log(response);
            if (response.status === 200) {
                if (response.data.status) {
                    console.log(response.data.data);
                    setUpcommingLectures(response.data.data);

                } else {
                    ToastAndroid.show('Something went wrong', ToastAndroid.LONG);
                }


            } else {

                ToastAndroid.show('Something went wrong', ToastAndroid.LONG);
            }



        } catch (error) {
            console.error('Error fetching lectures:', error);

            ToastAndroid.show('Something went wrong', ToastAndroid.LONG);
        }

        setUpcommingLectureLoading(false);
    }

    useEffect(() => {
        fetchCurrentLecture();
        fetchUpcommingLecture();
    }, [selectedDay, userCourse, userSemester, userSpeciaLizationArea]);

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
                        {
                            currentLectureLoading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#3498db" />
                                </View>
                            ) : (
                                currentLecture ? (
                                    <LectureCard lecture={currentLecture} isCurrent={true} />
                                ) : (
                                    <View style={styles.noLectureCard}>
                                        <Text style={styles.noLectureText}>
                                            No lecture currently in progress for {selectedDay}.
                                        </Text>
                                    </View>
                                )
                            )
                        }


                    </View>

                    {/* Upcoming Lectures Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Upcoming Lectures
                        </Text>
                        {

                            upcommingLectureLoading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#3498db" />
                                </View>
                            ) :

                                (upcommingLectures.length > 0 ? (
                                    <View style={styles.upcomingLecturesContainer}>
                                        {upcommingLectures.map(lecture => (
                                            <LectureCard key={lecture.id} isCurrent={false} lecture={lecture} />
                                        ))}
                                    </View>
                                ) : (
                                    <View style={styles.noLectureCard}>
                                        <Text style={styles.noLectureText}>
                                            No upcoming lectures scheduled for {selectedDay}.
                                        </Text>
                                    </View>
                                ))


                        }
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
                <SideBar selectedDay={selectedDay} onSelectDay={setSelectedDay} onClose={toggleSidebar} />
            </Animated.View>
        </SafeAreaView>
    );
};

// StyleSheet.create is used for defining styles in React Native.

export default App;
