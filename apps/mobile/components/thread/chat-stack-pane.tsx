import type { ReactNode } from "react";
import { useContext } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { CallKeyboardContext } from "../../lib/calls/call-keyboard-context";

/** The Android stack pane stays mounted across pushes and pops. Its bottom and the system
 * keyboard frame share window coordinates, even while a thread's native header is moving. */
export function ChatStackPane({
  pathname,
  style,
  children,
}: {
  pathname: string;
  style: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  const call = useContext(CallKeyboardContext);
  if (Platform.OS !== "android") return <View style={style}>{children}</View>;
  return (
    <KeyboardAvoidingView
      behavior="padding"
      enabled={!call && (pathname === "/thread" || pathname === "/group-thread")}
      style={style}
    >
      {children}
    </KeyboardAvoidingView>
  );
}
