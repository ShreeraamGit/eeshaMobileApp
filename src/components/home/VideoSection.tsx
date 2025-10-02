import React from 'react';
import { View, ImageBackground, TouchableOpacity, ViewStyle, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UI_CONFIG } from '@/config/constants';

interface VideoSectionProps {
  style?: ViewStyle;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ style }) => {
  const containerStyle: ViewStyle = {
    height: 176, // From Figma: Video section height = 176px
    marginHorizontal: 0,
    marginVertical: 0, // No vertical margin, sections are flush
    backgroundColor: UI_CONFIG.COLORS.background.default,
    ...style,
  };

  const overlayStyle: ViewStyle = {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const playButtonStyle: ViewStyle = {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <View style={containerStyle}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=400&fit=crop',
        }}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View style={overlayStyle}>
          <TouchableOpacity style={playButtonStyle}>
            <Ionicons name="play" size={32} color={UI_CONFIG.COLORS.text.primary} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};
