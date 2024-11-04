import React, {useState, useContext} from 'react';
import { StatusBar } from 'expo-status-bar'

//formik
import { Formik } from 'formik';
import { View, ScrollView } from 'react-native';

// API client
import axios from 'axios';

// Async storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// credential contexts
import { CredentialsContext } from '../../components/CredentialsContext';

// icons
import { Octicons, Ionicons } from '@expo/vector-icons';

// keyboard avoiding wrapper
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';

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

const Signup = ({navigation}) => {
    const url = "http://172.30.128.198:3000/user/signup" // CHANGE IF IP ADDRESS CHANGES

    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [submitting, setSubmitting] = useState();
   
    // context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);

    const handleSignup = (credentials) => {
        handleMessage(null); // Reset error message
        
        axios.post(url, credentials)
        .then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== 'SUCCESS') {
                handleMessage(message, status);
            } else {
                console.log("SIGNUP SUCESSFUL")
                persistLogin(data, message, status); // IF DOING GOOGLE SIGN IN, REWATCH KEEPING USER LOGGED IN
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
                        <PageTitle>Sign Up</PageTitle>
                        <SubTitle>Create Your Account</SubTitle>
                        <Formik
                            initialValues={{name: '', username: '', confirmPassword: '', email: '', password: ''}}
                            onSubmit={(values) => {
                                if (
                                    values.email == '' || 
                                    values.password == '' || 
                                    values.username== '' || 
                                    values.confirmPassword == '' || 
                                    values.name == ''
                                ) {
                                    handleMessage('Please fill in all the fields');
                                    setSubmitting(false);
                                } else if (values.password !== values.confirmPassword) {
                                    handleMessage('Passwords do not match.');
                                    setSubmitting(false);
                                } else {
                                    setSubmitting(true);
                                    handleSignup(values);
                                }
                            }}
                        >{({handleChange, handleBlur, handleSubmit, values}) => (<StyledFormArea>
                            <MyTextInput 
                                label="Full Name"
                                icon="person"
                                placeholder="John Doe"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                                value={values.name}
                            />
                            <MyTextInput 
                                label="Username"
                                icon="mention"
                                placeholder="johndoe"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('username')}
                                onBlur={handleBlur('username')}
                                value={values.username}
                            />
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
                            />
                            <MyTextInput 
                                label="Confirm Password"
                                icon="lock"
                                placeholder="* * * * * * * * * * * * *"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('confirmPassword')}
                                onBlur={handleBlur('confirmPassword')}
                                value={values.confirmPassword}
                                secureTextEntry={hidePassword}
                                isPassword={true}
                                hidePassword={hidePassword}
                                setHidePassword={setHidePassword}
                            />
                            <MsgBox type={messageType}>{message}</MsgBox>
                            {!submitting && (
                                <StyledButton onPress={handleSubmit}>
                                    <ButtonText>Sign Up</ButtonText>
                                </StyledButton>
                            )}
                            {submitting && (
                                <StyledButton disabled={true}>
                                     <Ionicons name={'ellipse-outline'} size={30} color={primary}/>
                                </StyledButton>
                            )}
                            <Line />

                            <ExtraView>
                            <ExtraText>Already have an account?</ExtraText> 
                            <TextLink onPress={() => navigation.navigate("Login")}>
                                    <TextLinkContent>Login</TextLinkContent>
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

export default Signup;