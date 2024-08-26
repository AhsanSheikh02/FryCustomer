import React, {Component} from 'react';
import {
  Image,
  ImageBackground,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeTouchEvent,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Video, {
  OnBufferData,
  OnLoadData,
  OnProgressData,
} from 'react-native-video';
import {colors} from '../utils/constants';

const BackgroundImage = ImageBackground || Image;

const styles = StyleSheet.create({
  preloadingPlaceholder: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playArrow: {
    color: 'white',
  },
  video: {
    backgroundColor: 'black',
  },
  controls: {
    backgroundColor: colors.accent_color,
    height: 48,
    marginTop: -48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playControl: {
    color: 'white',
    padding: 8,
  },
  extraControl: {
    color: 'white',
    padding: 5,
  },
  seekBar: {
    alignItems: 'center',
    height: 30,
    flexGrow: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginLeft: -10,
    marginRight: -5,
  },
  seekBarFullWidth: {
    marginLeft: 0,
    marginRight: 0,
    paddingHorizontal: 0,
    marginTop: -3,
    height: 3,
  },
  seekBarProgress: {
    height: 3,
    backgroundColor: '#FFF',
  },
  seekBarKnob: {
    width: 20,
    height: 20,
    marginHorizontal: -8,
    marginVertical: -10,
    borderRadius: 10,
    backgroundColor: '#F00',
    transform: [{scale: 0.8}],
    zIndex: 1,
  },
  seekBarBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: 3,
  },
  overlayButton: {
    flex: 1,
  },
});

type VideoPlayerProps =
  | {
      video: any;
      videoWidth?: number;
      videoHeight?: number;
      autoplay?: boolean;
      controlsTimeout?: number;
      loop?: boolean;
      resizeMode?: 'contain' | 'cover' | 'stretch' | 'none';
      disableSeek?: boolean;
      pauseOnPress?: boolean;
      fullScreenOnLongPress?: boolean;
      customStyles?: any;
      muted?: boolean;
      paused?: boolean;
      endWithThumbnail?: boolean;
      endThumbnail?: any;
      thumbnail?: any;
      hideControlsOnStart?: boolean;
      defaultMuted?: boolean;
      disableFullscreen?: boolean;
      onStart?: () => void;
      onProgress?: (data: OnProgressData) => void;
      onBuffer?: (data: OnBufferData) => void;
      onEnd?: () => void;
      onLoad?: (data: OnLoadData) => void;
      onPlayPress?: () => void;
      onMutePress?: (isMuted: boolean) => void;
      onHideControls?: () => void;
      onShowControls?: () => void;
      onFullScreenChange?: (isFullScreen: boolean) => void;
    }
  | any;

interface VideoPlayerState {
  isStarted: boolean;
  isPlaying: boolean;
  hasEnded: boolean;
  width: number;
  progress: number;
  isMuted: boolean;
  isControlsVisible: boolean;
  duration: number;
  currentTime: number;
  isSeeking: boolean;
  isFullScreen: boolean;
}

export default class VideoPlayer extends Component<
  VideoPlayerProps,
  VideoPlayerState
> {
  static defaultProps = {
    videoWidth: 1280,
    videoHeight: 720,
    autoplay: false,
    controlsTimeout: 3000,
    loop: false,
    resizeMode: 'contain',
    disableSeek: false,
    pauseOnPress: false,
    fullScreenOnLongPress: false,
    customStyles: {},
  };

  private seekBarWidth: number;
  private wasPlayingBeforeSeek: boolean;
  private seekTouchStart: number;
  private seekProgressStart: number;
  private controlsTimeout: NodeJS.Timeout | null = null;
  private player: any = null;

  constructor(props: VideoPlayerProps) {
    super(props);

    this.state = {
      isStarted: props.autoplay ?? false,
      isPlaying: props.autoplay ?? false,
      hasEnded: false,
      width: 200,
      progress: 0,
      isMuted: props.defaultMuted ?? false,
      isControlsVisible: !props.hideControlsOnStart,
      duration: 0,
      currentTime: 0,
      isSeeking: false,
      isFullScreen: false,
    };

    this.seekBarWidth = 200;
    this.wasPlayingBeforeSeek = props.autoplay ?? false;
    this.seekTouchStart = 0;
    this.seekProgressStart = 0;
  }

  componentDidMount() {
    if (this.props.autoplay) {
      this.hideControls();
    }
  }

  componentWillUnmount() {
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
    }
  }

  onLayout = (event: LayoutChangeEvent) => {
    const {width} = event.nativeEvent.layout;
    this.setState({width});
  };

  onStartPress = () => {
    if (this.props.onStart) {
      this.props.onStart();
    }

    this.setState(state => ({
      isPlaying: true,
      isStarted: true,
      hasEnded: false,
      progress: state.progress === 1 ? 0 : state.progress,
    }));

    this.hideControls();
  };

  onProgress = (event: OnProgressData) => {
    if (this.state.isSeeking) {
      return;
    }

    if (this.props.onProgress) {
      this.props.onProgress(event);
    }

    this.setState({
      progress:
        event.currentTime / (this.props.duration || this.state.duration),
      currentTime: event.currentTime,
    });
  };

  onBuffer = (event: OnBufferData) => {
    if (this.props.onBuffer) {
      this.props.onBuffer(event);
    }
  };

  onEnd = () => {
    if (this.props.onEnd) {
      this.props.onEnd();
    }

    if (this.props.endWithThumbnail || this.props.endThumbnail) {
      this.setState({isStarted: false, hasEnded: true});
      this.player?.dismissFullscreenPlayer();
    }

    this.setState({progress: 1});

    if (!this.props.loop) {
      this.setState({isPlaying: false}, () => this.player?.seek(0));
    } else {
      this.player?.seek(0);
    }
  };

  onLoad = (event: OnLoadData) => {
    if (this.props.onLoad) {
      this.props.onLoad(event);
    }

    this.setState({duration: event.duration});
  };

  onPlayPress = () => {
    if (this.props.onPlayPress) {
      this.props.onPlayPress();
    }

    this.setState(prevState => ({
      isPlaying: !prevState.isPlaying,
    }));
    this.showControls();
  };

  onMutePress = () => {
    const isMuted = !this.state.isMuted;
    if (this.props.onMutePress) {
      this.props.onMutePress(isMuted);
    }
    this.setState({isMuted});
    this.showControls();
  };

  onToggleFullScreen = () => {
    if (Platform.OS === 'android') {
      this.setState(
        prevState => ({isFullScreen: !prevState.isFullScreen}),
        () => {
          if (this.state.isFullScreen) {
            Orientation.lockToLandscape();
            this.props.onFullScreenChange?.(0);
          } else {
            Orientation.lockToPortrait();
            this.props.onFullScreenChange?.(1);
          }
        },
      );
    } else {
      this.player?.presentFullscreenPlayer();
    }
  };

  onSeekBarLayout = ({nativeEvent}: LayoutChangeEvent) => {
    const padding = this.calculateSeekBarPadding();
    this.seekBarWidth = nativeEvent.layout.width - padding;
  };

  onSeekGrant = (e: NativeSyntheticEvent<NativeTouchEvent>) => {
    this.seekTouchStart = e.nativeEvent.pageX;
    this.seekProgressStart = this.state.progress;
    this.wasPlayingBeforeSeek = this.state.isPlaying;
    this.setState({isSeeking: true, isPlaying: false});
  };

  onSeekRelease = () => {
    this.setState({isSeeking: false, isPlaying: this.wasPlayingBeforeSeek});
    this.showControls();
  };

  onSeek = (e: NativeSyntheticEvent<NativeTouchEvent>) => {
    const diff = e.nativeEvent.pageX - this.seekTouchStart;
    const ratioDiff = diff / this.seekBarWidth;
    const progress = Math.max(
      0,
      Math.min(1, this.seekProgressStart + ratioDiff),
    );

    this.setState({progress});
    this.player?.seek(progress * (this.props?.duration || this.state.duration));
  };

  getSizeStyles = () => {
    const {videoWidth, videoHeight} = this.props;
    const ratio = videoHeight! / videoWidth!;
    return {height: this.state.width * ratio};
  };

  getPlayerControls = () => {
    return (
      <View style={[styles.controls, this.props.customStyles?.controls]}>
        <TouchableOpacity onPress={this.onPlayPress}>
          <Icon
            name={this.state.isPlaying ? 'pause' : 'play-arrow'}
            style={[styles.playControl, this.props.customStyles?.controlIcon]}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onMutePress}>
          <Icon
            name={this.state.isMuted ? 'volume-off' : 'volume-up'}
            style={[styles.extraControl, this.props.customStyles?.controlIcon]}
          />
        </TouchableOpacity>
        {!this.props.disableFullscreen && (
          <TouchableOpacity onPress={this.onToggleFullScreen}>
            <Icon
              name="fullscreen"
              style={[
                styles.extraControl,
                this.props.customStyles?.controlIcon,
              ]}
            />
          </TouchableOpacity>
        )}
        {!this.props.disableSeek && (
          <View
            style={[styles.seekBar, this.props.customStyles?.seekBar]}
            onLayout={this.onSeekBarLayout}>
            <View
              style={[
                styles.seekBarBackground,
                this.props.customStyles?.seekBarBackground,
              ]}>
              <View
                style={[
                  styles.seekBarProgress,
                  {flexGrow: this.state.progress},
                  this.props.customStyles?.seekBarProgress,
                ]}
              />
              {!this.state.hasEnded && (
                <View
                  style={[
                    styles.seekBarKnob,
                    {
                      left: this.seekBarWidth * this.state.progress - 10,
                    },
                    this.props.customStyles?.seekBarKnob,
                  ]}
                  onTouchStart={this.onSeekGrant}
                  onTouchEnd={this.onSeekRelease}
                  onTouchMove={this.onSeek}
                />
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  calculateSeekBarPadding = () => {
    return Platform.select({
      android: 25,
      ios: 20,
    })!;
  };

  showControls = () => {
    if (!this.state.isControlsVisible) {
      this.setState({isControlsVisible: true});
      this.props.onShowControls?.();
    }

    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
    }

    this.controlsTimeout = setTimeout(() => {
      this.hideControls();
    }, this.props.controlsTimeout);
  };

  hideControls = () => {
    this.setState({isControlsVisible: false});
    this.props.onHideControls?.();
  };

  renderThumbnail = () => {
    const {thumbnail, endThumbnail} = this.props;
    const image =
      this.state.hasEnded && endThumbnail ? endThumbnail : thumbnail;

    return (
      <BackgroundImage
        style={[styles.thumbnail, this.getSizeStyles()]}
        source={image}>
        <TouchableOpacity onPress={this.onStartPress} style={styles.playButton}>
          <Icon name="play-arrow" size={42} style={styles.playArrow} />
        </TouchableOpacity>
      </BackgroundImage>
    );
  };

  renderVideo = () => {
    const {video, resizeMode, loop, muted, paused} = this.props;
    const {isPlaying, isMuted} = this.state;

    return (
      <TouchableOpacity
        style={[styles.video, this.getSizeStyles()]}
        onPress={this.props.pauseOnPress ? this.onPlayPress : this.showControls}
        onLongPress={
          this.props.fullScreenOnLongPress ? this.onToggleFullScreen : undefined
        }
        activeOpacity={1}>
        <Video
          ref={ref => (this.player = ref)}
          source={video}
          style={[styles.video, this.getSizeStyles()]}
          resizeMode={resizeMode}
          paused={!isPlaying || paused}
          muted={muted || isMuted}
          repeat={loop}
          onProgress={this.onProgress}
          onLoad={this.onLoad}
          onEnd={this.onEnd}
          onBuffer={this.onBuffer}
        />
      </TouchableOpacity>
    );
  };

  render(): JSX.Element {
    return (
      <View style={[this.getSizeStyles(), this.props.customStyles?.container]}>
        <View style={this.getSizeStyles()} onLayout={this.onLayout}>
          {this.state.isStarted ? this.renderVideo() : this.renderThumbnail()}
        </View>
        {this.state.isStarted &&
          this.state.isControlsVisible &&
          this.getPlayerControls()}
      </View>
    );
  }
}
