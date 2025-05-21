import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Reels from '../components/Reels';
import api from '../services/api';
import config from '../config';

const ReelsScreen = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScreenFocused, setIsScreenFocused] = useState(true);

  // Fetch videos from server
  const fetchVideos = async () => {
    try {
      const data = await api.getVideos();
      console.log('Videos fetched:', data);
      const formattedVideos = data.map((video) => ({
        id: video.id.toString(),
        video: `${config.API_BASE_URL}/upload/${video.video_url.replace(/^\/?(upload\/)?/, '')}`,
        postProfile: video.thumbnail || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740',
        title: video.title || 'Untitled',
        description: `Uploaded by User ${video.user_id}`,
        likes: video.likes || 0,
        isLike: false,
      }));
      console.log('Formatted videos:', formattedVideos);
      setVideos(formattedVideos);
    } catch (err) {
      console.error('Error fetching videos:', err);
      Alert.alert('Error', 'Failed to load videos. Please check your network.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle video like
  const onLikePress = async (videoId) => {
    try {
      const updatedVideo = await api.likeVideo(videoId);
      console.log('Like updated:', updatedVideo);
      setVideos((prev) =>
        prev.map((video) =>
          video.id === videoId ? { ...video, likes: updatedVideo.likes, isLike: !video.isLike } : video
        )
      );
    } catch (err) {
      console.error('Error liking video:', err);
      Alert.alert('Error', 'Failed to like video.');
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);


  useFocusEffect(
    useCallback(() => {
      console.log('ReelsScreen focused');
      setIsScreenFocused(true);
      fetchVideos();
      return () => {
        console.log('ReelsScreen blurred');
        setIsScreenFocused(false);
      };
    }, [])
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading videos...</Text>
      </View>
    );
  }

  return (
    <Reels
      data={videos}
      personalData={{ username: 'Guest', profileImage: 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740' }}
      onLikePress={onLikePress}
      isScreenFocused={isScreenFocused}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
});

export default ReelsScreen;
