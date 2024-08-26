import React, {FC} from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {config, fonts} from '../utils/constants';

interface CustomTextInputProps extends TextInputProps {
  textInputRef?: React.RefObject<TextInput>;
  placeholder?: string;
  value?: string;
  icon?: ImageSourcePropType;
  containerStyle?: ViewStyle;
  textInputStyle?: TextStyle;
  setHidePass?: (value: boolean) => void;
  secureTextEntry?: boolean;
}

export const CustomTextInput: FC<CustomTextInputProps> = ({
  textInputRef,
  placeholder,
  value,
  keyboardType = 'default',
  textContentType = 'none',
  onFocus,
  onBlur,
  children,
  onChangeText,
  secureTextEntry = false,
  icon,
  editable = true,
  maxLength,
  textInputStyle,
  containerStyle,
  autoCapitalize = 'none',
  returnKeyType = 'done',
  onSubmitEditing,
  blurOnSubmit = true,
  multiline,
  setHidePass,
  ...rest
}) => {
  return (
    <View style={[styles.viewContainer, containerStyle]}>
      {config.showTextInputIcons && icon ? (
        <Image style={styles.imageStyle} source={icon} />
      ) : (
        <View />
      )}
      <TextInput
        ref={textInputRef}
        style={[styles.textInputStyle, textInputStyle]}
        placeholder={placeholder}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        textContentType={textContentType}
        value={value}
        editable={editable}
        maxLength={maxLength}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={blurOnSubmit}
        onFocus={onFocus}
        onBlur={onBlur}
        multiline={multiline}
        underlineColorAndroid="transparent"
        {...rest}
      />
      {children}
      {textContentType === 'password' && setHidePass ? (
        <Icon
          name={!secureTextEntry ? 'eye' : 'eye-slash'}
          size={15}
          color="grey"
          onPress={() => setHidePass(!secureTextEntry)}
        />
      ) : (
        <View />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    marginLeft: moderateScale(10),
    marginRight: moderateScale(10),
    paddingLeft: moderateScale(10),
    paddingRight: moderateScale(10),
    borderRadius: moderateScale(5),
    borderWidth: moderateScale(1),
    height: verticalScale(40),
    borderColor: 'lightgrey',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: {
    height: verticalScale(18),
    width: scale(18),
  },
  textInputStyle: {
    fontFamily: fonts.opensans_regular,
    marginLeft: moderateScale(8),
    height: verticalScale(40),
    flex: 1,
  },
  lineStyle: {
    height: 1,
    marginTop: 0,
    marginLeft: moderateScale(5),
    marginRight: moderateScale(5),
    backgroundColor: 'lightgray',
  },
});
