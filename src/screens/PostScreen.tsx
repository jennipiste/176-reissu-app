import React, {useEffect, useState} from 'react';
import {Text, View, Image, StyleSheet, ScrollView, FlatList, Dimensions} from 'react-native';
import {useNavigationParam} from 'react-navigation-hooks';
import firebase from 'firebase';
import {Post, User} from '../interfaces';
import moment from 'moment';
import {useSafeArea} from "react-native-safe-area-context";

export const PostScreen: React.FC = () => {

  // const postUid = useNavigationParam('postUid');
  const imageUri = useNavigationParam('imageUri');

  // const [post, setPost] = useState<Post>(undefined);
  // const [user, setUser] = useState<User>(undefined);
  // const [loading, setLoading] = useState<boolean>(true);

  // const database = firebase.database();
  //
  // useEffect(() => {
  //   database.ref(`posts/${postUid}`).once('value')
  //     .then((snapshot) => {
  //       setPost(snapshot.val());
  //       const userUid = snapshot.val().userUid;
  //       firebase.database().ref(`users/${userUid}`).once('value')
  //         .then(async (snapshot) => {
  //           setUser(snapshot.val());
  //           setLoading(false)
  //         });
  //     });
  // }, []);

  const [imageSize, setImageSize] = useState({width: 0, height: 0})

  useEffect(() => {
    Image.getSize(imageUri, (width, height) => {
      const screenWidth = Dimensions.get('window').width
      const scaleFactor = width / screenWidth
      const imageHeight = height / scaleFactor
      setImageSize({width: screenWidth, height: imageHeight})
    }, () => {alert('failure happened')})
  }, [])

  return <ScrollView
    style={{
      // flex: 1,
      // flexDirection: 'column'
    }}>
    <Image
      source={{uri: imageUri, cache: 'force-cache'}}
      style={{
        width: imageSize.width,
        height: imageSize.height
        // flex: 1,
        // // resizeMode: 'stretch'
        // // resizeMode: 'cover'
        // // resizeMode: 'cover'
        // resizeMode: 'center'
        // // width: 100,
        // // height: 100,
        // // borderRadius: 1,
        // // borderColor: 'black'
      }}
    />
  </ScrollView>
  //
  // return (
  //   // loading ? <View><Text>Loading...</Text></View> : <View>
  //   // </View>
  //   {/*<ScrollView style={styles.view}>*/}
  //   {/*  {post*/}
  //   {/*    ? <View>*/}
  //   {/*      <Text>{moment(post.date).format('HH:mm')}</Text>*/}
  //   {/*      <Text>{post.text}</Text>*/}
  //   {/*      {post.imageUrls.map((url, index) => {*/}
  //   {/*        return <View key={index}>*/}
  //   {/*          <Image source={{uri: url}} style={styles.postImage}/>*/}
  //   {/*        </View>;*/}
  //   {/*      })}*/}
  //   {/*      /!* <ScrollView*/}
  //   {/*                    data={post.imageUrls}*/}
  //   {/*                    renderItem={({ item }) => (*/}
  //   {/*                        <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>*/}
  //   {/*                            <Image source={{ uri: item }} style={styles.postImage} />*/}
  //   {/*                        </View>*/}
  //   {/*                    )}*/}
  //   {/*                    numColumns={2}*/}
  //   {/*                    keyExtractor={(_, index) => index.toString()}*/}
  //   {/*                    removeClippedSubviews={false}*/}
  //   {/*                /> *!/*/}
  //   {/*    </View>*/}
  //   {/*    : <Text>Loading...</Text>*/}
  //   {/*  }*/}
  //   {/*</ScrollView>*/}
  // );
};

const styles = StyleSheet.create({
  view: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
  },
  postImage: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: 200,
  },
});
