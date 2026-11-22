import { API_URL } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { noteCache } from "@/lib/note-cache";
import * as Print from "expo-print";
import { useRouter } from "expo-router";
import {
    AlertCircleIcon,
    EllipsisVertical,
    FileDown,
    Loader2,
    Trash,
} from "lucide-react-native";
import { useRef, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "./alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./dropdown-menu";
import { Icon } from "./icon";
import { Text } from "./text";
import { Alert, AlertTitle } from "./alert";

export default function NotesRightHeader({
    id,
    contentHtml,
}: {
    id: string | null;
    contentHtml: string;
}) {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { token, signOut } = useAuth();

    const [showDelConfirm, setShowDelConfirm] = useState(false);
    const [delLoading, setDelLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deletingRef = useRef(false);

    const dropdownInsets = {
        top: insets.top,
        bottom: insets.bottom,
        left: 4,
        right: 20,
    };

    const handleDelete = async () => {
        if (!id) {
            router.back();
            return;
        }

        deletingRef.current = true;
        setDelLoading(true);

        try {
            console.log("token = ", token);
            const resp = await fetch(`${API_URL}/api/notes/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await resp.json().catch(() => null);

            if (resp.status === 401) return signOut();
            if (!resp.ok) {
                setError(data?.message || "Some error occurred");
                return;
            }

            noteCache.delete(id);
            router.back();
        } catch {
            setError("Some error occured");
        } finally {
            deletingRef.current = false;
            setDelLoading(false);
        }
    };

    const handleDownloadPdf = async () => {
        if (!contentHtml) return;

        try {
            const doc = `<html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <style>
                  body { font-family: Roboto, Helvetica, Arial, sans-serif;
                         color: #000; background: #fff; padding: 24px; line-height: 1.5; }
                  img { max-width: 100%; }
                  pre, code { background: #f4f4f5; }
                </style>
              </head>
              <body>${contentHtml}</body>
            </html>`;

            await Print.printAsync({ html: doc });
        } catch (err) {
            console.error("pdf conversion error: " + error);
            setError("Count not create PDF");
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Icon
                        as={EllipsisVertical}
                        size={20}
                        className="border-2 border-red-500"
                    />
                </DropdownMenuTrigger>

                <DropdownMenuContent insets={dropdownInsets} sideOffset={4}>
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            disabled={!id}
                            onPress={handleDownloadPdf}
                        >
                            <Icon as={FileDown} size={18} />
                            <Text>Download as PDF</Text>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            disabled={!id}
                            onPress={() => {
                                setError("");
                                setShowDelConfirm(true);
                            }}
                        >
                            <Icon
                                as={Trash}
                                size={18}
                                className="text-red-500"
                            />
                            <Text>Delete</Text>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            {confirmDeleteDialog()}
        </>
    );

    function confirmDeleteDialog() {
        return (
            <AlertDialog
                open={showDelConfirm}
                onOpenChange={(value) => {
                    if (deletingRef.current) return;
                    if (value) setError(null);
                    !delLoading && setShowDelConfirm(value);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your note.
                        </AlertDialogDescription>

                        {error && (
                            <Alert variant="destructive" icon={AlertCircleIcon}>
                                <AlertTitle>{error}</AlertTitle>
                            </Alert>
                        )}
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={delLoading}>
                            <Text>Cancel</Text>
                        </AlertDialogCancel>

                        <AlertDialogAction
                            disabled={delLoading}
                            onPress={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                        >
                            {delLoading && (
                                <View className="pointer-events-none animate-spin">
                                    <Icon
                                        as={Loader2}
                                        className="text-primary-foreground"
                                    />
                                </View>
                            )}
                            <Text>Continue</Text>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }
}
