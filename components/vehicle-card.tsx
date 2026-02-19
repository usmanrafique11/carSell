import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { Vehicle } from '@/state/vehicles-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formatTimeUntilAuction } from '@/utils/auction';

export function VehicleCard({
  vehicle,
  now,
  onPress,
  onToggleFavourite,
}: {
  vehicle: Vehicle;
  now: Date;
  onPress: () => void;
  onToggleFavourite: () => void;
}) {
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const tint = useThemeColor({}, 'tint');
  const textMuted = useThemeColor({}, 'tabIconDefault');

  const timeUntil = useMemo(() => formatTimeUntilAuction(vehicle.auctionDateTime, now), [vehicle, now]);

  return (
    <ThemedView style={[styles.card, { borderColor }]}>
      <Pressable onPress={onPress} style={styles.row}>
        <ThemedView style={[styles.imagePlaceholder, { borderColor }]}>
          <ThemedText type="defaultSemiBold" style={styles.imagePlaceholderText}>
            Image
          </ThemedText>
          <ThemedText style={[styles.imagePlaceholderText, { color: textMuted }]}>placeholder</ThemedText>
        </ThemedView>

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <ThemedText type="defaultSemiBold" style={styles.title}>
              {vehicle.make} {vehicle.model}
            </ThemedText>

            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onToggleFavourite();
              }}
              hitSlop={10}
              style={styles.favButton}>
              <IconSymbol
                name={vehicle.favourite ? 'star.fill' : 'star'}
                size={22}
                color={vehicle.favourite ? tint : textMuted}
              />
            </Pressable>
          </View>

          <ThemedText style={[styles.meta, { color: textMuted }]}>
            {vehicle.year} • {vehicle.mileage.toLocaleString()} mi • {vehicle.engineSize} • {vehicle.fuel}
          </ThemedText>

          <View style={styles.footerRow}>
            <ThemedText type="defaultSemiBold">Starting bid: £{vehicle.startingBid.toLocaleString()}</ThemedText>
            <ThemedText style={[styles.meta, { color: textMuted }]}>Auction in: {timeUntil}</ThemedText>
          </View>

          {vehicle.favourite ? (
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { borderColor: tint }]}>
                <ThemedText style={[styles.badgeText, { color: tint }]}>Favourite</ThemedText>
              </View>
            </View>
          ) : null}
        </View>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  imagePlaceholder: {
    width: 84,
    height: 84,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    fontSize: 12,
    lineHeight: 16,
  },
  content: {
    flex: 1,
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  title: {
    flex: 1,
  },
  favButton: {
    paddingTop: 2,
  },
  meta: {
    fontSize: 13,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    flexWrap: 'wrap',
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
});

