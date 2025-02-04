import { StyleSheet } from 'react-native';

export const primaryColor = '#7800F9';
export const secondaryColor = '#E100CC';
export const backgroundColor = '#F1F3FD';
export const backgroundColorActive = '#FFFFEE';
export const grayDark = '#5F626C';
export const grayLight = '#9EADCD';

export const commonStyles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontFamily: 'futuramedium',
        // fontWeight: 'bold',
        flex: 1,
    },
    textInput: {
        borderRadius: 10,
        borderWidth: 2,
        borderColor: backgroundColor,
        width: '80%',
        paddingVertical: 10,
        paddingHorizontal: 20,
        margin: 10,
        backgroundColor: backgroundColor,
        fontSize: 18,
        fontFamily: 'futuramedium',
    },
    textInputActive: {
        borderColor: primaryColor,
        backgroundColor: '#fff',
    },
    linkText: {
        color: primaryColor,
        fontFamily: 'futuramedium',
    },
    buttonView: {
        marginTop: 40,
        marginBottom: 10,
        width: '80%',
    },
    button: {
        borderRadius: 5,
        backgroundColor: primaryColor,
        paddingVertical: 12,
    },
    buttonTitleStyle: {
        fontFamily: 'futuramedium',
        fontSize: 18,
    },
    bottomText: {
        position: 'absolute',
        bottom: 30,
        fontFamily: 'futuramedium',
    },
    profileImageOld: {
        width: 120,
        height: 120,
        borderRadius: 60,
        overflow: 'hidden',
        marginBottom: 20,
        borderColor: secondaryColor,
        borderWidth: 3,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        overflow: 'hidden',
        marginBottom: 20,
        top: 4,
        left: 4,
        position: 'absolute',
    },
    profileImageContainer: {
        position: 'relative',
        zIndex: -1,
        width: 134,
        height: 134,
        borderRadius: 70,
        borderColor: secondaryColor,
        borderWidth: 3,
    },
    noAvatarImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        overflow: 'hidden',
        marginBottom: 20,
    }
});