import { Dimensions, ScrollView, Text, TouchableOpacity, View } from "react-native"; // Make sure Text and Dimensions are imported
// Remove this problematic import: import { Icon } from "react-native-paper";

// Import the correct Icon component from react-native-vector-icons
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Assuming MaterialCommunityIcons is your chosen icon set

import { useNavigation, useRouter } from 'expo-router';
import styles from '../app/homeStyles'; // Ensure your styles are correctly imported
// Make sure the `styles` object in homeStyles.js includes all the styles
// defined in the previous Sidebar example.

// Define weekdays - ensure this is outside the component or imported
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Re-defining SIDEBAR_WIDTH if it's used in styles, otherwise remove
const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75; // This should be consistent with your styles


// Change the export syntax to a standard named export followed by a default export
const Sidebar = ({ selectedDay, onSelectDay, onChangeConfig, onClose }) => { // Added onChangeConfig prop


    const router = useRouter();
    return (
        <View style={styles.sidebar}>
            {/* Close Button */}


            {/* Header Section */}


            {/* Days List */}

            <ScrollView contentContainerStyle={styles.sidebarScrollView}>

                <View style={{ marginTop: 120 }}>
                    <View>
                        <Text style={styles.sidebarItemText}>Settings</Text>
                    </View>
                    <View>

                        <TouchableOpacity
                            style={styles.sidebarItem}
                            onPress={() => {
                                router.navigate({ pathname: 'config' });
                            }}
                            activeOpacity={0.7}
                        >
                            <Icon name="cog" size={22} color="#fff" style={styles.itemIcon} />
                            <Text style={styles.sidebarItemText}>Change Configuration</Text>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <Text style={styles.sidebarItemText}>Other Days</Text>
                    </View>

                    <View style={{ marginTop: 15 }}>

                        {weekdays.map((day) => (
                            <TouchableOpacity
                                key={day}
                                style={[
                                    styles.sidebarItem,
                                    selectedDay === day && styles.sidebarItemSelected,
                                ]}
                                onPress={() => {

                                    onClose();
                                    router.navigate({
                                        pathname: 'otherDay',
                                        params: { day: day },
                                    });
                                }}
                                activeOpacity={0.7} // Add touch feedback
                            >
                                <Icon
                                    name={"calendar-check"} // Dynamic icon
                                    size={22}
                                    color={selectedDay === day ? '#fff' : '#fff'}
                                    style={styles.itemIcon}
                                />
                                <Text
                                    style={[
                                        styles.sidebarItemText,
                                        selectedDay === day && styles.sidebarItemTextSelected,
                                    ]}
                                >
                                    {day}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                </View>

            </ScrollView>



        </View>
    );
};

export default Sidebar; // Standard default export