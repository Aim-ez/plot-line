import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import axios from 'axios';

import { HostURL } from '../../constants/URL.ts';

import {
    StyledContainer,
    InnerContainer,
    PageTitle,
    SubTitle,
    StyledButton,
    ButtonText,
    Line,
    PageLogo,
    SearchBar,
    MsgBox,
    HeaderImage,
} from '../../components/styles';

const Home = ({ navigation }) => {
    const url = `${HostURL}/user/getUserIDByUsername`;

    // State for query, messages, and message types
    const [query, setQuery] = useState('');
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);

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

    // Handle error messages
    const handleMessage = (error, type = 'FAILED') => {
        const errorMessage = error?.response?.data?.message || error?.message || 'An unexpected error occurred';
        setMessage(errorMessage);
        setMessageType(type);
    };

    const renderHeader = () => (
        <InnerContainer>
            <HeaderImage source={require('../../assets/images/books2.png')} />
        </InnerContainer>
    )

    // Render header section
    const renderOtherReviews = () => (
        <InnerContainer>
            <PageTitle>Need a new read?</PageTitle>
            <SubTitle>See what others are reviewing:</SubTitle>
            <SearchBar
                placeholder="Search by username to see others' reviews!"
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={fetchUser} // Trigger fetchUser on "Enter" or "Done"
                returnKeyType="search" // Customize the keyboard action button
            />
            <MsgBox type={messageType}>{message}</MsgBox>
            <StyledButton onPress={fetchUser}>
                <ButtonText>See {query ? `${query}'s reviews` : 'reviews'}</ButtonText>
            </StyledButton>
            <Line />
        </InnerContainer>
    );

    // Render homepage section
    const renderComingSoon = () => (
        <InnerContainer>
            <PageTitle>Your Homepage</PageTitle>
            <SubTitle>More Features Coming Soon</SubTitle>
            <PageLogo source={require('../../assets/images/PlotLogo.png')} />
        </InnerContainer>
    );

    return (
        <ScrollView>
            <StyledContainer home={true}>
                {renderHeader()}
                {renderOtherReviews()}
                {renderComingSoon()}
            </StyledContainer>
        </ScrollView>
    );
};

export default Home;
