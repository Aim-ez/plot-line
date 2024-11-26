import React from 'react';
import { View } from 'react-native';
import { Octicons, Ionicons } from '@expo/vector-icons';

import {
  StyledInputLabel,
  StyledTextInput,
  LeftIcon,
  RightIcon,
  Colors,
} from './styles';

const { brand, darkLight } = Colors;

const TextInput = ({label, icon, isPassword, hidePassword, setHidePassword, ...props}) => {
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

export default TextInput;