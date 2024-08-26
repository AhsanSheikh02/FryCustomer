import PushNotificationIOS from '@react-native-community/push-notification-ios';
import React, {useEffect} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import PushNotification from 'react-native-push-notification';
import {moderateScale} from 'react-native-size-matters';

const Notification: React.FC = () => {
  useEffect(() => {
    setupNotification();
    sendLocalNotification();
    scheduleNotification();
    createNotificationChannel();
  }, []);

  const setupNotification = () => {
    PushNotification.configure({
      onRegister: (token: any) => {
        console.log('TOKEN:', token);
      },
      onNotification: (notification: any) => {
        console.log('NOTIFICATION:', notification);
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      onAction: (notification: any) => {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
      },
      onRegistrationError: (err: any) => {
        console.error(err.message, err);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  };

  const sendLocalNotification = () => {
    PushNotification.localNotification({
      channelId: 'your-channel-id',
      ticker: 'My Notification Ticker',
      showWhen: true,
      autoCancel: true,
      largeIcon: 'ic_launcher',
      largeIconUrl: 'https://www.example.tld/picture.jpg',
      smallIcon: 'ic_notification',
      bigText: 'My big text that will be shown when notification is expanded',
      subText: 'This is a subText',
      bigPictureUrl: 'https://www.example.tld/picture.jpg',
      bigLargeIcon: 'ic_launcher',
      bigLargeIconUrl: 'https://www.example.tld/bigicon.jpg',
      color: 'red',
      vibrate: true,
      vibration: 300,
      tag: 'some_tag',
      group: 'group',
      groupSummary: false,
      ongoing: false,
      priority: 'high',
      visibility: 'private',
      ignoreInForeground: false,
      shortcutId: 'shortcut-id',
      onlyAlertOnce: false,
      when: null,
      usesChronometer: false,
      timeoutAfter: null,
      messageId: 'google:message_id',
      actions: ['Yes', 'No'],
      invokeApp: true,
      category: '',
      id: 0,
      title: 'My Notification Title',
      message: 'My Notification Message',
      userInfo: {},
      playSound: false,
      soundName: 'default',
      number: 10,
      repeatType: 'day',
    });
  };

  const scheduleNotification = () => {
    PushNotification.localNotificationSchedule({
      message: 'My Notification Message',
      date: new Date(Date.now() + 60 * 1000), // 60 seconds from now
      allowWhileIdle: false,
    });
  };

  const createNotificationChannel = () => {
    PushNotification.createChannel(
      {
        channelId: 'channel-id',
        channelName: 'My channel',
        channelDescription: 'A channel to categorise your notifications',
        playSound: false,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created: any) => console.log(`createChannel returned '${created}'`),
    );
  };

  return (
    <View style={styles.MainContainer}>
      <View style={styles.CenterView}>
        <View style={styles.SubContainer} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    width: Dimensions.get('window').width,
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  CenterView: {
    width: Dimensions.get('window').width,
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  SubContainer: {
    width: Dimensions.get('window').width,
    backgroundColor: 'transparent',
  },
  ImageContainer: {
    width: moderateScale(10),
    height: moderateScale(10),
    margin: moderateScale(5),
    tintColor: 'grey',
  },
  textContainer: {
    fontSize: moderateScale(20),
  },
});

export default Notification;
