import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DocumentPicker from 'react-native-document-picker';
import api from '../services/api';

const UploadScreen = () => {
  const [title, setTitle] = useState('');
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null); // New state for thumbnail
  const [isUploading, setIsUploading] = useState(false);

  // Pick thumbnail image
  const pickThumbnail = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images], // Only images for thumbnail
      });
      setThumbnail(res[0]);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error('Error picking thumbnail:', err);
        Alert.alert('Error', 'Failed to pick thumbnail. Please try again.', [
          { text: 'OK' },
        ]);
      }
    }
  };

  // Pick video
  const pickVideo = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
      });
      setVideo(res[0]);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error('Error picking video:', err);
        Alert.alert('Error', 'Failed to pick video. Please try again.', [
          { text: 'OK' },
        ]);
      }
    }
  };

  // Handle upload with video, title, and thumbnail
  const handleUpload = async () => {
    if (!video || !title || !thumbnail) {
      Alert.alert('Missing Information', 'Please provide a title, video, and thumbnail.', [
        { text: 'OK' },
      ]);
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('video', {
        uri: video.uri,
        type: video.type,
        name: video.name,
      });
      formData.append('title', title);
      formData.append('thumbnail', {
        uri: thumbnail.uri,
        type: thumbnail.type,
        name: thumbnail.name,
      });

      const data = await api.uploadVideo(formData);
      console.log('Uploaded:', data);
      Alert.alert('Success', 'Video uploaded successfully!', [{ text: 'OK' }]);
      setTitle('');
      setVideo(null);
      setThumbnail(null);
    } catch (err) {
      console.error('Error uploading:', err);
      Alert.alert('Error', 'Failed to upload video. Please try again.', [
        { text: 'OK' },
      ]);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Upload Video</Text>
            <Text style={styles.subtitle}>Share your content with Boom Entertainment</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Icon name="title" size={24} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Video Title"
                placeholderTextColor="#999"
                value={title}
                onChangeText={setTitle}
                editable={!isUploading}
                autoCapitalize="sentences"
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={pickThumbnail}
              disabled={isUploading}
              style={styles.pickerButtonContainer}
            >
              <LinearGradient
                colors={['#FFFFFF', '#F5F7FA']}
                style={styles.pickerButton}
              >
                <Icon name="image" size={24} color="#1E88E5" style={styles.buttonIcon} />
                <Text style={styles.pickerButtonText}>
                  {thumbnail ? 'Change Thumbnail' : 'Pick Thumbnail'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {thumbnail && (
              <View style={styles.selectedVideoContainer}>
                <Icon name="image" size={24} color="#1E88E5" style={styles.videoIcon} />
                <Text style={styles.selectedVideoText} numberOfLines={1}>
                  {thumbnail.name}
                </Text>
              </View>
            )}

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={pickVideo}
              disabled={isUploading}
              style={styles.pickerButtonContainer}
            >
              <LinearGradient
                colors={['#FFFFFF', '#F5F7FA']}
                style={styles.pickerButton}
              >
                <Icon name="video-library" size={24} color="#1E88E5" style={styles.buttonIcon} />
                <Text style={styles.pickerButtonText}>
                  {video ? 'Change Video' : 'Pick Video'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {video && (
              <View style={styles.selectedVideoContainer}>
                <Icon name="movie" size={24} color="#1E88E5" style={styles.videoIcon} />
                <Text style={styles.selectedVideoText} numberOfLines={1}>
                  {video.name}
                </Text>
              </View>
            )}

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleUpload}
              disabled={!video || !title || !thumbnail || isUploading}
              style={[
                styles.uploadButtonContainer,
                (!video || !title || !thumbnail || isUploading) && styles.disabledButton,
              ]}
            >
              <LinearGradient
                colors={['#a2ab58', '#a2ab58']}
                style={styles.uploadButton}
              >
                {isUploading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.uploadButtonText}>Upload</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  formContainer: {
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  pickerButtonContainer: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonIcon: {
    marginRight: 10,
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#1E88E5',
    fontWeight: '600',
  },
  selectedVideoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  videoIcon: {
    marginRight: 10,
  },
  selectedVideoText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  uploadButtonContainer: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  uploadButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default UploadScreen;