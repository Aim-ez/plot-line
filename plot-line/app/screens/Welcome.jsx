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

const Welcome = ({navigation}) => {
    return (
        <ScrollView>
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
        </ScrollView>
    );
}

export default Welcome;