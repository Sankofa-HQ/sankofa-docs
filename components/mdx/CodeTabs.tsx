import { CodeBlock } from "./CodeBlock";
import { CodeGroup, CodeGroupItem } from "./CodeGroup";

type LegacyTab = { label: string; code: string; lang?: string };

const LABEL_TO_TAB: Record<string, string> = {
  flutter: "flutter",
  "android (kotlin)": "android",
  android: "android",
  "web (npm)": "web",
  "web (cdn)": "web-cdn",
  web: "web",
  "ios (swift)": "ios",
  "ios (objc)": "ios-objc",
  ios: "ios",
  "react native": "react-native",
  "react-native": "react-native",
  rn: "react-native",
  go: "go",
  node: "node",
  java: "java",
  python: "python",
  curl: "curl",
};

const LABEL_TO_LANG: Record<string, string> = {
  flutter: "dart",
  "android (kotlin)": "kotlin",
  android: "kotlin",
  "web (npm)": "ts",
  "web (cdn)": "html",
  web: "ts",
  "ios (swift)": "swift",
  "ios (objc)": "objective-c",
  ios: "swift",
  "react native": "tsx",
  "react-native": "tsx",
  rn: "tsx",
  go: "go",
  node: "ts",
  java: "java",
  python: "python",
  curl: "bash",
};

/**
 * Legacy <CodeTabs tabs={[{label, code}]} />. Adapts to the new <CodeGroup>.
 * New MDX should use <CodeGroup> with <CodeGroupItem> children directly.
 */
export function CodeTabs({ tabs }: { tabs: LegacyTab[] }) {
  return (
    <CodeGroup>
      {tabs.map((t) => {
        const key = t.label.toLowerCase().trim();
        const tab = LABEL_TO_TAB[key] ?? key.replace(/[^a-z0-9]+/g, "-");
        const lang = t.lang ?? LABEL_TO_LANG[key] ?? "text";
        return (
          <CodeGroupItem key={t.label} tab={tab} label={t.label}>
            <CodeBlock code={t.code} lang={lang} hideLang />
          </CodeGroupItem>
        );
      })}
    </CodeGroup>
  );
}
