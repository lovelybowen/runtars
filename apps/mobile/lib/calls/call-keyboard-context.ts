import { createContext } from "react";
import type { SharedValue } from "react-native-reanimated";

// Screen avoiders yield to the root while call controls share its keyboard space.
export const CallKeyboardContext = createContext(false);

// Card screens end above the root playback controls. Modals cover the window.
export const RootControlsHeightContext = createContext<SharedValue<number> | null>(null);
