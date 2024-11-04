import React, {useState, useContext} from 'react';
import { StatusBar } from 'expo-status-bar'

// async storage
import AsyncStorage  from '@react-native-async-storage/async-storage'

// credntials context
import { CredentialsContext } from '../../components/CredentialsContext.jsx'

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
    Avatar
} from '../../components/styles';
import { ScrollView } from 'react-native';

const Profile = () => {
    //context -> will be important later
    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
    const { name, username, email } = storedCredentials;

    const clearLogin = () => {
        AsyncStorage.removeItem('plotlineCredentials')
        .then(() => {
            setStoredCredentials("");
        })
        .catch(error => console.log(error))
    }

    return (
        <ScrollView>
            <StyledContainer>
                <StatusBar style="dark"/>
                    <InnerContainer>
                        <PageTitle>Profile</PageTitle>
                        <SubTitle>Current User</SubTitle>
                        <InnerContainer>
                            <SubTitle profile={true}>{name || 'NAME SHOULD BE HERE'}</SubTitle>
                            <SubTitle profile={true}>{username || 'USER NAME HERE'}</SubTitle>
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