import React from 'react';

//React navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// credentials context
import { CredentialsContext } from '../components/CredentialsContext';

// screens
import Login from '../app/screens/Login';
import Signup from '../app/screens/Signup';
import Welcome from '../app/screens/Welcome';
import TabLayout from '../app/(tabs)/_layout';

const Stack = createStackNavigator();

const RootStack = () => {
    return(
        <CredentialsContext.Consumer> 
            {({ storedCredentials }) => (
                <NavigationContainer independent={true}>
                    <Stack.Navigator                
                        screenOptions={{
                            headerShown: false
                        }}
                        initialRouteName="Welcome"
                    >

                    {storedCredentials ? 
                        <Stack.Screen name="TabLayout" component={TabLayout}/>
                        : <>
                        <Stack.Screen name="Welcome" component={Welcome}/>
                        <Stack.Screen name="Login" component={Login}/>
                        <Stack.Screen name="Signup" component={Signup}/>
                        </>
                    }

                    </Stack.Navigator>
                </NavigationContainer>

            )}
        </CredentialsContext.Consumer>



    );
}

export default RootStack;