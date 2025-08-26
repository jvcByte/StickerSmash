import { StyleSheet, Platform } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

type NotificationBadgeProps = {
  count: number;
  size?: number;
  color?: string;
  textColor?: string;
};

export function NotificationBadge({ 
  count, 
  size = 18, 
  color = '#FF3B30',
  textColor = 'white' 
}: NotificationBadgeProps) {
  if (count <= 0) return null;

  return (
    <ThemedView style={[
      styles.badge,
      { 
        backgroundColor: color,
        width: size,
        height: size,
        borderRadius: size / 2,
        right: -size / 2,
        top: -size / 2,
      }
    ]}>
      <ThemedText 
        style={[
          styles.text, 
          { 
            color: textColor,
            fontSize: size * 0.6,
            lineHeight: size * 0.8
          }
        ]}
        numberOfLines={1}
      >
        {count > 9 ? '9+' : count}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        marginTop: -1,
      },
      android: {
        marginTop: -2,
        marginLeft: 1,
      },
    }),
  },
});
