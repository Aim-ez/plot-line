import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar'

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

const Profile = ({navigation}) => {

    return (
        <ScrollView>
            <StyledContainer>
                <StatusBar style="dark"/>
                    <InnerContainer>
                        <PageTitle>Profile</PageTitle>
                        <SubTitle>Current User</SubTitle>
                        <InnerContainer>
                            <SubTitle profile={true}>FULL NAME HERE</SubTitle>
                            <SubTitle profile={true}>USER NAME HERE</SubTitle>
                            <SubTitle profile={true}>EMAIL HERE</SubTitle>
                            <Line />
                            <StyledButton onPress={() => navigation.navigate('Login')}>
                                <ButtonText>Logout</ButtonText>
                            </StyledButton>      
                        </InnerContainer>
                    </InnerContainer>
            </StyledContainer>
        </ScrollView>
    );
}

export default Profile;