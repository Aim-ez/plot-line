import React, {useContext, useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar'

// async storage
import AsyncStorage  from '@react-native-async-storage/async-storage'

// credntials context
import { CredentialsContext } from '../../components/CredentialsContext.jsx'

// Host URL
import { HostURL } from '../../constants/URL.ts'

// API client
import axios from 'axios';

import {
    StyledContainer,
    InnerContainer,
    PageTitle,
    SubTitle,
    StyledFormArea,
    StyledButton,
    ButtonText,
    Line,
    WelcomeContainer,
    PageLogo,
    ReviewBox,
    ReviewText,
    ExtraText,
    
} from '../../components/styles';
import { ScrollView, FlatList } from 'react-native';

function UserReviews({navigation}) {
    const url = HostURL + "/user/getReviews";
    const bookurl = HostURL + "/user/getBookData";

    const [allReviewData, setReviewData] = useState('');

    //context -> will be important later
    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
    const { _id, name, username, email } = storedCredentials;
    
    async function getAllData() {
        axios.get(url, {params: {userId:_id}}).then(res => {
            setReviewData(res.data.data);
        });
    }

    useEffect(() => {
        getAllData(); 
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`; // Example: '2024-11-04'
    }

    const Rev = ({ review }) => {
        const [bookData, setBookData] = useState(null);

        useEffect(() => {
            // Fetch book data when the component mounts
            const fetchBookData = async () => {
                try {
                    const res = await axios.get(bookurl, { params: { bookId: review.bookId } });
                    setBookData(res.data.data);  // Set book data
                } catch (error) {
                    console.error("Error fetching book data", error);
                }
            };

            fetchBookData();
        }, [review.bookId]); // Re-fetch if bookId changes

        if (!bookData) {
            return <ReviewText>Loading book details...</ReviewText>;
        }

        const handlePress = () => {
            navigation.navigate('BookDetails', { book: bookData, fromReview: true})
        }

        return (
            <>
            <ReviewBox onPress={handlePress}>
                <ReviewText date={true}>{formatDate(review.date)}</ReviewText>
                <ReviewText>Book: {bookData.title}</ReviewText>
                <ReviewText>Author: {bookData.author}</ReviewText>
                <ReviewText>Rating: {review.rating}</ReviewText>
                <ReviewText>"{review.description}"</ReviewText>
            </ReviewBox>
            </>
        )
    };

    const numberOfReviews = allReviewData.length;


    return (
            <StyledContainer>
            <StatusBar style="dark"/>
                <InnerContainer>
                    <PageTitle>Your Reviews</PageTitle>
                    <Line></Line>
                    {numberOfReviews > 0 ? (
                        <>
                            <ExtraText>Total Reviews: {numberOfReviews}</ExtraText>
                             <FlatList 
                            data={allReviewData}
                            keyExtractor={item => item._id}
                            renderItem={({item}) => (<Rev review={item}/>)}
                        />
                        </>
                    ) : (
                        <ExtraText>You don't have any reviews yet!</ExtraText>
                    )}

                   

                </InnerContainer>
            </StyledContainer>
    );
}

export default UserReviews;

