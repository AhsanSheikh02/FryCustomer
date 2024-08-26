import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ImageViewer} from 'react-native-image-zoom-viewer';
import {colors} from '../utils/constants';

interface ImageDialogProps {
  showDialog: boolean;
  closeDialog: () => void;
  image: string;
}

const ImageDialog: React.FC<ImageDialogProps> = ({
  showDialog,
  closeDialog,
  image,
}) => {
  return showDialog ? (
    <View style={styles.dialogContainer}>
      <ImageViewer
        style={styles.imageContainer1}
        imageUrls={[{url: image}]}
        failImageSource={require('../../assets/images/placeholder.png')}
        renderIndicator={() => <View />}
      />
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.closeButton}
        onPress={closeDialog}>
        <Image
          style={styles.imageContainer2}
          source={require('../../assets/images/deleteicon2.png')}
        />
      </TouchableOpacity>
    </View>
  ) : (
    <View />
  );
};

const styles = StyleSheet.create({
  dialogContainer: {
    padding: 10,
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(10, 10, 10, 1)',
  },
  imageContainer1: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  imageContainer2: {
    width: 35,
    height: 35,
    marginRight: 10,
    tintColor: colors.main_color,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 10,
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
});

export default ImageDialog;
