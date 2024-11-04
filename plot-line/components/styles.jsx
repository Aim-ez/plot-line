import styled from "styled-components/native";
import { View, Text, Image, TouchableOpacity, TextInput} from 'react-native'
import Constants from 'expo-constants'

const StatusBarHeight = Constants.statusBarHeight;

// colors
/*
const Colors = {
    primary: '#708C37',
    secondary: '#A574D5',
    tertiary: '#ffffff',
    text: '#000',
    background: 'EFEBF9',
}
*/

export const Colors = {
    primary: '#ffffff',
    secondary: '#E5E7EB',
    tertiary: '#1F2937',
    darkLight: '#9CA3AF',
    brand: '#6D28D9',
    green: '#10B981',
    red: '#EF4444',
};

const { primary, secondary, tertiary, darkLight, brand, green, red } = Colors;

export const StyledContainer = styled.View`
    flex: 1;
    padding: 5px;
    padding-top: ${StatusBarHeight + 10}px;
    background-color: ${primary};
    padding-bottom: 120px;
`;

export const InnerContainer = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
`;

export const WelcomeContainer = styled.View`
    padding: 25px;
    padding-top: 10px;
    justify-content: center;
    align-items: center;
`;

export const PageLogo = styled.Image`
    width: 250px;
    height: 130px;
    resize-mode: contain;


    ${(props) => props.search && `
        width: 200px;
        height: 100px;
        resize-mode: contain;
    `}
`;

export const Avatar = styled.Image`
    width: 400px;
    height: 400px;
    margin: auto;
    border-radious: 50px;
    border-color: ${secondary};
    margin-bottom: 10px;
    margin-top: 10px;
`;

export const PageTitle = styled.Text`
    font-size: 30px;
    text-align: center;
    font-weight: bold;
    color: ${brand};
    padding: 10px;

    ${(props) => props.welcome && `
        font-size: 35px;
    `}
`;

export const SubTitle = styled.Text`
    font-size: 18px;
    margin-bottom: 20px;
    letter-spacing: 1px;
    font-weight: bold;
    color: ${tertiary};

    ${(props) => props.welcome && `
        margin-bottom: 5px;
        font-weight: normal;
    `}


    ${(props) => props.profile && `
        margin-bottom: 10px;
        font-weight: normal;
    `}
`;

export const StyledFormArea = styled.View`
    width: 90%;
`;

export const StyledTextInput = styled.TextInput`
    flex: 1;
    background-color: ${secondary};
    padding: 15px;
    padding-left: 55px;
    padding-right: 55px;
    border-radius: 5px;
    border-color: ${primary};
    font-size: 16px;
    height: 60px;
    margin-vertical: 3px;
    margin-bottom: 10px;
    color: ${tertiary};
`;

export const StyledInputLabel = styled.Text`
    color: ${tertiary};
    font-size: 13px;
    text-align: left;
    margin-top: 30px;
`;

export const LeftIcon = styled.View`
    left: 15px;
    top: 17px;
    position: absolute;
    z-index: 1;
`;

export const RightIcon = styled.TouchableOpacity`
    right: 35px;
    top:18px;
    position: absolute;
    z-index: 1;
`;

export const StyledButton = styled.TouchableOpacity`
    padding: 15px;
    background-color: ${brand};
    justify-content: center;
    align-items: center;
    border-radius: 65px;
    margin-vertical: 15px;
    height: 60px;

    ${(props) => props.google == true && `
        background-color: ${green};
        flex-direction: row;
        justify-content: center;
        align-items: center;
    `}
`;

export const ButtonText = styled.Text`
    color: ${primary};
    font-size: 16px;
    ${(props) => props.google == true && `
        padding: 20px;
    `}
`;

export const MsgBox = styled.Text`
    text-align: center;
    font-size: 13px;
    color: ${props => props.type == 'SUCCESS' ? green : red};
`;

export const Line = styled.View`
    height: 1px;
    width: 100%;
    background-color: ${darkLight};
    margin-vertical: 10px;
`;

export const ExtraView = styled.View`
        justify-content: center;
        flex-direction: row;
        align-items: center;
        padding: 10px;
`;

export const ExtraText = styled.Text`
        justify-content: center;
        align-content: center;
        color: ${tertiary};
        font-size: 15px;
`;

export const TextLink = styled.TouchableOpacity`
        justify-content: center;
        align-items: center;
`;

export const TextLinkContent = styled.Text`
        color: ${brand};
        font-size: 15px;
        padding-left: 20px;
`;

export const SearchBar = styled.TextInput`
    height: 40px;
    border-color: '#A574D5';
    border-width: 1px;
    width: '100%';
    padding-horizontal: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    background-color: '#fff';
`;