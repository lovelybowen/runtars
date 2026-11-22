import { useContext } from "react";
import type { ViewProps } from "react-native";
import { Platform } from "react-native";
import {
  KeyboardAvoidingView,
  useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import {
  CallKeyboardContext,
  RootControlsHeightContext,
} from "../../lib/calls/call-keyboard-context";
import { threadHeaderFloats } from "../../lib/thread/scroll/thread-edges";

type FrameProps = Pick<ViewProps, "children" | "style">;

function AndroidKeyboardView({ children, style, enabled }: FrameProps & { enabled: boolean }) {
  const { height } = useReanimatedKeyboardAnimation();
  const controlsHeight = useContext(RootControlsHeightContext);
  // The root controls already lift the chat by their laid-out height.
  const padding = useAnimatedStyle(() => ({
    paddingBottom: enabled ? Math.max(-height.value - (controlsHeight?.value ?? 0), 0) : 0,
  }));
  return <Animated.View style={[style, padding]}>{children}</Animated.View>;
}

export function ThreadKeyboardView({
  children,
  style,
  nativeHeaderHeight,
}: FrameProps & { nativeHeaderHeight: number }) {
  const rootAvoidsKeyboard = useContext(CallKeyboardContext);
  if (Platform.OS === "android") {
    return (
      <AndroidKeyboardView enabled={!rootAvoidsKeyboard} style={style}>
        {children}
      </AndroidKeyboardView>
    );
  }
  return (
    <KeyboardAvoidingView
      enabled={!rootAvoidsKeyboard}
      behavior="padding"
      keyboardVerticalOffset={
        Platform.OS === "ios" && !threadHeaderFloats() ? nativeHeaderHeight : 0
      }
      style={style}
    >
      {children}
    </KeyboardAvoidingView>
  );
}
