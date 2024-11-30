import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native';

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
} from '../../components/styles';

const Profile = ({ route, navigation }) => {
    const {username} = route.params;

    // Fetch user data by username
        const fetchUser = async () => {
            setMessage(null); // Clear previous messages
    
            if (!query.trim()) {
                handleMessage('Please enter a username to search.');
                return;
            }
    
            try {
                const normalizedQuery = query.trim().toLowerCase(); // Normalize the query
                const response = await axios.get(url, { params: { username: normalizedQuery } });
                const userId = response.data.data._id;
    
                // Navigate to the user reviews page with the fetched user ID and handle
                navigation.navigate('OthersReviews', { userId, handle: query });
            } catch (error) {
                handleMessage(error);
            }
        };

    // Render sections to keep JSX clean
    const renderFavourite = () => (
        <InnerContainer>
            <SubTitle>My Favourite Book</SubTitle>
            <SubTitle profile={true}>Feature coming soon!</SubTitle>
            <ExtraText>*Insert book similar to reading list*</ExtraText>
        </InnerContainer>
    );

    const renderAboutMe = () => (
        <InnerContainer>
            <SubTitle>About @{username}</SubTitle>
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
                {renderFavourite()}
                <Line />
                {renderAboutMe()}
                <Line />
                {renderCurrentlyReading()}
            </StyledContainer>
        </ScrollView>
    );
};

export default Profile;
