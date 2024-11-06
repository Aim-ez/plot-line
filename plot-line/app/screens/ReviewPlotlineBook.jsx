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
    const url = HostURL + "/user/createReview"
    const { book } = route.params;
    console.log("Book in review", book);

    const currentDate = new Date().toISOString();


    //context -> will be important later
    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
    const { _id } = storedCredentials;
    const title = book?.volumeInfo.title || "No Title Available";  // Default title if missing



    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [submitting, setSubmitting] = useState();
   

    const handleCreateReview = (reviewInfo) => {
        handleMessage(null); // Reset error message
        const {rating, description } = reviewInfo;

        const bookk = createPlotlineBook(book)

        const formData = {
            rating,
            description,
            date: currentDate,
            userId: _id,
            bookId: bookk //CHANGE ME BACK
        }

        console.log("Book id received for create google review:", bookk);


        /*
        axios.post(url, formData)
        .then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status != 'SUCCESS') {
                handleMessage(message, status);
            } else { 
                console.log("REVIEW CREATION SUCCESSFUL")
            }
            setSubmitting(false);
        }).catch(error => {
            console.log(error);
            setSubmitting(false);
            handleMessage("An error occured. Check your network and try again.");
        })
            */
    }

    /*

    const createPlotlineBook = (googleBook) => {
        //title defined above, siince it was used for page title
        const { book } = googleBook;
        const isbn = 1; //industryindtifiers?
        const author = book.volumeInfo.authors?.join(', ');
        const description = book.volumeInfo.description;
        const published = book.volumeInfo.publishedDate;

    }
        */


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
                                if (Number.isNaN(values.rating)) {
                                    handleMessage('You must enter a number for the rating.');
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
                                <StyledButton disabled={true}>
                                     <Ionicons name={'ellipse-outline'} size={30} color={primary}/>
                                </StyledButton>
                            )}
                            <Line />
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

