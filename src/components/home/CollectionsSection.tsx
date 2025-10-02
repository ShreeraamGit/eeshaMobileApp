import React from 'react';
import { View, ImageBackground, TouchableOpacity, ViewStyle, StyleSheet } from 'react-native';
import { Text } from '@/components/common/Text';
import { UI_CONFIG } from '@/config/constants';
import { getScaledFontSize } from '@/utils/responsive';

interface Collection {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  overlay?: string;
}

interface CollectionsSectionProps {
  style?: ViewStyle;
}

export const CollectionsSection: React.FC<CollectionsSectionProps> = ({ style }) => {
  const collections: Collection[] = [
    {
      id: '1',
      title: 'October',
      subtitle: 'COLLECTION',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=400&fit=crop',
      overlay: 'rgba(110, 113, 145, 0.7)' // #6e7191 from design system
    },
    {
      id: '2',
      title: 'Autumn',
      subtitle: 'COLLECTION',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
      overlay: 'rgba(248, 240, 231, 0.8)' // #f8f0e7 from design system
    },
  ];

  const containerStyle: ViewStyle = {
    paddingTop: 32, // Add top spacing from previous section
    paddingBottom: 40, // Add bottom spacing before next section
    backgroundColor: UI_CONFIG.COLORS.background.default,
    ...style,
  };

  const firstCollectionStyle: ViewStyle = {
    height: 240, // From Figma: Frame 2 height = 240px
    marginBottom: 40, // Gap between collections
    overflow: 'hidden',
  };

  const secondCollectionStyle: ViewStyle = {
    height: 296, // From Figma: Image 9 height = 296px
    width: 260, // From Figma: Image 9 width = 260px
    alignSelf: 'center',
    marginBottom: 0,
    overflow: 'hidden',
  };

  const overlayStyle: ViewStyle = {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const textContainerStyle: ViewStyle = {
    alignItems: 'center',
  };

  const renderCollection = (collection: Collection, index: number) => (
    <TouchableOpacity key={collection.id} style={index === 0 ? firstCollectionStyle : secondCollectionStyle}>
      <ImageBackground
        source={{ uri: collection.image }}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View style={[overlayStyle, { backgroundColor: collection.overlay }]}>
          <View style={textContainerStyle}>
            <Text
              variant="h1"
              color={index === 0 ? "text.inverse" : "text.primary"}
              style={{
                fontSize: getScaledFontSize(48),
                fontWeight: '300',
                marginBottom: 4,
                textAlign: 'center'
              }}
            >
              {collection.title}
            </Text>
            <Text
              variant="caption"
              color={index === 0 ? "text.inverse" : "text.primary"}
              style={{
                letterSpacing: 3,
                fontWeight: '300',
                textAlign: 'center',
                fontSize: 14
              }}
            >
              {collection.subtitle}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  const titleContainerStyle: ViewStyle = {
    marginTop: 0,
    marginBottom: 56, // From Figma: Title at y=0, Frame 2 at y=56
  };

  return (
    <View style={containerStyle}>
      <View style={titleContainerStyle}>
        <Text
          variant="h2"
          color="text.primary"
          style={{
            textAlign: 'center',
            letterSpacing: 1,
            marginBottom: 0
          }}
        >
          COLLECTIONS
        </Text>
      </View>

      {collections.map(renderCollection)}
    </View>
  );
};