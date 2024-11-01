// web 234979308654-2mgkm1nju5fettv9sbujmphmg7caei3j.apps.googleusercontent.com
// iOS 234979308654-mht7ls7hg3d57nl0gc80hfos3b0gepv2.apps.googleusercontent.com
// and 234979308654-6ih1qglvuleft7trchpa64n4jtls7e5c.apps.googleusercontent.com

import { Button, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Link } from 'expo-router'

import * as WebBrowser from "expo-web-browser"
import * as Google from 'expo-auth-session/providers/google'
import AsyncStorage from '@react-native-async-storage/async-storage'

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [userInfo, setUserInfo] = React.useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: 
      "234979308654-2mgkm1nju5fettv9sbujmphmg7caei3j.apps.googleusercontent.com",
    iosClientId:
      "234979308654-mht7ls7hg3d57nl0gc80hfos3b0gepv2.apps.googleusercontent.com",
    androidClientId: 
      "234979308654-6ih1qglvuleft7trchpa64n4jtls7e5c.apps.googleusercontent.com",
  })

  const handlesPress = async () => {
    await promptAsync();
  }

  React.useEffect(() => {
    handleGoogleSignIn();
  }, [response]);

  async function handleGoogleSignIn() {
    const user = await AsyncStorage.getItem("@user");
    if (!user) {
      if (response?.type === "success")
      {     
        await getUserInfo(response.authentication?.accessToken);
        //ADD REDIRECT TO NEXT SCREEN AND DATABASE SHIZ
        //LIKE CHECKING IF THE USER ALREADY HAS A PLOTLINE
        //PROFILE AND IF SO DISPLAYING THEIR PAGES APPROPRIATELY
        //AND IF NOT THEN BRINGING THEM TO A 'WELCOME NEW USER'
        //SCREEN
      }
    } else {
      setUserInfo(JSON.parse(user));
    }
  }

  const getUserInfo = async(token: any) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}`}
        }
      );

      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      
    }
  }

  return (
    <View style={styles.container}>
      <Text>Welcome to PlotLine!</Text>
      <Text>{JSON.stringify(userInfo, null, 2)}</Text>
      <Pressable style={styles.button} onPress={() => promptAsync()}>
        <Text style={styles.text}>{"Sign in with Google"}</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => AsyncStorage.removeItem("@user")}>
        <Text style={styles.text}>{"Delete local storage"}</Text>
      </Pressable>
      <StatusBar style="auto"/>
      <Link href="/home" style={{color: 'blue'}}>Go to Tabs</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  justifyContent: 'center',
  },

  text: {
    color: '#fff',
    fontSize: 18,
  },

  button: {
    backgroundColor: '#798CE7',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  }
});
