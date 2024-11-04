import React, {useContext} from 'react'
import { Tabs, Redirect } from 'expo-router'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Colors } from '@/components/styles.jsx'
import { Ionicons } from '@expo/vector-icons'

// async storage
import AsyncStorage  from '@react-native-async-storage/async-storage'

// credntials context
import { CredentialsContext } from '../../components/CredentialsContext.jsx'


// import Tab screens
import HomeScreen from './home.jsx'
import ProfileScreen from './profile.jsx'
import ReadingListScreen from './reading-list.jsx'
import SearchScreen from './search.jsx'

const Tab = createBottomTabNavigator();

const TabLayout = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {
          backgroundColor: Colors?.primary,
          borderTopColor: Colors?.brand,
          borderTopWidth: 2,
          height: 80
        },
        tabBarItemStyle: {
          margin: 1,
          padding: 1
        },
        tabBarInactiveTintColor: Colors?.tertiary + "cc",
        tabBarActiveTintColor: Colors?.brand,
        tabBarIcon: ({size, color}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home'
          } else if (route.name === 'Search') {
            iconName = 'search'
          } else if (route.name === 'Reading List') {
            iconName = 'list'
          } else if (route.name === 'Profile') {
            iconName = 'person'
          }
          return <Ionicons name={iconName} size={size} color={color}/>

        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen}/>
      <Tab.Screen name="Search" component={SearchScreen}/>
      <Tab.Screen name="Reading List" component={ReadingListScreen}/>
      <Tab.Screen name="Profile" component={ProfileScreen}/>
    </Tab.Navigator>
  )
}

export default TabLayout

