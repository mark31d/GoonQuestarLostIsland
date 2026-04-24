import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  Share,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useApp} from '../App';
import AssetRegistry from './AssetRegistry';
import Colors from './Colors';

export default function StoryDetailScreen({route, navigation}) {
  const {story} = route.params;
  const {isSaved, toggleSaved} = useApp();
  const insets = useSafeAreaInsets();
  const saved = isSaved(story.id);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${story.title}\n\n${story.body.substring(0, 200)}...`,
        title: story.title,
      });
    } catch {}
  };

  return (
    <ImageBackground source={AssetRegistry.bg_main} style={[styles.container, {paddingBottom: insets.bottom}]} imageStyle={styles.bgImage}>
      <View style={styles.bgOverlay} />

      <View style={[styles.topBar, {top: insets.top + 10}]}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}>
          <Image source={AssetRegistry.icon_back} style={styles.iconImg} />
        </TouchableOpacity>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => toggleSaved(story)}
            activeOpacity={0.8}>
            <Image
              source={saved ? AssetRegistry.icon_heart_filled : AssetRegistry.icon_heart}
              style={[styles.iconImg, saved && {tintColor: '#FF6B6B'}]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handleShare}
            activeOpacity={0.8}>
            <Image source={AssetRegistry.icon_share} style={styles.iconImg} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, {paddingTop: insets.top + 68}]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.titleArea}>
          <Text style={styles.title}>{story.title}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{story.category}</Text>
          </View>
        </View>

        <View style={styles.textCard}>
          <Text style={styles.bodyText}>{story.body}</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {resizeMode: 'cover'},
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(14,14,14,0.82)',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.bg_dark,
  },
  topBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    backgroundColor: '#C41014',
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#E52020',
    overflow: 'hidden',
  },
  iconBtn: {
    width: 74,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#C41014',
    borderWidth: 1,
    borderColor: '#E52020',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtn: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: 'rgba(255,255,255,0.9)',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  titleArea: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.gold,
    lineHeight: 33,
    textAlign: 'center',
  },
  badge: {
    alignSelf: 'center',
    backgroundColor: Colors.gold_muted,
    borderWidth: 1,
    borderColor: Colors.gold_border,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gold_light,
  },
  textCard: {
    marginHorizontal: 16,
    backgroundColor: 'rgba(20,16,16,0.82)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.gold_border,
    padding: 20,
  },
  bodyText: {
    fontSize: 15,
    color: Colors.text_secondary,
    lineHeight: 25,
  },
});
