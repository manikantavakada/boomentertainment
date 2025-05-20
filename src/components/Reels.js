
import React, { useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity, SafeAreaView, BackHandler } from 'react-native';
import ReelsComponent from './ReelsComponent';
import Ionic from 'react-native-vector-icons/Ionicons';

const Reels = ({ data, personalData, backButton, onLikePress, onRefresh, isRefreshing, isScreenFocused }) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const reelData = data && Array.isArray(data) && data.length > 0 ? data : [];
  const userData = personalData && personalData.username ? personalData : { username: 'Guest', profileImage: '' };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (backButton && typeof backButton === 'function') {
        backButton();
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [backButton]);

  if (!reelData || !Array.isArray(reelData) || reelData.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
        <Text style={{ color: 'white' }}>No videos available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <View
        style={{
          width: windowWidth,
          height: windowHeight,
          backgroundColor: 'black',
          position: 'relative',
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: 10,
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            zIndex: 1,
            padding: 10,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Boom Reels</Text>
          {backButton && typeof backButton === 'function' && (
            <TouchableOpacity onPress={backButton}>
              <Ionic name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
        <ReelsComponent
          data={reelData}
          personalData={userData}
          onLikePress={onLikePress}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
          isScreenFocused={isScreenFocused}
        />
      </View>
    </SafeAreaView>
  );
};

export default Reels;