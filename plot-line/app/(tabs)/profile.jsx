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
} from '../../components/styles';

const Profile = ({ navigation }) => {
    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);

    // Provide fallback values if `storedCredentials` is null
    const name = storedCredentials?.name || 'NAME SHOULD BE HERE';
    const username = storedCredentials?.username || 'USER NAME HERE';
    const email = storedCredentials?.email || 'EMAIL HERE';

    // Clear login credentials
    const clearLogin = async () => {
        try {
            await AsyncStorage.removeItem('plotlineCredentials');
            setStoredCredentials(null);
        } catch (error) {
            console.error('Error clearing login credentials:', error);
        }
    };

    // Render sections to keep JSX clean
    const renderSection = (title, subtitle, buttonText, buttonAction, isComingSoon = false) => (
        <InnerContainer>
            <SubTitle>{title}</SubTitle>
            {subtitle && <SubTitle profile={true}>{subtitle}</SubTitle>}
            <StyledButton onPress={buttonAction} disabled={isComingSoon}>
                <ButtonText>{buttonText}</ButtonText>
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

    return (
        <ScrollView>
            <StyledContainer>
                <StatusBar style="dark" />
                <PageTitle>Profile</PageTitle>
                <Line thick={true} />
                {renderSection('Your Reviews', null, 'See Reviews', () => navigation.navigate('UserReviews'))}
                <Line />
                {renderSection('Your Favourites', 'Feature coming soon!', 'See Favourites', null, true)}
                <Line />
                {renderUserInfo()}
            </StyledContainer>
        </ScrollView>
    );
};

export default Profile;
