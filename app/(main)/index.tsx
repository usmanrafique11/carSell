import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { VehicleCard } from "@/components/vehicle-card";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useVehicles } from "@/state/vehicles-context";

function parseBid(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const n = Number(trimmed);
  if (Number.isNaN(n)) return undefined;
  return n;
}

const PAGE_SIZE = 20;

export default function VehiclesScreen() {
  const router = useRouter();
  const { vehicles, toggleFavourite } = useVehicles();

  const [makeQuery, setMakeQuery] = useState("");
  const [modelQuery, setModelQuery] = useState("");
  const [minBid, setMinBid] = useState("");
  const [maxBid, setMaxBid] = useState("");
  const [favouritesOnly, setFavouritesOnly] = useState(false);

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const inputBg = useThemeColor({}, "background");
  const borderColor = useThemeColor({}, "tabIconDefault");
  const muted = useThemeColor({}, "tabIconDefault");

  const filteredVehicles = useMemo(() => {
    const make = makeQuery.trim().toLowerCase();
    const model = modelQuery.trim().toLowerCase();
    const min = parseBid(minBid);
    const max = parseBid(maxBid);

    return vehicles.filter((v) => {
      if (favouritesOnly && !v.favourite) return false;
      if (make && !v.make.toLowerCase().includes(make)) return false;
      if (model && !v.model.toLowerCase().includes(model)) return false;
      if (min != null && v.startingBid < min) return false;
      if (max != null && v.startingBid > max) return false;
      return true;
    });
  }, [vehicles, favouritesOnly, makeQuery, modelQuery, minBid, maxBid]);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [favouritesOnly, makeQuery, modelQuery, minBid, maxBid]);

  const visibleVehicles = useMemo(() => {
    return filteredVehicles.slice(0, visibleCount);
  }, [filteredVehicles, visibleCount]);

  const hasMore = visibleVehicles.length < filteredVehicles.length;

  return (
    <ThemedView style={styles.page}>
      <View style={styles.header}>
        <ThemedText type="title">Vehicles</ThemedText>
        <ThemedText style={{ color: muted }}>
          {filteredVehicles.length} results
        </ThemedText>
      </View>

      <ThemedView style={[styles.filtersCard, { borderColor }]}>
        <View style={styles.filtersGrid}>
          <View style={styles.filterField}>
            <ThemedText type="defaultSemiBold">Make</ThemedText>
            <TextInput
              value={makeQuery}
              onChangeText={setMakeQuery}
              placeholder="e.g. Toyota"
              placeholderTextColor={muted}
              style={[styles.input, { borderColor, backgroundColor: inputBg }]}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          <View style={styles.filterField}>
            <ThemedText type="defaultSemiBold">Model</ThemedText>
            <TextInput
              value={modelQuery}
              onChangeText={setModelQuery}
              placeholder="e.g. Corolla"
              placeholderTextColor={muted}
              style={[styles.input, { borderColor, backgroundColor: inputBg }]}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          <View style={styles.filterField}>
            <ThemedText type="defaultSemiBold">Min bid</ThemedText>
            <TextInput
              value={minBid}
              onChangeText={setMinBid}
              placeholder="e.g. 10000"
              placeholderTextColor={muted}
              keyboardType="numeric"
              style={[styles.input, { borderColor, backgroundColor: inputBg }]}
            />
          </View>

          <View style={styles.filterField}>
            <ThemedText type="defaultSemiBold">Max bid</ThemedText>
            <TextInput
              value={maxBid}
              onChangeText={setMaxBid}
              placeholder="e.g. 20000"
              placeholderTextColor={muted}
              keyboardType="numeric"
              style={[styles.input, { borderColor, backgroundColor: inputBg }]}
            />
          </View>
        </View>

        <View style={styles.filtersRow}>
          <View style={styles.switchRow}>
            <Switch value={favouritesOnly} onValueChange={setFavouritesOnly} />
            <ThemedText type="defaultSemiBold">Favourites only</ThemedText>
          </View>

          <Pressable
            onPress={() => {
              setMakeQuery("");
              setModelQuery("");
              setMinBid("");
              setMaxBid("");
              setFavouritesOnly(false);
            }}
            style={({ pressed }) => [
              styles.resetBtn,
              { borderColor, opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <ThemedText type="defaultSemiBold">Reset</ThemedText>
          </Pressable>
        </View>
      </ThemedView>

      <FlatList
        data={visibleVehicles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <VehicleCard
            vehicle={item}
            now={now}
            onToggleFavourite={() => toggleFavourite(item.id)}
            onPress={() => router.push(`/vehicles/${item.id}`)}
          />
        )}
        onEndReached={() => {
          if (!hasMore) return;
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredVehicles.length));
        }}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          <ThemedView style={[styles.empty, { borderColor }]}>
            <ThemedText type="subtitle">No matches</ThemedText>
            <ThemedText style={{ color: muted }}>
              Try clearing some filters.
            </ThemedText>
          </ThemedView>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    gap: 6,
    marginBottom: 14,
  },
  filtersCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  filtersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  filterField: {
    flexGrow: 1,
    flexBasis: 160,
    gap: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  filtersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  resetBtn: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  listContent: {
    paddingTop: 14,
    paddingBottom: 24,
    gap: 12,
  },
  empty: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },
});
