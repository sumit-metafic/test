//import liraries
import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
} from 'react-native';

import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
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
    } catch (error) {
      console.error(error);
    }
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    console.log('Authorization status:', authStatus);
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  };

  useEffect(() => {
    //for google sign in
    GoogleSignin.configure({
      webClientId:
        '1059367224900-snhlhbgq8r3bj7gkif5d9sg9flchtdvq.apps.googleusercontent.com',
    });

    if (requestUserPermission()) {
      messaging()
        .getToken()
        .then(fcmtoken => {
          console.log('FCM TOKEN :', fcmtoken);
        });
    } else {
      console.log('Not Authorized status :');
    }

    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage) {
          console.log(
            'getInitialNotification : ' +
              'notification caused appp to open form quit state',
          );
        }
        console.log(remoteMessage);
        // Alert.alert(
        //   'getInitialNotification : ',
        //   'notification caused appp to open form quit state',
        // );
      });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));

      if (Platform.OS === 'android') {
        PushNotification.localNotification({
          /* Android Only Properties */
          channelId: 'channel_id',
          messageId: 'google:message_id',
          title: remoteMessage.notification?.title,
          message: String(remoteMessage?.notification?.body),
          picture:
            'https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png', // (optional) Display an picture with the notification, alias of `bigPictureUrl` for Android. default: undefined
        });
      }
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
