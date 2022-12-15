//import liraries
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';

import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

// GoogleSignin.configure();
// create a component
const App = () => {
  const [userData, setUserData] = useState<any>({});

  async function onGoogleButtonPress() {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await auth().signOut();
      console.log('Sign Out');
      setUserData({});
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      // webClientId:
      //   '753556467727-ce526e2edfkbqvl3ssg6dmlrlcg7j5jv.apps.googleusercontent.com',
      webClientId:
        Platform.OS === 'android'
          ? '753556467727-ce526e2edfkbqvl3ssg6dmlrlcg7j5jv.apps.googleusercontent.com'
          : '753556467727-2gnc168nakri9r82k0k5nhndvldj6moa.apps.googleusercontent.com',
    });
  }, []);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btnBox}
        onPress={() =>
          onGoogleButtonPress()
            .then(res => {
              console.log('Signed in with Google!', res.user);
              setUserData(res.user);
            })
            .catch(error => {
              console.log('Error in google signIn : ', error);
            })
        }>
        <Text>Google SignIn</Text>
      </TouchableOpacity>
      <Image
        source={{uri: userData.photoURL}}
        style={{height: 100, width: 100}}
      />
      <View>
        <Text>
          UID: <Text>{userData.uid}</Text>
        </Text>
        <Text>
          Name: <Text>{userData.displayName}</Text>
        </Text>
        <Text>
          Email: <Text>{userData.email}</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.btnBox} onPress={() => signOut()}>
        <Text>SignOut</Text>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnBox: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'orange',
    borderRadius: 10,
    margin: 10,
  },
});

//make this component available to the app
export default App;
