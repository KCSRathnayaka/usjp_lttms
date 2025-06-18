import { Platform } from "react-native";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5', // Light background color for the entire screen
    },
    mainContentArea: {
        flex: 1,
        // This view will contain the header and main scrollable content
    },
    sidebarSubtitle: {
        fontSize: 14,
        color: '#7f8c8d', // Softer color for subtitle
    },
    menuButton: {
        position: 'absolute',
        left: 15,
        top: Platform.OS === 'android' ? 15 : 5, // Adjust for iOS status bar
        zIndex: 10,
        padding: 10,
    },
    menuIcon: {
        fontSize: 28,
        color: '#fff',
        fontWeight: 'bold',
    },
    headerBackground: {
        width: '100%',
        height: 100, // Reduced header height for better layout with sidebar
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 0, // Removed margin to place Last Update Time immediately below
        overflow: 'hidden', // Ensures rounded corners apply
        borderBottomLeftRadius: 20, // Rounded bottom corners
        borderBottomRightRadius: 20,
        elevation: 3, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerImageStyle: {
        resizeMode: 'cover', // Ensures the image covers the background area
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerOverlay: {
        ...StyleSheet.absoluteFillObject, // Fills the parent ImageBackground
        backgroundColor: 'rgba(44, 62, 80, 0.85)', // Darker overlay for text readability
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTitle: {
        fontSize: 28, // Adjusted font size for header title
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        paddingHorizontal: 10, // Adjusted padding
        textShadowColor: 'rgba(0, 0, 0, 0.75)', // Text shadow for better visibility
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    lastUpdateContainer: {
        backgroundColor: '#eaf3f9', // Light blue background for update time
        paddingVertical: 8,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#dbe9f4',
        // No border radius here to align with the rest of the main content
        marginBottom: 10, // Space below the update time
    },
    lastUpdateText: {
        fontSize: 15,
        color: '#555',
        fontWeight: '500',
    },
    mainScrollViewContent: {
        flexGrow: 1, // Allows ScrollView to grow and fill available space
        paddingHorizontal: 15, // Horizontal padding for the main content
        paddingBottom: 10, // Add some padding at the bottom of the scroll view
    },
    section: {
        marginBottom: 15, // Space between sections
        backgroundColor: '#fff', // Add a background to sections for visual pop
        borderRadius: 12, // Rounded corners for sections
        padding: 15,
        elevation: 4, // More pronounced shadow for sections
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
    },
    sectionTitle: {
        fontSize: 22, // Adjusted font size for section titles
        fontWeight: 'bold',
        color: '#2c3e50', // Darker text color
        marginBottom: 15,
        borderBottomWidth: 2, // Underline effect
        borderBottomColor: '#3498db', // Blue underline
        paddingBottom: 5,
    },
    lectureCard: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 3, // More pronounced shadow for cards
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
    },
    currentLectureCard: {
        backgroundColor: '#3498db', // Vibrant blue background for current lecture
        transform: [{ scale: 1.03 }], // Slightly enlarge current lecture
        borderWidth: 2, // Border to make it stand out more
        borderColor: '#2980b9',
    },
    upcomingLectureCard: {
        backgroundColor: '#f8f8f8', // Slightly off-white for distinction
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    lectureSubject: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
        color: '#2c3e50', // Darker text for subject
    },
    currentText: {
        color: '#fff', // White text for current lecture
    },
    lectureDetail: {
        fontSize: 14,
        color: '#666', // Medium gray for details
        marginBottom: 2,
    },
    currentDetailText: {
        color: '#ecf0f1', // Light gray text for details in current lecture
    },
    detailLabel: {
        fontWeight: 'bold',
        color: '#333', // Darker label color
    },
    noLectureCard: {
        backgroundColor: '#fdfdff', // Very light background
        padding: 15,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
    },
    noLectureText: {
        fontSize: 16,
        color: '#7f8c8d', // Muted text color
        textAlign: 'center',
    },
    upcomingLecturesContainer: {
        // Styling for the container of upcoming lectures if needed
    },
    // Sidebar Specific Styles
    animatedSidebar: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 260,
        backgroundColor: '#34495e',
        paddingVertical: 20,
        paddingHorizontal: 10,
        zIndex: 100, // Ensure sidebar is on top
        elevation: 8, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    sidebar: {
        flex: 1, // Sidebar itself fills its animated container
    },
    closeButton: {
        position: 'absolute',
        right: 10,
        top: 10,
        padding: 10,
        zIndex: 1, // Ensure close button is tappable
    },
    closeIcon: {
        fontSize: 24,
        color: '#ecf0f1',
    },
    sidebarTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ecf0f1',
        marginBottom: 15,
        textAlign: 'center',
        marginTop: 30, // Space for close button
    },
    sidebarScrollView: {
        flexGrow: 1, // Allow scrolling within the sidebar
        display: 'flex',
        flexDirection: 'column',
        gap: 5,

    },
    sidebarItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 8,
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'start',
    },
    sidebarItemSelected: {
        backgroundColor: '#3498db',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    sidebarItemText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#ecf0f1',
    },
    sidebarItemTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject, // Covers the entire screen
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent overlay
        zIndex: 99, // Below sidebar, above main content
    },
});

export default styles;