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

const Welcome = ({navigation}) => {
    return (
        <StyledContainer>
            <StatusBar style="dark"/>
                <InnerContainer>
                    <PageLogo source={require('../../assets/images/PlotLogo.png')}/>
                    <PageTitle welcome={true}>Welcome to PlotLine</PageTitle>
                    <SubTitle>Insert Witty Subtitle</SubTitle>

                    <WelcomeContainer>
                        <StyledFormArea>
                            <Avatar resizeMode="cover" source={require('../../assets/images/books.png')}/>
                            <Line />
                            <StyledButton onPress={() => navigation.navigate('Login')}>
                                <ButtonText>Get Started</ButtonText>
                            </StyledButton>                            
                        </StyledFormArea>
                    </WelcomeContainer>
                </InnerContainer>
        </StyledContainer>
    );
}

export default Welcome;