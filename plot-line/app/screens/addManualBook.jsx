import React, { useState } from 'react';
import { Formik } from 'formik';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { HostURL } from '../../constants/URL.ts';
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';

import {
    StyledContainer,
    InnerContainer,
    PageTitle,
    MsgBox,
    StyledFormArea,
    StyledButton,
    ButtonText,
    StyledTextInput,
    StyledInputLabel,
    Line,
    LeftIcon,
    Colors,
} from '../../components/styles';

const { brand, darkLight } = Colors;

const AddBook = ({ navigation }) => {
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState('date');

    const createBook = async (values) => {
        // Create the book data from the form values
        const bookData = {
            isbn: values.isbn,
            title: values.title,
            author: values.author,
            published: values.published === 'Unknown publication date' ? null : values.published,
            description: values.description || 'No description available',
            coverLink:  ''
        };

        try {
            // Book creation endpoint
            const bookurl = HostURL + "/user/createManualBook";
            const response = await axios.post(bookurl, bookData);
            const result = response.data;
            const { message, status, data } = result;

            if (status !== 'SUCCESS') {
                // setMessage(message);
                setMessage(result.message);
                setMessageType('FAILED');
            } else {
                setMessage("Book added successfully!");
                setMessageType('SUCCESS');
                // console.log(bookData);
                // Navigate to review screen after book is added
                navigation.navigate('ReviewPlotlineBook', { book: result.data });
            }
        } catch (error) {
            console.error(error);
            setMessage("An error occurred. Please try again.");
            setMessageType('FAILED');
        }
        setSubmitting(false);
    };

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    };

    const handleDateChange = (event, selectedDate) => {
        setShow(false); // Hide the picker after selection
        if (selectedDate) {
            setDate(selectedDate);
        }
    };


    return (
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <ScrollView>
                    <InnerContainer>
                        <PageTitle>Add a New Book</PageTitle>
                        <Formik
                            initialValues={{ isbn: '', title: '', author: '', published: '', description: '' }}
                            onSubmit={(values) => {
                                if (!values.isbn || !values.title || !values.author) {
                                    setMessage("Please fill out all required fields.");
                                    setMessageType('FAILED');
                                } else {
                                    setSubmitting(true);
                                    createBook(values);
                                }
                            }}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values }) => (
                                <StyledFormArea>
                                    <MyTextInput
                                        label="ISBN (Required)"
                                        icon="barcode"
                                        placeholder="Enter ISBN"
                                        placeholderTextColor={darkLight}
                                        onChangeText={handleChange('isbn')}
                                        onBlur={handleBlur('isbn')}
                                        value={values.isbn}
                                    />
                                    <MyTextInput
                                        label="Title (Required)"
                                        icon="book"
                                        placeholder="Enter title"
                                        placeholderTextColor={darkLight}
                                        onChangeText={handleChange('title')}
                                        onBlur={handleBlur('title')}
                                        value={values.title}
                                    />
                                    <MyTextInput
                                        label="Author (Required)"
                                        icon="person"
                                        placeholder="Enter author name"
                                        placeholderTextColor={darkLight}
                                        onChangeText={handleChange('author')}
                                        onBlur={handleBlur('author')}
                                        value={values.author}
                                    />
                                    <View>
                                        <StyledInputLabel>Published Date</StyledInputLabel>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            {/* Calendar Icon with Grey Background */}
                                            <LeftIcon>
                                                <Ionicons name="calendar" size={30} color={brand} />
                                            </LeftIcon>
                                            {/* Date Input */}
                                            <TouchableOpacity
                                                style={{ flex: 1 }}
                                                onPress={() => {
                                                    setShow(true); // Show the date picker
                                                    setMode('date');
                                                }}
                                            >
                                                <StyledTextInput
                                                    placeholder="Select a date"
                                                    placeholderTextColor={darkLight}
                                                    value={values.published || date.toISOString().split('T')[0]} // Format to YYYY-MM-DD
                                                    editable={false} // Prevent manual editing
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <MyTextInput
                                        label="Description"
                                        icon="document-text"
                                        placeholder="Enter description (optional)"
                                        placeholderTextColor={darkLight}
                                        onChangeText={handleChange('description')}
                                        onBlur={handleBlur('description')}
                                        value={values.description}
                                    />
                                    <MsgBox type={messageType}>{message}</MsgBox>
                                    {!submitting && (
                                        <StyledButton onPress={handleSubmit}>
                                            <ButtonText>Add Book/Review</ButtonText>
                                        </StyledButton>
                                    )}
                                    {submitting && <Line />}
                                </StyledFormArea>
                            )}
                       </Formik>
                    </InnerContainer>
                </ScrollView>
            </StyledContainer>
            {/* DateTimePicker */}
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    onChange={(event, selectedDate) => {
                        setShow(false);
                        if (selectedDate) {
                            setDate(selectedDate);
                            setFieldValue('published', selectedDate.toISOString().split('T')[0]); // Update Formik field
                        }
                    }}
                />
            )}
        </KeyboardAvoidingWrapper>
    );
};


const MyTextInput = ({ label, icon, ...props }) => {
    return (
        <View>
            <StyledInputLabel>{label}</StyledInputLabel>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <LeftIcon>
                    <Ionicons name={icon} size={30} color={brand} />
                </LeftIcon>
                <StyledTextInput {...props} />
            </View>
        </View>
    );
};

export default AddBook;
