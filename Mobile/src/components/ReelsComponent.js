
import React, { useState } from 'react';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { RefreshControl } from 'react-native';
import SingleReel from './SingleReel';


const ReelsComponent = ({ data, personalData, onLikePress, onRefresh, isRefreshing, isScreenFocused }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reelData, setReelData] = useState(data || []);

  const handleChangeIndexValue = ({ index }) => {
    setCurrentIndex(index);
  };

  const updatePostData = (postIndex, updatedPost) => {
    setReelData((prevData) =>
      prevData.map((post, idx) => (idx === postIndex ? { ...post, ...updatedPost } : post))
    );
  };

  if (!reelData || reelData.length === 0) {
    return null;
  }

  return (
    <SwiperFlatList
      vertical
      onChangeIndex={handleChangeIndexValue}
      data={reelData}
      renderItem={({ item, index }) => (
        <SingleReel
          item={item}
          index={index}
          currentIndex={currentIndex}
          updatePostData={(updatedPost) => updatePostData(index, updatedPost)}
          personalData={personalData}
          onLikePress={onLikePress}
          isScreenFocused={isScreenFocused} // Pass isScreenFocused
        />
      )}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor="#fff"
          colors={['#007AFF']}
        />
      }
    />
  );
};

export default ReelsComponent;