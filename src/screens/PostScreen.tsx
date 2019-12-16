import React, {useEffect, useState} from 'react';
import {Image, ScrollView, Dimensions} from 'react-native';
import {useNavigationParam} from 'react-navigation-hooks';

export const PostScreen: React.FC = () => {

  const imageUri = useNavigationParam('imageUri');

  const [imageSize, setImageSize] = useState({width: 0, height: 0});

  useEffect(() => {
    Image.getSize(imageUri, (width, height) => {
      const screenWidth = Dimensions.get('window').width;
      const scaleFactor = width / screenWidth;
      const imageHeight = height / scaleFactor;
      setImageSize({width: screenWidth, height: imageHeight});
    }, () => { alert('failure happened'); });
  }, []);

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
  </ScrollView>;
};
