import React, {useState, useContext} from 'react';
import { StatusBar } from 'expo-status-bar';

// async storage
import AsyncStorage  from '@react-native-async-storage/async-storage'

// credntials context
import { CredentialsContext } from '../../components/CredentialsContext.jsx'

import {
    StyledContainer,
    InnerContainer,
    PageTitle,
    SubTitle,
    StyledFormArea,
    StyledButton,
    ButtonText,
    Line,
    WelcomeContainer,
    PageLogo
} from '../../components/styles';
import { ScrollView } from 'react-native';

const ReviewGoogleBook = ({navigation}) => {
    //context -> will be important later
    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
    const { name, username, email } = storedCredentials;


    return (
        <ScrollView>
            <StyledContainer>
            <StatusBar style="dark"/>
                <InnerContainer>
                    <PageTitle>Review Google Book</PageTitle>
                    <SubTitle>Features Coming Soon</SubTitle>
                    <PageLogo source={require('../../assets/images/PlotLogo.png')}/>
                    <Line />   
                </InnerContainer>
            </StyledContainer>
        </ScrollView>
    );
}

export default ReviewGoogleBook;

