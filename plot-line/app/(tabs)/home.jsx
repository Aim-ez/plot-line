import React, { useState, useEffect } from 'react';
import { FlatList, Text, ActivityIndicator, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import { HostURL } from '../../constants/URL.ts';
import { Ionicons } from '@expo/vector-icons';

import { 
    StyledContainer,
    HomeScreenContainer, 
    HomeScreenHeader, 
    HomeBookContainer, 
    HomeBookCoverImage, 
    HomeBookInfo, 
    HomePageTitle, 
    SearchBar, 
    MsgBox, 
    ButtonText, 
    StyledButton, 
    InnerContainer,
    PageTitle,
    SubTitle,
    Line,
    HeaderImage
} from '../../components/styles';

const Home = ({ navigation }) => {
    const url = `${HostURL}/user/getUserIDByUsername`;

    const [query, setQuery] = useState('');
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [shownTitles, setShownTitles] = useState(new Set()); // Track previously shown titles

    // Fetch recommendations from backend
    const fetchRecommendations = async (userId) => {
        if (!userId) {
            console.log("No userId provided for recommendations.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`${HostURL}/user/recommendations`, { params: { userId } });
            // Filter out books that have already been shown based on titles
            const newRecommendations = response.data.data.filter(book => !shownTitles.has(book.title));

            if (newRecommendations.length > 0) {
                // Limit to 3 books
                const limitedRecommendations = newRecommendations.slice(0, 3);

                // Update shownTitles to track the titles of the displayed books
                limitedRecommendations.forEach(book => shownTitles.add(book.title));

                // Update recommendations with new limited books
                setRecommendations(limitedRecommendations);
            } else {
                console.log('No new unique recommendations.');
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            handleMessage(error);
        } finally {
            setLoading(false);
        }
    };

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

            // Fetch recommendations for the user
            fetchRecommendations(userId);

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
    );

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

    const renderRecommendations = () => (
        <HomeScreenContainer>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <HomePageTitle>Recommended Books</HomePageTitle>
                <TouchableOpacity onPress={handleRefresh}>
                    <Ionicons name="refresh" size={24} color="#007BFF" />
                </TouchableOpacity>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" />
            ) : recommendations.length > 0 ? (
                <FlatList
                    data={recommendations}
                    keyExtractor={(item) => item.title}
                    renderItem={renderBook}
                />
            ) : (
                <Text>No recommendations available</Text>
            )}
        </HomeScreenContainer>
    );

    const renderBook = ({ item }) => (
        <HomeBookContainer>
            <HomeBookCoverImage source={{ uri: item.coverLink }} />
            <HomeBookInfo>
                <Text>{item.title}</Text>
                <Text>{item.authors.join(', ')}</Text>
                {/* Truncate the description to fit within the space */}
                <Text numberOfLines={2} ellipsizeMode="tail">{item.description}</Text>
            </HomeBookInfo>
        </HomeBookContainer>
    );

    const handleRefresh = () => {
        // Clear previously shown titles for a new refresh
        setShownTitles(new Set());
        const userId = "67294061ece304319361a3c6"; // Replace with actual user ID
        fetchRecommendations(userId);
    };

    return (
        <FlatList
            data={[]}
            ListHeaderComponent={
                <StyledContainer home={true}>
                    {renderHeader()}
                    {renderOtherReviews()}
                    {renderRecommendations()}
                </StyledContainer>
            }
            keyExtractor={(item, index) => index.toString()}
        />
    );
};

export default Home;
