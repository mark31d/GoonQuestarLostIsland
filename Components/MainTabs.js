import React from 'react';
import {View, Text, TouchableOpacity, Image, ImageBackground, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Colors from './Colors';
import AssetRegistry from './AssetRegistry';

import StoriesScreen from './StoriesScreen';
import StoryDetailScreen from './StoryDetailScreen';
import SavedScreen from './SavedScreen';
import ArtifactsScreen from './ArtifactsScreen';
import ArtifactDetailScreen from './ArtifactDetailScreen';
import DiscoveryScreen from './DiscoveryScreen';
import QuizScreen from './QuizScreen';
import MemoryGameScreen from './MemoryGameScreen';
import JournalScreen from './JournalScreen';
import JournalEntryScreen from './JournalEntryScreen';

const Tab = createBottomTabNavigator();

const QuizStack = createNativeStackNavigator();
function QuizNavigator() {
  return (
    <QuizStack.Navigator screenOptions={{headerShown: false}}>
      <QuizStack.Screen name="QuizMain" component={QuizScreen} />
      <QuizStack.Screen name="MemoryGame" component={MemoryGameScreen} />
    </QuizStack.Navigator>
  );
}

const StoriesStack = createNativeStackNavigator();
function StoriesNavigator() {
  return (
    <StoriesStack.Navigator screenOptions={{headerShown: false}}>
      <StoriesStack.Screen name="StoriesList" component={StoriesScreen} />
      <StoriesStack.Screen name="StoryDetail" component={StoryDetailScreen} />
    </StoriesStack.Navigator>
  );
}

const SavedStack = createNativeStackNavigator();
function SavedNavigator() {
  return (
    <SavedStack.Navigator screenOptions={{headerShown: false}}>
      <SavedStack.Screen name="SavedList" component={SavedScreen} />
      <SavedStack.Screen name="StoryDetailFromSaved" component={StoryDetailScreen} />
      <SavedStack.Screen name="JournalList" component={JournalScreen} />
      <SavedStack.Screen name="JournalEntry" component={JournalEntryScreen} />
    </SavedStack.Navigator>
  );
}

const ArtifactsStack = createNativeStackNavigator();
function ArtifactsNavigator() {
  return (
    <ArtifactsStack.Navigator screenOptions={{headerShown: false}}>
      <ArtifactsStack.Screen name="ArtifactsList" component={ArtifactsScreen} />
      <ArtifactsStack.Screen name="ArtifactDetail" component={ArtifactDetailScreen} />
    </ArtifactsStack.Navigator>
  );
}

const TAB_CONFIG = [
  {name: 'StoriesTab', label: 'Stories', iconKey: 'icon_stories'},
  {name: 'SavedTab', label: 'Saved', iconKey: 'icon_saved'},
  {name: 'ArtifactsTab', label: 'Artifacts', iconKey: 'icon_artifacts'},
  {name: 'DiscoveryTab', label: 'Discovery', iconKey: 'icon_discovery'},
  {name: 'QuizTab', label: 'Quiz', iconKey: 'icon_quiz'},
];

function CustomTabBar({state, navigation}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, {paddingBottom: insets.bottom + 6}]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const cfg = TAB_CONFIG[index];

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

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            onPress={onPress}
            activeOpacity={0.75}>
            <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
              <Image
                source={AssetRegistry[cfg.iconKey]}
                style={[
                  styles.tabIcon,
                  {tintColor: isFocused ? Colors.bg_dark : '#ffffff'},
                ]}
              />
            </View>
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
              {cfg.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function MainTabs() {
  return (
    <ImageBackground source={AssetRegistry.bg_main} style={styles.root} imageStyle={styles.rootBg}>
      <View style={styles.rootOverlay} />
      <Tab.Navigator
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={{headerShown: false, contentStyle: {backgroundColor: 'transparent'}}}>
        <Tab.Screen name="StoriesTab" component={StoriesNavigator} />
        <Tab.Screen name="SavedTab" component={SavedNavigator} />
        <Tab.Screen name="ArtifactsTab" component={ArtifactsNavigator} />
        <Tab.Screen name="DiscoveryTab" component={DiscoveryScreen} />
        <Tab.Screen name="QuizTab" component={QuizNavigator} />
      </Tab.Navigator>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  rootBg: {
    resizeMode: 'cover',
  },
  rootOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(14,14,14,0.82)',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(20,16,16,0.82)',
    paddingTop: 10,
    marginHorizontal: -2,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.gold_border,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  iconWrap: {
    width: 56,
    height: 40,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: Colors.gold,
  },
  tabIcon: {
    width: 54,
    height: 54,
    resizeMode: 'contain',
  },
  tabLabel: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: Colors.gold,
    fontWeight: '600',
  },
});
