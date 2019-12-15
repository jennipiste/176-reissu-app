import React, {useEffect, useState} from 'react';
import {useSafeArea} from 'react-native-safe-area-context';
import {Text, View, Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator} from 'react-native';
import {useNavigation, useNavigationParam} from 'react-navigation-hooks';
import firebase from 'firebase';
import {Post, User} from '../interfaces';
import {destinations} from '../constants';
import {FontAwesome, MaterialCommunityIcons} from '@expo/vector-icons';
import moment from 'moment';
import {backgroundColor, commonStyles, grayDark, grayLight, primaryColor} from "../styles";

export const DiaryScreen: React.FC = () => {
  const {navigate} = useNavigation();
  const destinationIndex = useNavigationParam('destinationIndex');

  const destination = destinations[destinationIndex];

  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingCounter, setLoadingCounter] = useState<number>(2)

  const onCreatePress = () => {
    navigate('CreatePost', {destinationIndex});
  };

  const onPostPress = (postUid, imageUri) => {
    navigate('Post', {postUid, imageUri})
  };

  useEffect(() => {
    firebase.database().ref('posts').on('value', (snapshot) => {
      const result = snapshot.val();
      if (result) {
        const postList: Post[] = Object.keys(result).map(key => {
          return result[key];
        });
        const filteredPosts = postList.filter(post => post.destination === destination.name);
        const sortedPosts = filteredPosts.sort((post1, post2) => {
          if (post1.date === post2.date) {
            return 0
          }
          return post1.date < post2.date ? -1 : 1
        })

        setPosts(sortedPosts);
        setLoadingCounter((curCounter) => curCounter - 1)
      }
    });
  }, []);

  useEffect(() => {
    firebase.database().ref('users').on('value', (snapshot) => {
      const result = snapshot.val();
      if (result) {
        const usersList = Object.keys(result).map(key => {
          return result[key];
        });
        setUsers(usersList);
        setLoadingCounter((curCounter) => curCounter - 1)
      }
    });
  }, []);

  return (
    <View style={{
      ...styles.view, ...{
        // marginTop: insets.top,
        // marginBottom: insets.bottom,
      }
    }}>
      {
        loadingCounter === 0 ?
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={onCreatePress}
            >
              <MaterialCommunityIcons name='plus' size={28} color='white'/>
            </TouchableOpacity>
            {
              posts.length === 0 ? <View style={styles.noPosts}>
                <FontAwesome
                  name='book'
                  size={120}
                  color={grayLight}
                  style={{margin: 5}}
                />
                <Text style={{color: grayLight, margin: 5, fontFamily: 'futuramedium', fontSize: 16}}>Ei vielä postauksia</Text>
                <Text
                  style={{color: primaryColor, fontFamily: 'futuramedium', margin: 5, width: '100%', textAlign: 'center', fontSize: 16}}
                  onPress={onCreatePress}
                >Lisää uusi postaus!</Text>
              </View> : <FlatList
                style={styles.scrollArea}
                data={posts}
                renderItem={({item, index}) => {
                  const user = users.find(user => user.uid === item.userUid);
                  const userAvatarUrl = user ? user.avatarUrl : null;
                  const date = moment(item.date).format('DD.MM.');
                  return <View
                    style={{...styles.postContainer, ...(index === posts.length - 1 ? {marginBottom: 20} : {})}}>
                    {userAvatarUrl
                      ? <Image source={{uri: userAvatarUrl}} style={styles.avatar}/>
                      : <Image source={require('../../assets/user-profile-empty.png')} style={styles.avatar}/>
                    }
                    <View
                      style={styles.post}
                    >
                      <View style={styles.arrowThing}/>
                      <View>
                        <View style={styles.itemHeader}>
                          <Text style={styles.itemHeaderUserName}>{user.username}</Text>
                          <Text style={styles.itemHeaderDate}>{moment(item.date).format('DD.MM.')}</Text>
                        </View>
                        <FlatList
                          data={item.imageUrls}
                          renderItem={(value) => {
                            const imageUri = value.item;
                            return <View style={{flex: 1, flexDirection: 'column', margin: 1}}>
                              <TouchableOpacity
                                onPress={() => onPostPress(item.uid, imageUri)}
                              >
                                <Image source={{uri: imageUri, cache: 'force-cache'}} style={styles.postImage}/>
                              </TouchableOpacity>
                            </View>;
                          }}
                          numColumns={3}
                          keyExtractor={(_, index) => index.toString()}
                          removeClippedSubviews={false}
                        />
                        <Text style={{marginTop: 5, fontFamily: 'futuramedium', fontSize: 16}}>{item.text}</Text>
                      </View>
                    </View>
                  </View>;
                }}
                keyExtractor={(_, index) => index.toString()}
              />
            }
          </> : <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ActivityIndicator size={60} color={primaryColor} />
          </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  noPosts: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  view: {
    backgroundColor: backgroundColor,
    flex: 1,
  },
  scrollArea: {
    padding: 0,
  },
  itemHeaderUserName: {
    flexGrow: 1,
    color: primaryColor,
    fontFamily: 'futuramedium',
    fontSize: 16,
    // fontWeight: 'bold'
  },
  itemHeaderDate: {
    color: grayDark,
    fontSize: 12,
    fontFamily: 'futuramedium',
  },
  arrowThing: {
    position: 'absolute',
    left: -10,
    top: 15,
    width: 0,
    height: 0,
    borderRightColor: '#FFFFFF',
    borderRightWidth: 10,
    borderTopColor: 'transparent',
    borderTopWidth: 10,
    borderBottomColor: 'transparent',
    borderBottomWidth: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  location: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  button: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 5,
    zIndex: 1,
    backgroundColor: '#7800F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  post: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
    marginRight: 20,
    borderRadius: 5,
    flex: 1,
    backgroundColor: 'white',
    elevation: 5
  },
  postImage: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  images: {
    display: 'flex',
    flexDirection: 'row',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    margin: 20,
  },
});
