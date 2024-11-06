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

function PlotlineBookReviews({route, navigation}) {
    const { book } = route.params;
    const bookId = book._id;

    const url = HostURL + "/user/getBookReviews";
    const bookurl = HostURL + "/user/getBookData";

    const [allReviewData, setReviewData] = useState([]);

    async function getAllData() {
        const res = await axios.get(url, {params: {bookId: bookId}})
        setReviewData(res.data.data);
    }

    useEffect(() => {
        getAllData(); 
    }, [bookId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`; // Example: '2024-11-04'
    }

    const Rev = ({ review }) => {

        return (
            <>
            <ReviewBox disabled={true}>
                <ReviewText date={true}>{formatDate(review.date)}</ReviewText>
                <ReviewText>Book: {book.title}</ReviewText>
                <ReviewText>Author: {book.author}</ReviewText>
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
                    <PageTitle>Reviews for {book.title}</PageTitle>
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
                        <ExtraText>{book.title} doesn't have any reviews yet!</ExtraText>
                    )}

                   

                </InnerContainer>
            </StyledContainer>
    );
}

export default PlotlineBookReviews;

