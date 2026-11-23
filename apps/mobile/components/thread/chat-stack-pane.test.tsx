// @vitest-environment jsdom
import type { ReactNode } from "react";
import { act } from "react";
import type { Root } from "react-dom/client";
import { createRoot } from "react-dom/client";
import { Platform } from "react-native";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { CallKeyboardContext } from "../../lib/calls/call-keyboard-context";
import { ChatStackPane } from "./chat-stack-pane";

vi.mock("react-native", () => ({
  Platform: { OS: "android" },
  View: "div",
  KeyboardAvoidingView: ({ enabled, children }: { enabled: boolean; children: ReactNode }) => (
    <div data-avoiding={enabled}>{children}</div>
  ),
}));

const container = document.createElement("div");
let root: Root;

beforeEach(() => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  Platform.OS = "android";
});

function show(pathname: string, chat?: string, call = false) {
  act(() =>
    root.render(
      <CallKeyboardContext.Provider value={call}>
        <ChatStackPane pathname={pathname} style={{ flex: 1 }}>
          <span key={chat}>{chat}</span>
        </ChatStackPane>
      </CallKeyboardContext.Provider>,
    ),
  );
  return container.firstElementChild!;
}

it("keeps the Android keyboard observer mounted when reopening and switching chats", () => {
  const pane = show("/");
  expect(pane.getAttribute("data-avoiding")).toBe("false");
  for (const bot of ["Researcher", "Researcher", "Writer"]) {
    expect(show("/thread", bot)).toBe(pane);
    expect(pane.getAttribute("data-avoiding")).toBe("true");
    expect(show("/")).toBe(pane);
    expect(pane.getAttribute("data-avoiding")).toBe("false");
  }
  expect(show("/group-thread").getAttribute("data-avoiding")).toBe("true");
  expect(show("/thread", "Writer", true).getAttribute("data-avoiding")).toBe("false");
});

it("leaves iOS keyboard avoidance to the thread", () => {
  Platform.OS = "ios";
  expect(show("/thread").hasAttribute("data-avoiding")).toBe(false);
});
