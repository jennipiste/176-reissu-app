import React, {useState, useEffect} from 'react';
import {useSafeArea} from 'react-native-safe-area-context';
import {AsyncStorage, DeviceEventEmitter} from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  ActivityIndicator,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform
} from 'react-native';
import {useNavigation} from 'react-navigation-hooks';

import moment from 'moment';
import {destinations, START_TIME} from '../constants';
import {primaryColor, secondaryColor} from '../styles';
import firebase from "firebase";
import {Post} from "../interfaces";

const SCROLLABLE_CONTENT_HEIGHT = 2423;

export const HomeScreen: React.FC = () => {
  const [unseenPostsMap, setUnseenPostsMap] = useState<{ [key: string]: number }>({})

  const [postsResult, setPostResult] = useState<any>(undefined)
  const [eventListenerCounter, setEventListenerCounter] = useState<number>(0)

  useEffect(() => {
    DeviceEventEmitter.addListener('SEEN_POST_CHANGE', (e)=>{
      setEventListenerCounter((currentEventListCountener) => currentEventListCountener + 1)
    })
  }, [])

  useEffect(() => {
    if (postsResult) {
      const func = async () => {
        const posts: Post[] = Object.values(postsResult)
        let destinationPosts: { [key: string]: string[] } = {}
        posts.forEach((post: Post) => {
          if (!(post.destination in destinationPosts)) {
            destinationPosts[post.destination] = []
          }
          destinationPosts[post.destination] = [...destinationPosts[post.destination], post.uid]
        })
        const seenPostUids = JSON.parse(await AsyncStorage.getItem('SEEN_POST_UIDS')) || []
        const newUnseenPostsMap = Object.keys(destinationPosts).map(uid => {
          return {
            [uid]: destinationPosts[uid].filter((postUid) => seenPostUids.indexOf(postUid) < 0).length
          }
        }).reduce((acc, curr) => ({...acc, ...curr}), {})
        setUnseenPostsMap(newUnseenPostsMap)
      }
      func()
    }
  }, [postsResult, eventListenerCounter])

  useEffect(() => {
    const ref = firebase.database().ref('posts');
    const handleSnapshot = async (snapshot: firebase.database.DataSnapshot) => {
      const result = snapshot.val();
      if (result) {
        setPostResult(result)
      }
    };
    ref.on('value', handleSnapshot);
    return () => ref.off('value', handleSnapshot);
  }, []);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timeUntil, setTimeUntil] = useState<{ days: number, hours: number, minutes: number, seconds: number }>(undefined);

  const {navigate} = useNavigation();

  useEffect(() => {
    const start_time: moment.Moment = moment(START_TIME);
    const diff = moment().diff(start_time);
    const duration = moment.duration(diff);
    setTimeUntil({
      days: duration.days(),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds()
    });
    setIsLoading(false);
  });

  const onDestinationPress = (destinationIndex: number) => {
    navigate('Diary', {destinationIndex, location: destinations[destinationIndex].name});
  };

  const insets = useSafeArea();

  // States for background position
  const [scrollViewWidth, setScrollViewWidth] = useState<number>(undefined);
  const [scrollViewHeight, setScrollViewHeight] = useState<number>(undefined);
  const [progress, setProgress] = useState<number>(undefined);
  const [parallaxPos, setParallaxPos] = useState(undefined);
  const [parallaxLeftPos, setParallaxLeftPos] = useState(undefined);
  const [parallaxRightPos, setParallaxRightPos] = useState(undefined);

  useEffect(() => {
    if (scrollViewWidth && scrollViewHeight) {
      updatePositions();
    }
  }, [progress]);

  const updatePositions = () => {
    const bgWidth = scrollViewWidth;
    const bgHeight = bgWidth * 5.94;
    const parallaxHeight = bgHeight * 1.3;
    const parallaxBottom = (progress * (parallaxHeight - scrollViewHeight)) + scrollViewHeight - parallaxHeight;
    const parallaxPos = {width: bgWidth, height: parallaxHeight, left: 0, bottom: parallaxBottom};
    const parallaxWidth = bgWidth * 1.7;
    const parallaxLeft = (progress * (parallaxWidth - scrollViewWidth)) + scrollViewWidth - parallaxWidth;
    const parallaxLeftPos = {width: parallaxWidth, height: bgHeight, left: parallaxLeft, top: 0};
    const parallaxRight = (progress * (parallaxWidth - scrollViewWidth)) + scrollViewWidth - parallaxWidth;
    const parallaxRightPos = {width: parallaxWidth, height: bgHeight, right: parallaxRight, top: 0};
    setParallaxPos(parallaxPos);
    setParallaxLeftPos(parallaxLeftPos);
    setParallaxRightPos(parallaxRightPos);
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const {width, height} = event.nativeEvent.layout;
    setScrollViewWidth(width);
    setScrollViewHeight(height);
    setProgress(0);
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const viewHeight = event.nativeEvent.layoutMeasurement.height;
    const maxY = contentHeight - viewHeight;
    const progress = Math.max(Math.min(scrollY / maxY, 1), 0);
    setProgress(progress);
  };

  const parallaxImages = <>
    <Image source={require('../../assets/monkey.png')} style={styles.monkey}/>
    <Image source={require('../../assets/lamps.png')} style={styles.lamps}/>
    <Image source={require('../../assets/rice_guy_in_boat.png')} style={styles.boat}/>
  </>;
  const parallaxLeftImages = <>
    <Image source={require('../../assets/scooter.png')} style={styles.scooter}/>
  </>;
  const parallaxRightImages = <>
    <Image source={require('../../assets/transparent_clouds.png')} style={styles.clouds}/>
  </>;

  return (
    <View style={{
      ...styles.view,
      marginTop: insets.top,
      marginBottom: Platform.OS === 'ios' ? 0 : insets.bottom,
    }} onLayout={(event) => onLayout(event)}>
      {isLoading
        ? <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <ActivityIndicator size={Platform.OS === 'ios' ? 'large' : 60} color={primaryColor} />
        </View>
        : <>
          {(timeUntil && timeUntil.days < 0 || timeUntil.hours < 0 || timeUntil.minutes < 0 || timeUntil.seconds < 0)
            ? <ImageBackground source={require('../../assets/app_background_start.png')}
                               style={{width: '100%', height: '100%'}}>
              <View style={styles.timeUntilBackground}>
                <View style={styles.timeUntilContainer}>
                  <Text style={styles.timeUntilTitle}>Aikaa matkan alkuun</Text>
                  <View style={styles.timeUntilItems}>
                    <View style={styles.timeUntilItemContainer}>
                      <View style={styles.timeUntilItem}><Text
                        style={styles.timeUntilText}>{-timeUntil.days}</Text></View>
                      <Text style={styles.timeUntilUnitText}>Päivää</Text>
                    </View>
                    <View style={styles.timeUntilItemContainer}>
                      <View style={styles.timeUntilItem}><Text
                        style={styles.timeUntilText}>{-timeUntil.hours}</Text></View>
                      <Text style={styles.timeUntilUnitText}>Tuntia</Text>
                    </View>
                    <View style={styles.timeUntilItemContainer}>
                      <View style={styles.timeUntilItem}><Text style={styles.timeUntilText}>{-timeUntil.minutes}</Text></View>
                      <Text style={styles.timeUntilUnitText}>Minuuttia</Text>
                    </View>
                    <View style={styles.timeUntilItemContainer}>
                      <View style={styles.timeUntilItem}><Text style={styles.timeUntilText}>{-timeUntil.seconds}</Text></View>
                      <Text style={styles.timeUntilUnitText}>Sekuntia</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ImageBackground>
            : <ScrollView style={styles.scrollView} onScroll={(event) => onScroll(event)} scrollEventThrottle={16}>
              <ImageBackground source={require('../../assets/home_bg.png')} style={{width: '100%', height: '100%'}}>
                <View style={[styles.parallax, parallaxPos]}>{parallaxImages}</View>
                <View style={[styles.parallax, parallaxLeftPos]}>{parallaxLeftImages}</View>
                <View style={[styles.parallax, parallaxRightPos]}>{parallaxRightImages}</View>
                <View style={{flex: 1, height: SCROLLABLE_CONTENT_HEIGHT}}>
                  {destinations.map((destination, index) =>
                    <TouchableOpacity
                      onPress={() => onDestinationPress(index)}
                      key={index}
                      style={{
                        ...styles.date,
                        position: 'absolute',
                        top: destination.position.y,
                        left: destination.position.x,
                      }}
                    >
                      {
                        ((destination.name in unseenPostsMap) && unseenPostsMap[destination.name] > 0) &&
                        <View style={styles.plusCounterText}>
                          <Text style={{color: 'white', textAlign: 'center'}}>+{unseenPostsMap[destination.name]}</Text>
                        </View>
                      }
                      <View>
                        <Text style={styles.dateText}>{`${index + 1}`}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </ImageBackground>
            </ScrollView>
          }
        </>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#F1F3FD',
  },
  scrollView: {
    flex: 1,
  },
  parallax: {
    position: 'absolute',
  },
  monkey: {
    position: 'absolute',
    left: 0,
    bottom: '96%',
  },
  boat: {
    position: 'absolute',
    right: 50,
    bottom: '2%',
  },
  lamps: {
    position: 'absolute',
    left: 0,
    bottom: '60%',
  },
  scooter: {
    position: 'absolute',
    top: 610,
    left: '50%',
  },
  clouds: {
    top: 300,
    right: '10%',
  },
  date: {
    backgroundColor: '#fff',
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusCounterText: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: secondaryColor,
    color: 'white',
    fontSize: 12,
    position: 'absolute',
    top: -10,
    right: -10,
    width: 30,
    height: 30,
    borderRadius: 15
  },
  dateText: {
    fontFamily: 'futuramedium',
    fontSize: 22,
  },
  timeUntilBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
  },
  timeUntilContainer: {
    width: '85%',
    borderRadius: 20,
    backgroundColor: '#F1F3FD',
    paddingVertical: 40,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  timeUntilTitle: {
    fontSize: 20,
    marginBottom: 30,
    // fontWeight: 'bold',
  },
  timeUntilItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  timeUntilItemContainer: {
    alignItems: 'center',
  },
  timeUntilItem: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 10,
    justifyContent: 'center',
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  timeUntilText: {
    fontSize: 38,
    // fontWeight: 'bold',
  },
  timeUntilUnitText: {
    // fontWeight: 'bold',
  },
});