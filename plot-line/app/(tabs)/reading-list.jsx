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

const ReadingList = ({navigation}) => {
    //context -> will be important later
    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
    const { name, username, email } = storedCredentials;


    return (
        <ScrollView>
            <StyledContainer>
            <StatusBar style="dark"/>
                <InnerContainer>
                    <PageTitle>Your Reading List</PageTitle>
                    <SubTitle>Features Coming Soon</SubTitle>

                    <WelcomeContainer>
                        <StyledFormArea>
                        <PageLogo source={require('../../assets/images/PlotLogo.png')}/>
                            <Line />
                            <StyledButton onPress={() => navigation.navigate('Home')}>
                                <ButtonText>Useless Button!!</ButtonText>
                            </StyledButton>                            
                        </StyledFormArea>
                    </WelcomeContainer>
                </InnerContainer>
            </StyledContainer>
        </ScrollView>
    );
}

export default ReadingList;

