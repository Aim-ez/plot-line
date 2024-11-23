import React, {useState, useContext} from 'react';
import { StatusBar } from 'expo-status-bar'

// async storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// credentials context
import { CredentialsContext } from '../../components/CredentialsContext';

//formik
import { Formik } from 'formik';
import { View, ScrollView } from 'react-native';

// icons
import { Octicons, Ionicons } from '@expo/vector-icons';

// keyboard avoid wrapper
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';

// API client
import axios from 'axios';

// Host URL
import { HostURL } from '../../constants/URL.ts'

import {
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle,
    SubTitle,
    StyledFormArea,
    LeftIcon, 
    RightIcon,
    StyledInputLabel,
    StyledTextInput,
    StyledButton,
    ButtonText,
    Colors,
    MsgBox,
    Line,
    ExtraView,
    ExtraText,
    TextLink,
    TextLinkContent
} from '../../components/styles';

const {brand, darkLight, primary} = Colors;

const Login = ({navigation}) => {
    const url = HostURL + "/user/login"


    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [submitting, setSubmitting] = useState();

    // context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);

    const handleLogin = (credentials) => {
        handleMessage(null); // Reset error message

            // Convert email to lowercase for case-insensitive comparison
        const normalizedCredentials = {
            ...credentials,
            email: credentials.email.toLowerCase()
        };
        
        axios.post(url, normalizedCredentials)
        .then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== 'SUCCESS') {
                handleMessage(message, status);
            } else {
                console.log("LOGIN SUCESSFUL")
                persistLogin(data[0], message, status); // IF DOING GOOGLE SIGN IN, REWATCH KEEPING USER LOGGED IN
            }
            setSubmitting(false);
        })
        .catch(error => {
            console.log(error);
            setSubmitting(false);
            handleMessage("An error occurred. check your network and try again.");
        })
    }

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    const persistLogin = (credentials, message, status) => {
        AsyncStorage.setItem('plotlineCredentials', JSON.stringify(credentials))
        .then(() => {
            handleMessage(message, status);
            setStoredCredentials(credentials);
        })
        .catch((error => {
            console.log(error);
            handleMessage('Persisting login failed');
        }))
    }

    return (
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <StatusBar style="dark"/>
                <ScrollView>
                    <InnerContainer>
                        <PageLogo source={require('../../assets/images/PlotLogo.png')}/>
                        <PageTitle>Login</PageTitle>
                        <SubTitle>Login to Your Account</SubTitle>
                        <Formik
                            initialValues={{email: '', password: ''}}
                            onSubmit={(values) => {
                                if (values.email == '' || values.password == '') {
                                    handleMessage('Please fill in all the fields');
                                    setSubmitting(false);
                                } else {
                                    setSubmitting(true);
                                    handleLogin(values);
                                }
                            }}
                        >{({handleChange, handleBlur, handleSubmit, values}) => (<StyledFormArea>
                            <MyTextInput 
                                label="Email Address"
                                icon="mail"
                                placeholder="example@gmail.com"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                keyboardType="email-address"
                            />
                            <MyTextInput 
                                label="Password"
                                icon="lock"
                                placeholder="* * * * * * * * * * * * *"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                secureTextEntry={hidePassword}
                                isPassword={true}
                                hidePassword={hidePassword}
                                setHidePassword={setHidePassword}
                                returnKeyType="done"
                                onSubmitEditing={handleSubmit} // Submit the form
                            />
                            <MsgBox type={messageType}>{message}</MsgBox>
                            {!submitting && (
                                <StyledButton onPress={handleSubmit}>
                                    <ButtonText>Login</ButtonText>
                                </StyledButton>
                            )}
                            {submitting && (
                                <StyledButton disabled={true}>
                                     <Ionicons name={'ellipse-outline'} size={30} color={primary}/>
                                </StyledButton>
                            )}
                            <Line />
                            <ExtraView>
                            <ExtraText>Don't have an account already?</ExtraText> 
                            <TextLink onPress={() => navigation.navigate('Signup')}>
                                    <TextLinkContent>Signup</TextLinkContent>
                            </TextLink>
                            </ExtraView>

                        </StyledFormArea>)}

                        </Formik>
                    </InnerContainer>
                </ScrollView>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
}

const MyTextInput = ({label, icon, isPassword, hidePassword, setHidePassword, ...props}) => {
    return (<View >

        <StyledInputLabel>{label}</StyledInputLabel>
        
        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <LeftIcon>
                <Octicons name={icon} size={30} color={brand}/>
            </LeftIcon>
            <StyledTextInput {...props}/>
            {isPassword && (
                <RightIcon onPress={() => setHidePassword(!hidePassword)}>
                    <Ionicons name={hidePassword ? 'eye-off' : 'eye'}size={30} color={darkLight}/>
                </RightIcon>
            )}
        </View>

    </View>)
}

export default Login;


/*
                            <StyledButton google={true} onPress={handleSubmit}>
                                <Fontisto name="google" color={primary} size={22}/>
                                <ButtonText google={true}>Sign in with Google</ButtonText>
                            </StyledButton>
*/