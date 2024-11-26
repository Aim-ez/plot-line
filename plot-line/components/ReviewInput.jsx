import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  StyledInputLabel,
  StyledTextInput,
  LeftIcon,
  Colors,
} from './styles';

const { brand } = Colors;

const ReviewInput = ({label, icon, ...props}) => {
    return (<View >

        <StyledInputLabel>{label}</StyledInputLabel>
        
        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <LeftIcon>
                <Ionicons name={icon} size={30} color={brand}/>
            </LeftIcon>
            <StyledTextInput {...props}/>
        </View>

    </View>)
}

export default ReviewInput;