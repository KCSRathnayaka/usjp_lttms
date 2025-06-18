import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router, Stack, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'; // Import useState, useRef, useCallback, and useEffect hooks
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
const OtherDay = () => {


    const { day } = useLocalSearchParams();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current; // Initial position off-screen
    const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
    const [lastUpdateTime, setLastUpdateTime] = useState(''); // State for last update time

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


    const [lectures, setLectures] = useState([]);
    const [lecturesLoading, setLecturesLoading] = useState(false);

    const navigation = useNavigation();
    const fetchByDays = async () => {

        if (day == null || day == '') {


            return;
        }

        if (userCourse == null || userCourse == '') {


            return;
        }


        if (userSemester == null || userSemester == '') {


            return;
        }
        setLecturesLoading(true);

        try {

            const response = await axios.get(`${API_URL}/api/timetables/fetch/by-days`, {
                params: {
                    course: userCourse?.id ?? null,
                    semester: userSemester ?? null,
                    specialization_area: userSpeciaLizationArea?.id ?? null,
                    day: day

                }
            });

            //   console.log(response);
            if (response.status === 200) {
                if (response.data.status) {
                    console.log(response.data.data);
                    setLectures(response.data.data);

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

        setLecturesLoading(false);
    }



    useEffect(() => {

        fetchByDays();
    }, [day, userCourse, userSemester, userSpeciaLizationArea]);
    const usjpLogoUrl = "https://www.sjp.ac.lk/wp-content/uploads/2020/10/usjp-logo.png";

    useLayoutEffect(() => {
        // Set screen options for the current screen
        navigation.setOptions({
            title: "Lectures for " + day, // Set the title dynamically
            headerTitleAlign: 'center',
            headerBackground: () => (

                <ImageBackground source={{ uri: usjpLogoUrl }} style={styles.headerBackground} imageStyle={styles.headerImageStyle}>
                    {/* Overlay for better text readability */}
                    <View style={styles.headerOverlay}>



                    </View>
                </ImageBackground>
            ),
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
        });
    }, [day]); // Re-run effect if customTitle changes

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} backgroundColor="#2c3e50" />

            {/* Main content area */}
            <View style={[styles.mainContentArea, { marginTop: 15 }]}>

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
                    {

                        lecturesLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#3498db" />
                            </View>
                        ) :

                            (lectures.length > 0 ? (
                                <View style={styles.upcomingLecturesContainer}>
                                    {lectures.map(lecture => (
                                        <LectureCard key={lecture.id} isCurrent={false} lecture={lecture} />
                                    ))}
                                </View>
                            ) : (
                                <View style={styles.noLectureCard}>
                                    <Text style={styles.noLectureText}>
                                        No lectures found {day}.
                                    </Text>
                                </View>
                            ))

                    }

                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

// StyleSheet.create is used for defining styles in React Native.

export default OtherDay;
