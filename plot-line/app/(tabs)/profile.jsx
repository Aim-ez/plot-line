import React, {useState, useContext} from 'react';
import { StatusBar } from 'expo-status-bar'

// async storage
import AsyncStorage  from '@react-native-async-storage/async-storage'

// credntials context
import { CredentialsContext } from '../../components/CredentialsContext.jsx'

// API client
import axios from 'axios';

// Host URL
import { HostURL } from '../../constants/URL.ts'

import {
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle,
    SubTitle,
    StyledFormArea,
    StyledButton,
    ButtonText,
    Line,
    WelcomeContainer,
    Avatar,
    ReviewBox,
    TextLink,
    TextLinkContent
} from '../../components/styles';
import { ScrollView } from 'react-native';

const Profile = ({navigation}) => {
    const url = HostURL + "/user/profile";

    //context -> will be important later
    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
    const { name, username, email, _id } = storedCredentials;
    let numReviews = 0;

    const clearLogin = () => {
        AsyncStorage.removeItem('plotlineCredentials')
        .then(() => {
            setStoredCredentials("");
        })
        .catch(error => console.log(error))
    }


    const handleMessage = (message, type = 'FAILED') => {
        console.log(type);
        console.log(message);
    }

    return (
        <ScrollView>
            <StyledContainer>
                <StatusBar style="dark"/>
                <PageTitle>Profile</PageTitle>
                <Line thick={true}></Line>
                    <InnerContainer>

                        <SubTitle>Your Reviews</SubTitle>
                        <StyledButton onPress={() => navigation.navigate("UserReviews")}>
                            <ButtonText>See Reviews</ButtonText>
                        </StyledButton>

                    </InnerContainer>

                    <Line></Line>

                    <InnerContainer>
                        <SubTitle>Your Favourites</SubTitle>
                        <SubTitle profile={true}>Feature coming soon!</SubTitle>
                        <StyledButton>
                            <ButtonText>See Favourites</ButtonText>
                        </StyledButton>

                    </InnerContainer>

                    <Line></Line>

                    <InnerContainer>
                        <SubTitle>Information</SubTitle>
                        <InnerContainer>
                            <SubTitle profile={true}>{name || 'NAME SHOULD BE HERE'}</SubTitle>
                            <SubTitle profile={true}>@{username || 'USER NAME HERE'}</SubTitle>
                            <SubTitle profile={true}>{email || 'EMAIL HERE'}</SubTitle>
                            <Line />
                            <StyledButton onPress={clearLogin}>
                                <ButtonText>Logout</ButtonText>
                            </StyledButton>      
                        </InnerContainer>
                    </InnerContainer>
            </StyledContainer>
        </ScrollView>
    );
}

export default Profile;