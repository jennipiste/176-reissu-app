import { StyleSheet } from 'react-native';

export const primaryColor = '#7800F9';
export const secondaryColor = '#E100CC';
export const backgroundColor = '#F1F3FD';
export const backgroundColorActive = '#FFFFEE';
export const grayDark = '#5F626C';

export const commonStyles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    textInput: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: backgroundColor,
        width: '80%',
        paddingVertical: 10,
        paddingHorizontal: 20,
        margin: 10,
        backgroundColor: backgroundColor,
    },
    textInputActive: {
        borderColor: primaryColor,
        backgroundColor: backgroundColorActive,
    },
    linkText: {
        color: primaryColor,
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
    bottomText: {
        position: 'absolute',
        bottom: 30,
    }
});