import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ReelsScreen from './ReelsScreen';
import UploadScreen from './UploadScreen';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const iconName = route.name === 'Reels' ? 'play-circle-outline' : 'cloud-upload-outline';
          const label = route.name;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.8}
            >
              <View style={styles.tabItem}>
                <Ionicons
                  name={iconName}
                  size={20}
                  color={isFocused ? '#B3E5FC' : '#fff'}
                  style={isFocused && styles.iconFocused}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isFocused ? '#B3E5FC' : '#fff' },
                  ]}
                >
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="Reels"
          component={ReelsScreen}
          initialParams={{ tabBarHeight: 70 }}
        />
        <Tab.Screen name="Upload" component={UploadScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  tabBarContainer: {
    backgroundColor: '#1E88E5',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#000',
    
  },

  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconFocused: {
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
  },
});

export default HomeScreen;