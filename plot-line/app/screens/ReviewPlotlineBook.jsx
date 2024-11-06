import React, {useState, useContext} from 'react';


import { Formik } from 'formik';
import { View, ScrollView } from 'react-native';

// API Client
import axios from 'axios';

// async storage
import AsyncStorage  from '@react-native-async-storage/async-storage'

// credntials context
import { CredentialsContext } from '../../components/CredentialsContext.jsx'

import { HostURL } from '../../constants/URL.ts';

// keyboard avoiding wrapper
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';


import { Ionicons } from '@expo/vector-icons';

import {
    StyledContainer,
    InnerContainer,
    PageTitle,
    MsgBox,
    SubTitle,
    StyledFormArea,
    StyledButton,
    ButtonText,
    Line,
    StyledTextInput,
    StyledInputLabel,
    PageLogo,
    LeftIcon,
    Colors,
} from '../../components/styles';



const {brand, darkLight, primary} = Colors;

const ReviewPlotlineBook = ({navigation, route}) => {
    const reviewurl = HostURL + "/user/createReview"
    const reviewexistsurl = HostURL + "/user/reviewExists"
    const { book } = route.params;

    const currentDate = new Date().toISOString();


    //context -> will be important later
    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
    const { _id } = storedCredentials;
    const title = book?.title || "No Title Available";  // Default title if missing



    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [submitting, setSubmitting] = useState();

    const checkReviewExists = async (bookId) => {
        try {
            const response = await axios.get(reviewexistsurl, {params:
                {
                    userId: _id,
                    bookId: bookId
                }
            })

            if (response.data.status == 'NOT FOUND') {
                return false;
            } else if (response.data.status == 'FOUND') {
                return true;
            } else {
                console.error('Error checking if review for book exists', response.data);
                return null; 
            }
        } catch (error) {
            console.log(error);
            handleMessage("An error occured. Check your network and try again.");
        }
    }
   

    const handleCreateReview = async (reviewInfo) => {
        handleMessage(null); // Reset error message
        const {rating, description } = reviewInfo;

        const formData = {
            rating,
            description,
            date: currentDate,
            userId: _id,
            bookId: book._id
        }

        try {     
            // check if user has already reviewed this book
            const reviewExists = await checkReviewExists(book._id);

            if (reviewExists == true) {
                handleMessage("You have already reviewed this book!", 'FAILED');
                setSubmitting(false);
            } else if (reviewExists == false) {
                const response = await axios.post(reviewurl, formData)
                const result = response.data;
                const {message, status} = result;

                if (status != 'SUCCESS') {
                    handleMessage(message, status);
                    setSubmitting(false);
                } else { 
                    handleMessage("Review created. Check your profile to see your reviews!", 'SUCCESS')
                    console.log("REVIEW CREATION SUCCESSFUL")
                }
            }
        } catch (error) {
                console.log(error);
                setSubmitting(false);
                handleMessage("An error occured. Check your network and try again.");
            
        }
    }

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    return (
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <ScrollView>
                    <InnerContainer>
                        <PageLogo source={require('../../assets/images/PlotLogo.png')}/>
                        <PageTitle>Reviewing {title}</PageTitle>
                        <SubTitle>Subtitle needed?</SubTitle>
                        <Formik
                            initialValues={{rating: '', description: ''}}
                            onSubmit={(values) => {
                                const numericRating = Number(values.rating)
                                if (!Number.isInteger(numericRating)) {
                                    handleMessage('You must enter a number for the rating (Decimals not allowed).');
                                    setSubmitting(false);
                                } else if (
                                    values.rating == '' || values.rating > 5 || values.rating < 1
                                ) {
                                    handleMessage('Please enter a rating out of 5 (minimum 1).');
                                    setSubmitting(false);
                                } else {
                                    setSubmitting(true);
                                    handleCreateReview(values);
                                }
                            }}
                        >{({handleChange, handleBlur, handleSubmit, values}) => (<StyledFormArea>
                            <MyTextInput 
                                label="Rating (out of 5)"
                                icon="star"
                                placeholder="3"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('rating')}
                                onBlur={handleBlur('rating')}
                                value={values.rating}
                            />
                            <MyTextInput 
                                label="Review"
                                icon="book"
                                placeholder="Enter review message here...(optional)"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('description')}
                                onBlur={handleBlur('description')}
                                value={values.description}
                            />
                            <MsgBox type={messageType}>{message}</MsgBox>
                            {!submitting && (
                                <StyledButton onPress={handleSubmit}>
                                    <ButtonText>Submit Review</ButtonText>
                                </StyledButton>
                            )}
                            {submitting && (
                                <Line />
                            )}
                           
                        </StyledFormArea>)}
                        </Formik>
                    </InnerContainer>
                </ScrollView>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
}

const MyTextInput = ({label, icon, ...props}) => {
    return (<View >

        <StyledInputLabel>{label}</StyledInputLabel>
        
        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <LeftIcon>
                <Ionicons name={icon} size={30} color={brand}/>
            </LeftIcon>
            <StyledTextInput {...props}/>
        </View>

    </View>)
}

export default ReviewPlotlineBook;

