import React, { useContext, useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native';
import axios from 'axios';
import { HostURL } from '../../constants/URL.js';

import { CredentialsContext } from '../../components/CredentialsContext.jsx';

import {
    StyledContainer,
    InnerContainer,
    PageTitle,
    SubTitle,
    StyledButton,
    ButtonText,
    Line,
    ExtraText,
    BookContainer,
    BookCoverImage,
    BookInfo,
    BookText,
    AuthorText
} from '../../components/styles';

const Profile = ({ route, navigation }) => {
    const {userId, username} = route.params;
    const [favorite, setFavorite] = useState(false);
    const getFavURL = HostURL + "/user/getFavourite";
    const getBookURL = HostURL + "/user/getBook";


    useEffect(() => {
        fetchFavorite();
    }, [userId]);

    const fetchFavorite = async () => {
        try {
            const response = await axios.get(getFavURL, { params: { userId: userId } });
    
            if (response.data.status === "SUCCESS" && response.data.data) {
                const favoriteBookId = response.data.data;
    
                const bookResponse = await axios.get(getBookURL, { params: { bookId: favoriteBookId } });
                if (bookResponse.data.status === "SUCCESS") {
                    setFavorite(bookResponse.data.data); // Store the full book object
                }
           }
        } catch (error) {
            console.error("Error fetching favorite book:", error);
        }
    };

    // Render sections to keep JSX clean
    const renderFavourite = () => (
        <InnerContainer>
            <SubTitle>My Favourite Book</SubTitle>
            {renderBook(favorite)}
        </InnerContainer>
    );
    const renderBook = (book) => {
        if (!book) {
            return <ExtraText>@{username} hasn't added a book to this list yet!.</ExtraText>;
        }
    
        return (
            <BookContainer onPress={() => goToDetails(book)}>
                <BookCoverImage readlist={true} source={{ uri: book.coverLink }} />
                <BookInfo>
                    <BookText>{book.title}</BookText>
                    <AuthorText>{book.author}</AuthorText>
                    <ExtraText readlist={true} numberOfLines={2}>{book.description}</ExtraText>
                </BookInfo>
            </BookContainer>
        );
    };

    const renderAboutMe = () => (
        <InnerContainer>
            <SubTitle>About Me</SubTitle>
            <SubTitle profile={true}>Feature coming soon!</SubTitle>
            <ExtraText>*Cue about me*</ExtraText>
        </InnerContainer>
    );

    const renderCurrentlyReading = () => (
        <InnerContainer>
            <SubTitle>Currently Reading...</SubTitle>
            <SubTitle profile={true}>Feature coming soon!</SubTitle>
            <ExtraText>*Insert book similar to reading list*</ExtraText>
        </InnerContainer>
    )
    

    return (
        <ScrollView>
            <StyledContainer>
                <PageTitle>@{username}'s Profile</PageTitle>
                <Line thick={true} />
                 {renderAboutMe()}
                <Line />
                {renderFavourite()}
                <Line />
                {renderCurrentlyReading()}
            </StyledContainer>
        </ScrollView>
    );
};

export default Profile;
