import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, ToastAndroid } from 'react-native';
import {
    Appbar,
    TextInput,
    Button,
    Headline,
    Subheading,
    Portal,
    Dialog,
    Paragraph,
    ActivityIndicator,
    Colors,
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Add this import
import API_URL from '../utils/API_URL';
import axios from 'axios';
import { useNavigation } from 'expo-router';



const semesterOptions = [
    { label: 'Select Current Semester', value: '' }, // Placeholder
    { label: 'First Semester', value: '1' },
    { label: 'Second Semester', value: '2' },
    { label: 'Third Semester', value: '3' },
    { label: 'Fourth Semester', value: '4' },
    { label: 'Fifth Semester', value: '5' },
    { label: 'Sixth Semester', value: '6' },
    { label: 'Seventh Semester', value: '7' },
    { label: 'Eight Semester', value: '8' },
];

const config = () => {
    const [indexNumber, setIndexNumber] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedSpecializationArea, setSelectedSpecializationArea] = useState('');
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    // State to hold validation errors for each field
    const [indexNumberError, setIndexNumberError] = useState('');
    const [courseError, setCourseError] = useState('');
    const [specializationError, setspecializationError] = useState('');
    const [semesterError, setSemesterError] = useState('');

    const showDialog = (message) => {
        setDialogMessage(message);
        setDialogVisible(true);
    };

    const hideDialog = () => {
        setDialogVisible(false);
    };

    // Validation function adapted from your Flutter code
    const validateFields = () => {
        let isValid = true;

        // Reset previous errors
        setIndexNumberError('');
        setCourseError('');
        setspecializationError('');
        setSemesterError('');

        // Index Number Validation
        // const indexPattern = new RegExp(/^[A-Z]{3}\/\d{2}\/\d{3}$/);
        // if (!indexNumber.trim()) {
        //     setIndexNumberError('Please enter your Index Number.');
        //     isValid = false;
        // } else if (!indexPattern.test(indexNumber.trim())) {
        //     setIndexNumberError('Invalid index number format. Use XXX/XX/XXX (e.g., ICT/22/800).');
        //     isValid = false;
        // }

        // Course Validation
        if (!selectedCourse) {
            setCourseError('Please select your Course.');
            isValid = false;
        }



        // Semester Validation
        if (!selectedSemester) {
            setSemesterError('Please select your Current Semester.');
            isValid = false;
        }

        return isValid;
    };


    const navigation = useNavigation();
    const handleRegister = async () => {
        if (!validateFields()) {
            return;
        }

        setLoading(true);
        try {


            const configData = {
                indexNumber: indexNumber.trim(), // Save trimmed value
                course: selectedCourse,
                study_semester: selectedSemester,
                specialization_area: selectedSpecializationArea

            };

            console.log('Registering with:', configData);

            await AsyncStorage.setItem('configData', JSON.stringify(configData));

            ToastAndroid.show('Registration successful!', ToastAndroid.SHORT);
            navigation.navigate('home');
        } catch (error) {
            console.error('Registration error:', error);
            showDialog('Registration failed. Please try again later.');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {

        if (selectedCourse && selectedSemester) {

            if (Number(selectedCourse.specialization_selection_year) * 2 <= Number(selectedSemester)) {
                // console.log('true');
                setSpecializationAreaShow(true);
            } else {
                setSelectedSpecializationArea(null);
                //console.log('false');
                setSpecializationAreaShow(false);
            }


        }




    }, [selectedCourse, selectedSemester]);



    const [courses, setCourses] = useState([]);// Inside fetchCourses
    const fetchCourses = async () => {
        try { // <--- Add a try-catch block here!

            const response = await axios.get(`${API_URL}/api/courses/fetch`);

            if (response.status === 200) {
                if (response.data.status) {

                    setCourses(response.data.data);

                } else {

                    ToastAndroid.show(`Failed to fetch courses `, ToastAndroid.SHORT);
                }
            } else {
                ToastAndroid.show(`Failed to fetch courses `, ToastAndroid.SHORT);
            }
        } catch (error) {
            ToastAndroid.show('Network error: No response from server. Check URL and connectivity.', ToastAndroid.LONG);
        }
    };



    useEffect(() => {
        fetchCourses();
    }, []);


    useEffect(() => {
        const updateConfigInformation = async () => {
            try {
                const configData = await AsyncStorage.getItem('configData');
                if (configData) {
                    const parsedConfigData = JSON.parse(configData);
                    setIndexNumber(parsedConfigData.indexNumber);
                    setSelectedCourse(parsedConfigData.course);
                    setSelectedSemester(parsedConfigData.study_semester);
                    setSelectedSpecializationArea(parsedConfigData.specialization_area);
                }
            } catch (error) {


            }
        }

        updateConfigInformation();
    }, []);



    const [specializationAreaShow, setSpecializationAreaShow] = useState(false);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Appbar.Header style={styles.appBar}>
                <Appbar.Content title="Student Registration" titleStyle={styles.appBarTitle} />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Headline style={styles.headline}>Register Your Information</Headline>
                <Subheading style={styles.subheading}>
                    Please provide your academic details to get started.
                </Subheading>

                {/* Logo/Image */}
                <View style={styles.logoContainer}>
                    {/* Replace 'assets/images/logo.png' with your actual image path */}
                    <View style={styles.logoPlaceholder} />
                    <Subheading style={styles.logoText}>Faculty of Technology</Subheading>
                </View>
                {/* Semester Selection */}
                <Subheading style={styles.pickerLabel}>Select Current Study Semester:</Subheading>
                <View style={[styles.pickerContainer, semesterError ? styles.pickerError : {}]}>
                    <Picker
                        selectedValue={selectedSemester}
                        onValueChange={(itemValue) => {
                            setSelectedSemester(itemValue);
                            setSemesterError(''); // Clear error on change
                        }}
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                    >
                        {semesterOptions?.map((semester) => (
                            <Picker.Item key={semester.value} label={semester.label} value={semester.value} />
                        ))}
                    </Picker>
                </View>
                {semesterError ? <Paragraph style={styles.errorText}>{semesterError}</Paragraph> : null}
                {/* Course Selection */}
                <Subheading style={styles.pickerLabel}>Select Your Course:</Subheading>
                <View style={[styles.pickerContainer, courseError ? styles.pickerError : {}]}>
                    <Picker
                        selectedValue={selectedCourse}
                        onValueChange={(itemValue) => {
                            setSelectedCourse(itemValue);
                            setCourseError(''); // Clear error on change
                        }}
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                    >
                        <Picker.Item key={0} label={'Select Course'} value={''} />
                        {courses?.map((course) => (
                            <Picker.Item key={course.id} label={course.course_code} value={course} />
                        ))}
                    </Picker>
                </View>
                {courseError ? <Paragraph style={styles.errorText}>{courseError}</Paragraph> : null}


                {

                    specializationAreaShow && (
                        <>
                            <Subheading style={styles.pickerLabel}>Select your Specialization area:</Subheading>
                            <View style={[styles.pickerContainer, specializationError ? styles.pickerError : {}]}>
                                <Picker
                                    selectedValue={selectedSpecializationArea}
                                    onValueChange={(itemValue) => {
                                        setSelectedSpecializationArea(itemValue);
                                        setspecializationError(''); // Clear error on change
                                    }}
                                    style={styles.picker}
                                    itemStyle={styles.pickerItem}
                                >
                                    <Picker.Item key={0} label={'Select Specialization Area'} value={''} />
                                    {selectedCourse?.specialization_areas?.map((sp) => (
                                        <Picker.Item key={sp.id} label={sp.area_name} value={sp} />
                                    ))}
                                </Picker>
                            </View>
                            {specializationError ? <Paragraph style={styles.errorText}>{specializationError}</Paragraph> : null}
                        </>
                    )
                }





                {/* Index Number Input */}
                <TextInput
                    label="Index Number (e.g., ICT/22/800)"
                    value={indexNumber}
                    onChangeText={(text) => {
                        setIndexNumber(text.toUpperCase()); // Convert to uppercase as per your pattern
                        setIndexNumberError(''); // Clear error on change
                    }}
                    mode="outlined"
                    keyboardType="default" // Changed to default as it includes '/'
                    autoCapitalize="characters" // Suggests uppercase
                    style={styles.input}
                    left={<TextInput.Icon icon="identifier" />}
                    error={!!indexNumberError} // Show error state
                />
                {indexNumberError ? <Paragraph style={styles.errorText}>{indexNumberError}</Paragraph> : null}


                {/* Register Button */}
                <Button
                    mode="contained"
                    onPress={handleRegister}
                    loading={loading}
                    icon="check-circle" // Changed icon to something more like 'save'
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                    labelStyle={styles.buttonLabel}
                    disabled={loading}
                >
                    SAVE CONFIGURATIONS
                </Button>
            </ScrollView>

            <Portal>
                <Dialog visible={dialogVisible} onDismiss={hideDialog}>
                    <Dialog.Title>Configuration Status</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>{dialogMessage}</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>OK</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            {/* Loading Overlay */}
            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator animating={true} color={'#1976d2'} size="large" />
                    <Paragraph style={styles.loadingText}>Saving configurations...</Paragraph>
                </View>
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e3f2fd', // A light blue background for a fresh feel
    },
    appBar: {
        backgroundColor: '#1976d2', // A deeper blue for the app bar
    },
    appBarTitle: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'flex-start', // Align content to start for better top spacing
    },
    headline: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0d47a1', // Darker blue for headline
        marginBottom: 8,
        textAlign: 'center',
        marginTop: 20, // Add some top margin
    },
    subheading: {
        fontSize: 16,
        color: '#424242',
        marginBottom: 30,
        textAlign: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logoPlaceholder: {
        width: 100,
        height: 100,
        backgroundColor: '#bbdefb', // Light blue placeholder for the logo
        borderRadius: 50, // Circular shape
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 2,
        borderColor: '#90caf9',
    },
    logoText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2196f3',
    },
    input: {
        marginBottom: 15,
        backgroundColor: '#ffffff',
    },
    pickerLabel: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
        marginTop: 10,
        fontWeight: '500',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#bdbdbd', // Light grey border
        borderRadius: 8,
        marginBottom: 15,
        overflow: 'hidden',
        backgroundColor: '#ffffff',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    pickerItem: {
        fontSize: 16,
        color: '#333',
    },
    pickerError: {
        borderColor: 'red', // Red border for error state
        borderWidth: 2,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -10, // Pull it up closer to the field
        marginBottom: 10,
        marginLeft: 10, // Indent slightly
    },
    button: {
        marginTop: 30,
        borderRadius: 10,
        backgroundColor: '#ff9800', // Orange color from your Flutter button
        paddingVertical: 5,
        elevation: 5, // Material design shadow
    },
    buttonContent: {
        height: 50,
    },
    buttonLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loadingText: {
        marginTop: 10,
        color: '#fff',
        fontSize: 16,
    },
});

export default config;