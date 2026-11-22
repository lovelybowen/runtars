import { renderToStaticMarkup } from "react-dom/server";
import { Platform } from "react-native";
import { makeMutable } from "react-native-reanimated";
import { afterEach, expect, it, vi } from "vitest";
import {
  CallKeyboardContext,
  RootControlsHeightContext,
} from "../../lib/calls/call-keyboard-context";
import { ThreadKeyboardView } from "./thread-keyboard-view";

const keyboard = vi.hoisted(() => ({
  height: { value: 0 },
  nativeAvoider: vi.fn(() => null),
  animatedView: vi.fn(() => null),
}));
vi.mock("react-native", () => ({ Platform: { OS: "android" } }));
vi.mock("react-native-keyboard-controller", () => ({
  KeyboardAvoidingView: keyboard.nativeAvoider,
  useReanimatedKeyboardAnimation: () => ({ height: keyboard.height }),
}));
vi.mock("react-native-reanimated", () => ({
  default: { View: keyboard.animatedView },
  makeMutable: (value: number) => ({ value }),
  useAnimatedStyle: (style: () => unknown) => style(),
}));

afterEach(() => {
  vi.clearAllMocks();
  Platform.OS = "android";
});

function renderChat(controlsHeight: number, call: boolean) {
  renderToStaticMarkup(
    <RootControlsHeightContext.Provider value={makeMutable(controlsHeight)}>
      <CallKeyboardContext.Provider value={call}>
        <ThreadKeyboardView nativeHeaderHeight={103} />
      </CallKeyboardContext.Provider>
    </RootControlsHeightContext.Provider>,
  );
}

it.each([
  // keyboard translation, occupied footer, call, expected padding
  [-280, 0, false, 280],
  [-280, 72, false, 208],
  [-336, 72, false, 264],
  [-30, 72, false, 0],
  [0, 72, false, 0],
  [-336, 72, true, 0],
] as const)(
  "uses the Android keyboard overlap (%i, %i, call %s → %i)",
  (height, controls, call, expected) => {
    keyboard.height.value = height;
    renderChat(controls, call);
    expect(keyboard.animatedView).toHaveBeenCalledWith(
      expect.objectContaining({ style: expect.arrayContaining([{ paddingBottom: expected }]) }),
      undefined,
    );
  },
);

it.each([true, false])("keeps the iOS padding avoider with call active = %s", (call) => {
  Platform.OS = "ios";
  renderChat(72, call);
  expect(keyboard.nativeAvoider).toHaveBeenCalledWith(
    expect.objectContaining({ enabled: !call, behavior: "padding", keyboardVerticalOffset: 0 }),
    undefined,
  );
  expect(keyboard.animatedView).not.toHaveBeenCalled();
});
