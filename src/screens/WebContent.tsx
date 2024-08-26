import React from 'react';
import {ActivityIndicator, Dimensions, StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
import {colors} from '../utils/constants';

const WebContent = ({route}: any) => {
  const {url} = route.params;

  return (
    <View style={styles.container}>
      <WebView
        style={styles.webView}
        source={{uri: url}}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator color="black" size="large" style={styles.loader} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg_color,
  },
  webView: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  loader: {
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default WebContent;
