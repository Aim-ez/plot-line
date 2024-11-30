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
    const getAboutMeURL = HostURL + "/user/getAboutMe";
    const getPrivacyURL = HostURL + "/user/getPrivacyStatus";
    const [aboutMe, setAboutMe] = useState('');
    const [isPrivate, setIsPrivate] = useState(true); //default to private at first



    useEffect(() => {
        fetchFavorite();
        fetchAboutMe();
        fetchPrivacyStatus();
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

    const fetchAboutMe = async () => {
        try {
            const response = await axios.get(getAboutMeURL, { params: { userId: userId } });
            if (response.data.status === "SUCCESS") {
                setAboutMe(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching 'About Me':", error);
        }
    };

    const fetchPrivacyStatus = async () => {
        try {
            const response = await axios.get(getPrivacyURL, { params: { userId: userId } });
            if (response.data.status === "SUCCESS") {
                setIsPrivate(response.data.data); // Set initial privacy status
            }
        } catch (error) {
            console.error("Error fetching privacy status:", error);
        }
    };

    const goToDetails = (book) => {
        navigation.navigate('BookDetails', { book: book, fromReview: true})
    }

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
            <ExtraText>{aboutMe || `...`}</ExtraText>
        </InnerContainer>
    );

    const renderCurrentlyReading = () => (
        <InnerContainer>
            <SubTitle>Currently Reading...</SubTitle>
            <SubTitle profile={true}>Feature coming soon!</SubTitle>
            <ExtraText>*Insert book similar to reading list*</ExtraText>
        </InnerContainer>
    )

    const renderProfile = () => (
        <>
            <Line thick={true} />
            {renderAboutMe()}
            <Line />
            {renderFavourite()}
            <Line />
            {renderCurrentlyReading()}
        </>
    )

    const renderPrivate = () => (
        <InnerContainer>
            <SubTitle>This account is set to private.</SubTitle>
        </InnerContainer>
    )
    

    return (
        <ScrollView>
            <StyledContainer>
                <PageTitle>@{username}'s Profile</PageTitle>
                {isPrivate ? renderPrivate() : renderProfile()}
            </StyledContainer>
        </ScrollView>
    );
};

export default Profile;
