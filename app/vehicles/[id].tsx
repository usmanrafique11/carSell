import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useVehicles } from '@/state/vehicles-context';
import { formatTimeUntilAuction } from '@/utils/auction';

export default function VehicleDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getVehicleById, toggleFavourite } = useVehicles();
  const vehicle = typeof id === 'string' ? getVehicleById(id) : undefined;

  const tint = useThemeColor({}, 'tint');
  const muted = useThemeColor({}, 'tabIconDefault');
  const borderColor = useThemeColor({}, 'tabIconDefault');

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const auctionIn = useMemo(() => {
    if (!vehicle) return '';
    return formatTimeUntilAuction(vehicle.auctionDateTime, now);
  }, [vehicle, now]);

  if (!vehicle) {
    return (
      <ThemedView style={styles.page}>
        <Stack.Screen options={{ title: 'Vehicle' }} />
        <ThemedText type="title">Not found</ThemedText>
        <ThemedText style={{ color: muted }}>This vehicle doesn’t exist (or the link is invalid).</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.page}>
      <Stack.Screen options={{ title: `${vehicle.make} ${vehicle.model}` }} />
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={[styles.hero, { borderColor }]}>
          <Image
            source={require('../../assets/images/car.avif')}
            style={{ width: '100%', height: 200, borderRadius: 16 }}
            resizeMode="cover"
          />
        </ThemedView>



        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <ThemedText type="title">
              {vehicle.make} {vehicle.model}
            </ThemedText>
            <ThemedText style={{ color: muted }}>
              {vehicle.year} • {vehicle.mileage.toLocaleString()} mi • {vehicle.engineSize} • {vehicle.fuel}
            </ThemedText>
          </View>

          <Pressable
            onPress={() => toggleFavourite(vehicle.id)}
            hitSlop={10}
            style={({ pressed }) => [styles.favBtn, { borderColor, opacity: pressed ? 0.6 : 1 }]}>
            <IconSymbol name={vehicle.favourite ? 'star.fill' : 'star'} size={22} color={vehicle.favourite ? tint : muted} />
            <ThemedText type="defaultSemiBold">{vehicle.favourite ? 'Favourited' : 'Favourite'}</ThemedText>
          </Pressable>
        </View>

        <ThemedView style={[styles.section, { borderColor }]}>
          <ThemedText type="subtitle">Auction</ThemedText>
          <View style={styles.kvRow}>
            <ThemedText type="defaultSemiBold">Auction date/time</ThemedText>
            <ThemedText>{vehicle.auctionDateTime}</ThemedText>
          </View>
          <View style={styles.kvRow}>
            <ThemedText type="defaultSemiBold">Auction begins in</ThemedText>
            <ThemedText>{auctionIn}</ThemedText>
          </View>
          <View style={styles.kvRow}>
            <ThemedText type="defaultSemiBold">Starting bid</ThemedText>
            <ThemedText>£{vehicle.startingBid.toLocaleString()}</ThemedText>
          </View>
        </ThemedView>

        <ThemedView style={[styles.section, { borderColor }]}>
          <ThemedText type="subtitle">Details</ThemedText>
          <ThemedText style={{ color: muted }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer iaculis, massa non egestas feugiat, lorem sem
            rutrum tortor, at iaculis ex libero at lectus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            posuere cubilia curae; Proin at ullamcorper turpis. Quisque commodo, erat eu consequat consectetur, urna justo
            tempus ex, vitae luctus ligula mi sed sapien.
          </ThemedText>
          <ThemedText style={{ color: muted }}>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
            aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  content: {
    paddingBottom: 24,
    gap: 14,
  },
  hero: {
    borderWidth: 1,
    borderRadius: 16,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  favBtn: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  section: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  kvRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
  },
});

