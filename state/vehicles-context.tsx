import React, { createContext, useContext, useMemo, useState } from 'react';

import vehiclesJson from '@/data/vehicles.json';

export type Vehicle = {
  id: string;
  make: string;
  model: string;
  engineSize: string;
  fuel: string;
  year: number;
  mileage: number;
  auctionDateTime: string;
  startingBid: number;
  favourite: boolean;
};

type VehiclesContextValue = {
  vehicles: Vehicle[];
  toggleFavourite: (id: string) => void;
  getVehicleById: (id: string) => Vehicle | undefined;
};

const VehiclesContext = createContext<VehiclesContextValue | null>(null);

function makeInitialVehicles(): Vehicle[] {
  const raw = vehiclesJson as Omit<Vehicle, 'id'>[];
  return raw.map((v, idx) => ({
    id: `${idx}`,
    ...v,
  }));
}

export function VehiclesProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => makeInitialVehicles());

  const value = useMemo<VehiclesContextValue>(() => {
    return {
      vehicles,
      toggleFavourite: (id: string) => {
        setVehicles((prev) =>
          prev.map((v) => (v.id === id ? { ...v, favourite: !v.favourite } : v))
        );
      },
      getVehicleById: (id: string) => vehicles.find((v) => v.id === id),
    };
  }, [vehicles]);

  return <VehiclesContext.Provider value={value}>{children}</VehiclesContext.Provider>;
}

export function useVehicles() {
  const ctx = useContext(VehiclesContext);
  if (!ctx) throw new Error('useVehicles must be used within VehiclesProvider');
  return ctx;
}

