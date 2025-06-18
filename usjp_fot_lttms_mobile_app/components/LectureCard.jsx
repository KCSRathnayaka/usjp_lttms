import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Or any other icon library you prefer

// LectureCard component for displaying individual lecture details.
// It's styled to be clear, attractive, and user-friendly with icons.



const LectureCard = ({ lecture, isCurrent }) => {

    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${date.toLocaleDateString()} ${hours}:${minutes}:${seconds}`;
    };


    return (
        <View style={[
            styles.lectureCard,
            isCurrent ? styles.currentLectureCard : styles.upcomingLectureCard,
            // Add a subtle bounce/scale effect for the current lecture card
            isCurrent && { transform: [{ scale: 1.02 }], elevation: 8, shadowOpacity: 0.25 }
        ]}>
            {/* Subject Title */}
            <Text style={[
                styles.lectureSubject,
                isCurrent ? styles.currentText : styles.defaultSubjectText
            ]}>
                {lecture?.subject?.subject_name}
            </Text>

            {/* Horizontal Divider */}
            <View style={styles.divider} />

            {/* Time, Venue, Lecturer Details with Icons */}
            <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                    <Icon name="clock-o" size={16} color={isCurrent ? '#ecf0f1' : '#7f8c8d'} style={styles.detailIcon} />
                    <Text style={[styles.lectureDetail, isCurrent ? styles.currentDetailText : styles.defaultDetailText]}>
                        <Text style={styles.detailLabel}>Time:</Text> {lecture.start_time} - {lecture.end_time}
                    </Text>
                </View>

                <View style={styles.detailRow}>
                    <Icon name="map-marker" size={16} color={isCurrent ? '#ecf0f1' : '#7f8c8d'} style={styles.detailIcon} />
                    <Text style={[styles.lectureDetail, isCurrent ? styles.currentDetailText : styles.defaultDetailText]}>
                        <Text style={styles.detailLabel}>Venue:</Text> {lecture?.lecture_hall?.hall_name}
                    </Text>
                </View>

                <View style={styles.detailRow}>
                    <Icon name="user-o" size={16} color={isCurrent ? '#ecf0f1' : '#7f8c8d'} style={styles.detailIcon} />
                    <Text style={[styles.lectureDetail, isCurrent ? styles.currentDetailText : styles.defaultDetailText]}>
                        <Text style={styles.detailLabel}>Lecturer:</Text> {lecture?.lecturer?.lecturer_name}
                    </Text>
                </View>
            </View>
        </View>
    )


}



// Consolidated styles for the LectureCard.
// You should place these styles within your AppStyles.js or a dedicated LectureCardStyles.js
const styles = StyleSheet.create({
    lectureCard: {
        padding: 20, // Increased padding for better spacing
        borderRadius: 15, // More rounded corners
        marginBottom: 15, // Increased space between cards
        elevation: 6, // Enhanced Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18, // Slightly more pronounced shadow
        shadowRadius: 5,
        backgroundColor: '#fff', // Default background for upcoming
        borderWidth: 1, // Subtle border
        borderColor: '#e0e0e0',
    },
    currentLectureCard: {
        backgroundColor: '#3498db', // Vibrant blue background for current lecture
        borderColor: '#2980b9', // Darker border for accent
    },
    upcomingLectureCard: {
        backgroundColor: '#ffffff', // Clean white background
        borderColor: '#f0f0f0',
    },
    lectureSubject: {
        fontSize: 20, // Slightly larger font for subject
        fontWeight: '700', // Bolder subject
        marginBottom: 10, // Space below subject
        color: '#2c3e50', // Dark text for readability
    },
    defaultSubjectText: {
        color: '#2c3e50',
    },
    currentText: {
        color: '#fff', // White text for current lecture
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 10, // Space around divider
        // Make divider subtle for current card
        backgroundColor: 'rgba(255,255,255,0.3)',
        // If not current, use a standard gray
        // (This would need to be conditional, or you define two divider styles)
    },
    detailsContainer: {
        marginTop: 5, // Space above the details block
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5, // Space between detail rows
    },
    detailIcon: {
        marginRight: 8, // Space between icon and text
    },
    lectureDetail: {
        fontSize: 15, // Slightly larger font for details
        color: '#666', // Medium gray for details
    },
    defaultDetailText: {
        color: '#666',
    },
    currentDetailText: {
        color: '#ecf0f1', // Light gray text for details in current lecture
    },
    detailLabel: {
        fontWeight: 'bold',
        color: '#333', // Darker label color
    },
});

export default LectureCard;
