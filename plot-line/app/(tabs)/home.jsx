import React, {useContext, useState} from 'react';
import { StatusBar } from 'expo-status-bar'

// Host URL
import { HostURL } from '../../constants/URL.ts'

import axios from 'axios';

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
    PageLogo,
    TextLink,
    TextLinkContent,
    SearchBar,
    MsgBox,
    HeaderImage
} from '../../components/styles';
import { ScrollView } from 'react-native';

import OthersReviews from '../screens/OthersReviews.jsx'

const Home = ({navigation}) => {
    const url = HostURL + "/user/getUserIDByUsername";

    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [query, setQuery] = useState('')
    const [userId, setUserId] = useState([])

    //context -> will be important later
    //const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
    //const { name, username, email } = storedCredentials;

    const fetchUser = async () => {
        setMessage(null);
        try {
            const res = await axios.get(url, { params: { username: query}})
            navigation.navigate("OthersReviews", { userId: res.data.data._id, handle: query})
        } catch (error) {
            handleMessage(error);
        }
    }

    const handleMessage = (error, type = 'FAILED') => {
        const errorMessage = error?.response?.data?.message || error?.message || 'An unexpected error occurred';
        setMessage(errorMessage);
        setMessageType(type);
    }

    return ( 
        <ScrollView>
            <StyledContainer home={true}>
            <StatusBar style="dark"/>
                <InnerContainer>
                    <HeaderImage source={require('../../assets/images/books2.png')}/>
                    <PageTitle>Need a new read?</PageTitle>
                    <SubTitle>See what others are reviewing:</SubTitle>
                    <SearchBar
                        placeholder="Search by username to see others' reviews!"
                        value={query}
                        onChangeText={setQuery}
                    />
                    <MsgBox type={messageType}>{message}</MsgBox>

                    <StyledButton onPress={fetchUser}>
                        <ButtonText>See {query} reviews</ButtonText>
                    </StyledButton>
                    <Line />
                </InnerContainer>
                <InnerContainer>
                    <PageTitle>Your Homepage</PageTitle>
                    <SubTitle>More Features Coming Soon</SubTitle>
                        <PageLogo source={require('../../assets/images/PlotLogo.png')}/>
                </InnerContainer>
            </StyledContainer>
        </ScrollView>
    );
}

export default Home;

