import React, { useState, useEffect } from 'react';
import { ScrollView, Text, FlatList, ActivityIndicator, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import { HostURL } from '../../constants/URL.ts';
import { Ionicons } from '@expo/vector-icons';

import { 
    HomeScreenContainer, 
    HomeScreenHeader, 
    HomeBookContainer, 
    HomeBookCoverImage, 
    HomeBookInfo, 
    HomePageTitle, 
    SearchBar, 
    MsgBox, 
    ButtonText, 
    StyledButton 
} from '../../components/styles';

const Home = ({ navigation }) => {
    const url = `${HostURL}/user/getUserIDByUsername`;

    // State for query, messages, and message types
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
        setMessage(null);

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

            // Navigate to the user reviews page
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
        <HomeScreenHeader>
            <Text>Recommended Books</Text>
        </HomeScreenHeader>
    );

    const renderOtherReviews = () => (
        <HomeScreenContainer>
            <HomePageTitle>Need a new read?</HomePageTitle>
            <SearchBar
                placeholder="Search by username to see others' reviews!"
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={fetchUser}
                returnKeyType="search"
            />
            <MsgBox type={messageType}>{message}</MsgBox>
            <StyledButton onPress={fetchUser}>
                <ButtonText>See {query ? `${query}'s reviews` : 'reviews'}</ButtonText>
            </StyledButton>
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

    const handleRefresh = () => {
        // Clear previously shown titles for a new refresh
        setShownTitles(new Set());
        const userId = "67294061ece304319361a3c6"; // Replace with actual user ID
        fetchRecommendations(userId);
    };

    return (
        <ScrollView>
            <HomeScreenContainer>
                {renderHeader()}
                {renderOtherReviews()}
                {renderRecommendations()}
            </HomeScreenContainer>
        </ScrollView>
    );
};

export default Home;
