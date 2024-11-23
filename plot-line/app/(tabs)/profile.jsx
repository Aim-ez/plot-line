import React, {useContext} from 'react';
import { StatusBar } from 'expo-status-bar'

// async storage
import AsyncStorage  from '@react-native-async-storage/async-storage'

// credntials context
import { CredentialsContext } from '../../components/CredentialsContext.jsx'

import {
    StyledContainer,
    InnerContainer,
    PageTitle,
    SubTitle,
    StyledButton,
    ButtonText,
    Line,
} from '../../components/styles';
import { ScrollView } from 'react-native';

const Profile = ({navigation}) => {
    //context -> will be important later
    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
    const { name, username, email} = storedCredentials;

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