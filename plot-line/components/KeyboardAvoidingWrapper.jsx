import React from 'react';

import { KeyboardAvoidingView, ScrollView, Pressable, Keyboard } from 'react-native';

const KeyboardAvoidingWrapper = ({children}) => {
    return (
        <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
            <ScrollView>
                <Pressable onPress={Keyboard.dismiss}>
                    {children}
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default KeyboardAvoidingWrapper;