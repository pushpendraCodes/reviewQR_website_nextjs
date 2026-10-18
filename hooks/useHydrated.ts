'use client';

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** False during SSR and the hydration render, true afterwards. */
export const useHydrated = () => useSyncExternalStore(subscribe, () => true, () => false);
