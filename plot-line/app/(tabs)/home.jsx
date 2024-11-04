import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar'

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

const Home = ({navigation}) => {
    return (
        <ScrollView>
            <StyledContainer>
            <StatusBar style="dark"/>
                <InnerContainer>
                    <PageTitle>Your Homepage</PageTitle>
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

export default Home;

