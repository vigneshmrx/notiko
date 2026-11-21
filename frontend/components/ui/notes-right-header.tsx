import { API_URL } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { noteCache } from "@/lib/note-cache";
import { useRouter } from "expo-router";
import {
    AlertCircleIcon,
    EllipsisVertical,
    FileDown,
    Loader2,
    Trash,
} from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "./button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./dropdown-menu";
import { Icon } from "./icon";
import { Text } from "./text";
import { Alert, AlertDescription, AlertTitle } from "./alert";

export default function NotesRightHeader({ id }: { id: string | null }) {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { token, signOut } = useAuth();

    const [showDelConfirm, setShowDelConfirm] = useState(false);
    const [delLoading, setDelLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            setDelLoading(false);
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
                        <DropdownMenuItem disabled={!id}>
                            <Icon as={FileDown} size={18} />
                            <Text>Download as PDF</Text>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onPress={() => setShowDelConfirm(true)}
                            disabled={!id}
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
            <Dialog
                open={showDelConfirm}
                onOpenChange={(value) =>
                    !delLoading && setShowDelConfirm(value)
                }
            >
                <DialogContent className="">
                    <DialogHeader>
                        <DialogTitle>Delete Note?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this note? This
                            action is not reversible.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="flex-row gap-2 justify-end">
                        <DialogClose asChild>
                            <Button variant="outline" disabled={delLoading}>
                                <Text>Cancel</Text>
                            </Button>
                        </DialogClose>

                        <Button disabled={delLoading} onPress={handleDelete}>
                            {delLoading && (
                                <View className="pointer-events-none animate-spin">
                                    <Icon
                                        as={Loader2}
                                        className="text-primary-foreground"
                                    />
                                </View>
                            )}
                            <Text>Delete</Text>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }
}
