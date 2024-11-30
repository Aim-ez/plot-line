import React, { useContext, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native';
import { HostURL } from '@/constants/URL.js';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

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
    AuthorText,
    DeleteIcon,
    Colors,
    StyledTextInput,
    FlexRowContainer
} from '../../components/styles';
const {red, tertiary} = Colors;

import { View } from 'react-native';

const Profile = ({ navigation }) => {
    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);

    // Provide fallback values if `storedCredentials` is null
    const name = storedCredentials?.name || 'NAME SHOULD BE HERE';
    const username = storedCredentials?.username || 'USER NAME HERE';
    const email = storedCredentials?.email || 'EMAIL HERE';
    const {_id} = storedCredentials || '00000';
    const getFavURL = HostURL + "/user/getFavourite";
    const getBookURL = HostURL + "/user/getBook";
    const clearFavURL = HostURL + "/user/clearFavourite";
    const getAboutMeURL = HostURL + "/user/getAboutMe";
    const updateAboutMeURL = HostURL + "/user/updateAboutMe";
    const nav = useNavigation();


    const [favorite, setFavorite] = useState(false);
    const [aboutMe, setAboutMe] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [aboutMeInput, setAboutMeInput] = useState('');

    


    useEffect(() => {
        const unsubscribe = nav.addListener('tabPress', () => {
            fetchFavorite();
            fetchAboutMe();
        });
    
        return unsubscribe; // Cleanup listener
      }, [nav]);

    useEffect(() => {
        fetchFavorite();
        fetchAboutMe();
    }, [_id]);

    const fetchFavorite = async () => {
        try {
            const response = await axios.get(getFavURL, { params: { userId: _id } });
    
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
            const response = await axios.get(getAboutMeURL, { params: { userId: _id } });
            if (response.data.status === "SUCCESS") {
                setAboutMe(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching 'About Me':", error);
        }
    };


    const updateAboutMe = async () => {
        try {
            const response = await axios.post(updateAboutMeURL, { userId: _id, aboutMe: aboutMeInput });
            if (response.data.status === "SUCCESS") {
                setAboutMe(aboutMeInput);
                setIsEditing(false);
            } else {
                console.error("Error updating 'About Me':", response.data.message);
            }
        } catch (error) {
            console.error("Error updating 'About Me':", error);
        }
    };

    // Clear login credentials
    const clearLogin = async () => {
        try {
            await AsyncStorage.removeItem('plotlineCredentials');
            setStoredCredentials(null);
        } catch (error) {
            console.error('Error clearing login credentials:', error);
        }
    };

    const goToDetails = (book) => {
        navigation.navigate('BookDetails', { book: book, fromReview: true})
    }

    // Render sections to keep JSX clean
    const renderReviews = () => (
        <InnerContainer>
            <SubTitle>Your Reviews</SubTitle>
            <StyledButton onPress ={() => navigation.navigate('UserReviews')}>
                <ButtonText>View Your Reviews</ButtonText>
            </StyledButton>
        </InnerContainer>
    );

    const renderUserInfo = () => (
        <InnerContainer>
            <SubTitle>Information</SubTitle>
            <InnerContainer>
                <SubTitle profile={true}>{name}</SubTitle>
                <SubTitle profile={true}>@{username}</SubTitle>
                <SubTitle profile={true}>{email}</SubTitle>
                <Line />
                <StyledButton onPress={clearLogin}>
                    <ButtonText>Logout</ButtonText>
                </StyledButton>
            </InnerContainer>
        </InnerContainer>
    );

    const removeFavorite = async() => {
        const dataToSend = {
            userId: _id,
          }

        const response = await axios.post(clearFavURL, dataToSend)
        if (response.data.status === "SUCCESS") {
            setFavorite(null);
        } else {
            console.error("Error deleting book in reading-list.jsx")
        }
    }

        // Render sections to keep JSX clean
        const renderFavourite = () => (
            <InnerContainer>
                <SubTitle>Your Favourite Book</SubTitle>
                {renderBook(favorite)}
                <DeleteIcon onPress={() => removeFavorite()}>
                    <Ionicons name="trash" color={red}/>
                </DeleteIcon>
            </InnerContainer>
        );
    

        const renderAboutMe = () => (
            <InnerContainer>
                <SubTitle>About Me</SubTitle>
                {isEditing ? (
                    <>
                        <StyledTextInput
                            about = {true}
                            multiline
                            maxLength={500}
                            value={aboutMeInput}
                            onChangeText={(text) => setAboutMeInput(text)}
                        />
                        <FlexRowContainer>
                            <StyledButton about={true} onPress={updateAboutMe}>
                                <ButtonText >Save</ButtonText>
                            </StyledButton>
                            <StyledButton about={true} onPress={() => setIsEditing(false)}>
                                <ButtonText>Cancel</ButtonText>
                            </StyledButton>
                        </FlexRowContainer>
                    </>
                ) : (
                    <>
                        <ExtraText>{aboutMe || `Tell us about yourself!`}</ExtraText>
                        <DeleteIcon onPress={() => {
                            setIsEditing(true);
                            setAboutMeInput(aboutMe);
                        }}>
                            <Ionicons name="pencil" color={tertiary}/>
                         </DeleteIcon>
                    </>
                )}
            </InnerContainer>
        );
    
        const renderCurrentlyReading = () => (
            <InnerContainer>
                <SubTitle>Currently Reading...</SubTitle>
                <SubTitle profile={true}>Feature coming soon!</SubTitle>
                <ExtraText>*Insert book similar to reading list*</ExtraText>
            </InnerContainer>
        )

        const renderBook = (book) => {
            if (!book) {
                return <ExtraText>No favorite book found.</ExtraText>;
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
        
    
        return (
            <ScrollView>
                <StyledContainer>
                    <PageTitle>Your Profile</PageTitle>
                    <Line />
                    {renderReviews()}
                    <Line />
                    {renderFavourite()}
                    <Line />
                    {renderAboutMe()}
                    <Line />
                    {renderCurrentlyReading()}
                    <Line />
                    {renderUserInfo()}
                </StyledContainer>
            </ScrollView>
        );
};

export default Profile;
