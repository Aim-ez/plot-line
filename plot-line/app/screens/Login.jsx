import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar'



//formik
import { Formik } from 'formik';
import { View, ScrollView } from 'react-native';

// icons
import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons';

// keyboard avoid wrapper
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

const Login = ({navigation}) => {
    const [hidePassword, setHidePassword] = useState(true);

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
                                console.log(values);
                                navigation.navigate("TabLayout");
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
                            />
                            <MsgBox>...</MsgBox>
                            <StyledButton onPress={handleSubmit}>
                                <ButtonText>Login</ButtonText>
                            </StyledButton>
                            <Line />
                            <StyledButton google={true} onPress={handleSubmit}>
                                <Fontisto name="google" color={primary} size={22}/>
                                <ButtonText google={true}>Sign in with Google</ButtonText>
                            </StyledButton>
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