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

const ReviewGoogleBook = ({navigation, route}) => {
    const reviewurl = HostURL + "/user/createReview"
    const bookurl = HostURL + "/user/createBook"
    const bookexistsurl = HostURL + "/user/bookExists"
    const reviewexistsurl = HostURL + "/user/reviewExists"
    const { book } = route.params;

    const currentDate = new Date().toISOString();


    //context -> will be important later
    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
    const { _id } = storedCredentials;
    const title = book?.volumeInfo.title || "No Title Available";  // Default title if missing



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

        // get bookId to put review on
        const bookId = await createPlotlineBook()

        const formData = {
            rating,
            description,
            date: currentDate,
            userId: _id,
            bookId: bookId 
        }

        try {     
            if (bookId == 1) {
                console.error('Something broke in book creation', response.data);
            } else {   
                // check if user has already reviewed this book
                const reviewExists = await checkReviewExists(bookId);

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
                        navigation.navigate('TabLayout')
                    }
                }
            }
        } catch (error) {
                console.log(error);
                setSubmitting(false);
                handleMessage("An error occured. Check your network and try again.");
            
        }
    }


    const checkPlotBookExists= async (bookData) => {
        const { title, author, isbn } = bookData;

        try {
            const response = await axios.get(bookexistsurl, {params:
                {
                    title: title,
                    author: author,
                    isbn: isbn
                }
            })

            if (response.data.status == 'NOT FOUND') {
                return false;
            } else if (response.data.status == 'FOUND') {
                const bookId = response.data.data.bookId
                return bookId;
            } else {
                console.error('Error checking if plot book exists', response.data);
                return null; 
            }
        } catch (error) {
            console.log(error);
            handleMessage("An error occured. Check your network and try again.");
        }
    }

    const createPlotlineBook = async () => {
        //title defined above, siince it was used for page title
        const isbn = book.volumeInfo?.industryIdentifiers?.find(identifier => identifier.type === "ISBN_13")?.identifier 
        || book.volumeInfo?.industryIdentifiers?.find(identifier => identifier.type === "ISBN_10")?.identifier
        || null;        
        const author = book.volumeInfo?.authors && book.volumeInfo.authors.length > 0 ? book.volumeInfo.authors.join(', ') : 'Unknown author';
        const description = book.volumeInfo?.description || 'No description available';
        const published = book.volumeInfo?.publishedDate || 'Unknown publication date';
        const coverLink = book.volumeInfo.imageLinks?.thumbnail || '';

        bookData = {
            title, 
            isbn,
            author,
            description,
            published,
            coverLink
        }

        try{
            const exists = await checkPlotBookExists(bookData);

            if (exists == null) { //error occured
                console.error('Error checking if plot book exists', response.data);
            } else if (exists == false) { //book doesn't exist, create
                const response = await axios.post(bookurl, bookData)
                const result = response.data;
                const {message, status, data} = result;

                if (status != 'SUCCESS') {
                        handleMessage(message, status);
                        setSubmitting(false);
                        return 1;
                } else { 
                    console.log("BOOK CREATION SUCCESSFUL")
                    return (data._id);
                }
            } else { //book exists, exists contains bookId
                return exists;
            }

 
        } catch (error) {
            console.log(error);
            setSubmitting(false);
            handleMessage("An error occured. Check your network and try again.");
            return 1;
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
                                returnKeyType="done"
                                onSubmitEditing={handleSubmit} // Submit the form
                            />
                            <MyTextInput 
                                label="Review"
                                icon="book"
                                placeholder="Enter review message here...(optional)"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('description')}
                                onBlur={handleBlur('description')}
                                value={values.description}
                                returnKeyType="done"
                                onSubmitEditing={handleSubmit} // Submit the form
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

export default ReviewGoogleBook;

