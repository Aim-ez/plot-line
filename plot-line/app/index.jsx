// web 234979308654-2mgkm1nju5fettv9sbujmphmg7caei3j.apps.googleusercontent.com
// iOS 234979308654-mht7ls7hg3d57nl0gc80hfos3b0gepv2.apps.googleusercontent.com
// and 234979308654-6ih1qglvuleft7trchpa64n4jtls7e5c.apps.googleusercontent.com

import React from 'react'
import { Link } from 'expo-router'

// React navigation stack
import RootStack from '../navigators/RootStack'

import Glogo from '../assets/images/g.png'
import * as WebBrowser from "expo-web-browser"
import * as Google from 'expo-auth-session/providers/google'
import AsyncStorage from '@react-native-async-storage/async-storage'


//Google sign-in
WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [userInfo, setUserInfo] = React.useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: 
      "234979308654-2mgkm1nju5fettv9sbujmphmg7caei3j.apps.googleusercontent.com",
    iosClientId:
      "234979308654-mht7ls7hg3d57nl0gc80hfos3b0gepv2.apps.googleusercontent.com",
    androidClientId: 
      "234979308654-6ih1qglvuleft7trchpa64n4jtls7e5c.apps.googleusercontent.com"
  })

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

  const getUserInfo = async(token) => {
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

  return (<RootStack/>);
}

/*
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

  div: {
    display: 'flex',
    alignItems: 'flex-start',
  },

  googleButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5, 
    margin: 20,
    display: 'flex',
    flexDirection: 'row'
  },
  img: {
    width: 35,
    height: 20,
    paddingRight: 10,
  },

  button: {
    backgroundColor: '#798CE7',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  }
});
*/
