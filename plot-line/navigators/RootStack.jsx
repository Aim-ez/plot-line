import React from 'react';

//React navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// screens
import Login from '../app/screens/Login';
import Signup from '../app/screens/Signup';
import Welcome from '../app/screens/Welcome';
import TabLayout from '../app/(tabs)/_layout';

const Stack = createStackNavigator();

const RootStack = () => {
    return(
        <NavigationContainer independent={true}>
            <Stack.Navigator                
                screenOptions={{
                    headerShown: false
                }}
                initialRouteName="Welcome"
            >
                <Stack.Screen name="TabLayout" component={TabLayout}/>
                <Stack.Screen name="Login" component={Login}/>
                <Stack.Screen name="Signup" component={Signup}/>
                <Stack.Screen name="Welcome" component={Welcome}/>

            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default RootStack;