import NotesRightHeader from "@/components/ui/notes-right-header";
import { Text } from "@/components/ui/text";
import { API_URL } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { noteCache } from "@/lib/note-cache";
import {
    CoreBridge,
    darkEditorTheme,
    RichText,
    TenTapStartKit,
    Toolbar,
    useEditorBridge,
    useEditorContent
} from "@10play/tentap-editor";
import { Stack, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useRef, useState } from "react";
import { AppState, Keyboard, View } from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

const darkCss = `
    * { color: hsl(0 0% 98%); }
    body { background-color: hsl(0 0% 3.9%); padding: 8px 16px; }
`;

const SAVE_DELAY_MS = 1000;
const toPlainText = (html: string) =>
    html
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

export default function NewNoteScreen() {
    const [kbHeight, setKbHeight] = useState(0);
    const { colorScheme } = useColorScheme();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const { token, signOut } = useAuth();
    const insets = useSafeAreaInsets();
    const isDark = colorScheme === "dark";
    const cached = id ? noteCache.get(id) : undefined;

    const editor = useEditorBridge({
        autofocus: !id,
        avoidIosKeyboard: true,
        initialContent: cached?.content ?? "",
        theme: isDark
            ? {
                  ...darkEditorTheme,
                  webview: { backgroundColor: "hsl(0, 0%, 3.9%)" },
                  webviewContainer: { backgroundColor: "hsl(0, 0%, 3.9%)" },
              }
            : undefined,
        bridgeExtensions: [
            ...TenTapStartKit,
            CoreBridge.configureCSS(isDark ? darkCss : ""),
        ],
    });

    const html = useEditorContent(editor, { type: "html" });

    const noteId = useRef<string | null>(cached?.id ?? null);
    const lastSaved = useRef<string>(cached?.content ?? "");
    const latestHtml = useRef<string>("");
    const queue = useRef<Promise<void>>(Promise.resolve());
    const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
        "idle",
    );

    const statusLabel =
        status === "saving"
            ? "Saving..."
            : status === "saved"
              ? "Saved"
              : status === "error"
                ? "Not saved"
                : "";

    useEffect(() => {
        const show = Keyboard.addListener("keyboardDidShow", (e) =>
            setKbHeight(e.endCoordinates.height),
        );
        const hide = Keyboard.addListener("keyboardDidHide", () =>
            setKbHeight(0),
        );
        return () => {
            show.remove();
            hide.remove();
        };
    }, []);

    function save(content: string) {
        queue.current = queue.current.then(async () => {
            const text = toPlainText(content);
            if (content === lastSaved.current) return;
            if (!noteId.current && !text) return;

            setStatus("saving");
            try {
                const resp = await fetch(
                    noteId.current
                        ? `${API_URL}/api/notes/${noteId.current}`
                        : `${API_URL}/api/notes`,
                    {
                        method: noteId.current ? "PUT" : "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ content, text }),
                    },
                );

                if (resp.status === 401) return signOut();
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

                const saved = await resp.json();
                noteCache.set(saved.id, saved);
                noteId.current = saved.id;
                lastSaved.current = content;
                setStatus("saved");
            } catch {
                console.log("error in saving");
                setStatus("error");
            }
        });
    }

    useEffect(() => {
        if (html === undefined) return;
        latestHtml.current = html;
        const timer = setTimeout(() => save(html), SAVE_DELAY_MS);
        return () => clearTimeout(timer);
    }, [html]);

    useEffect(() => {
        const sub = AppState.addEventListener("change", (s) => {
            if (s !== "active") save(latestHtml.current);
        });
        return () => {
            sub.remove();
            save(latestHtml.current);
        };
    }, []);

    useEffect(() => {
        if (!id || cached) return; // no id = new note; cached = already have the data

        let cancelled = false;
        (async () => {
            try {
                const resp = await fetch(`${API_URL}/api/notes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (resp.status === 401) return signOut();
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

                const note = await resp.json();
                if (cancelled) return;

                noteCache.set(note.id, note);
                noteId.current = note.id;
                lastSaved.current = note.content ?? "";
                editor.setContent(note.content ?? "");
            } catch (err) {
                console.log("error loading note", err);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [id]);

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <View className="flex-row gap-2 items-center">
                            <Text className="text-xl font-semibold">
                                {noteId.current ? "Edit Note" : "New Note"}
                            </Text>
                            {statusLabel ? (
                                <Text className="text-xs text-muted-foreground">
                                    {statusLabel}
                                </Text>
                            ) : null}
                        </View>
                    ),
                    headerRight: () => <NotesRightHeader id={noteId.current} />,
                }}
            />
            <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
                <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 8 }}>
                    <RichText editor={editor} />
                </View>

                <View
                    style={{
                        position: "absolute",
                        width: "100%",
                        bottom: kbHeight + insets.bottom,
                    }}
                >
                    <Toolbar editor={editor} />
                </View>
            </SafeAreaView>
        </>
    );
}
