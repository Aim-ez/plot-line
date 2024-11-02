import React from 'react'
import { Tabs, Redirect } from 'expo-router'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'


// import Tab screens
import HomeScreen from './home'
import ProfileScreen from './profile'
import ReadingListScreen from './reading-list'
import SearchScreen from './search'

const Tab = createBottomTabNavigator();

const TabLayout = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen}/>
      <Tab.Screen name="Search" component={SearchScreen}/>
      <Tab.Screen name="ReadingList" component={ReadingListScreen}/>
      <Tab.Screen name="Profile" component={ProfileScreen}/>
    </Tab.Navigator>
  )
}

export default TabLayout

