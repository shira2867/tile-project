import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Tile, CreateTile } from "../types/tile.type";
import {
  getAllTiles,
  updateTileColor,
  deleteTile,
  createTile,
} from "../api/tiles";
import { tilesSchema } from "../validation/tileSchema";
import {
  handleSuccessNotification,
  handleErrorNotification,
} from "../constants/message";
import type { Color } from "../types/tile.type";

export function useTile() {
  const queryClient = useQueryClient();

  type PendingTile = Partial<Tile> & { isNew?: boolean; toDelete?: boolean };
  const [pendingChanges, setPendingChanges] = useState<
    Record<string, PendingTile>
  >({});
  const {
    data: tiles = [],
    isLoading,
    isError,
  } = useQuery<Tile[]>({
    queryKey: ["tiles"],
    queryFn: getAllTiles,
  });
  const updateMutation = useMutation({
    mutationFn: async (changes: Tile[]) => {
      const parseResult = tilesSchema.safeParse(changes);
      if (!parseResult.success) {
        console.error("Validation failed:", parseResult.error);
        throw new Error("נתונים לא תקינים");
      }
      return Promise.all(
        parseResult.data.map((tile) => updateTileColor(tile._id, tile.color)),
      );
    },
    onSuccess: (updatedTiles) => {
      queryClient.setQueryData<Tile[]>(["tiles"], (old = []) =>
        old.map((tile) => {
          const updated = updatedTiles.find((t) => t._id === tile._id);
          return updated ? { ...tile, ...updated } : tile;
        }),
      );
      setPendingChanges({});
      handleSuccessNotification("השינויים נשמרו בהצלחה!");
    },
  });

  const createTileMutation = useMutation({
    mutationFn: (newTile: CreateTile) => createTile(newTile),

    onSuccess: (createdTile) => {
      queryClient.setQueryData<Tile[]>(["tiles"], (old = []) => [
        ...old,
        createdTile,
      ]);

      setPendingChanges({});
      handleSuccessNotification("האריח נוצר בהצלחה!");
    },
    onError: (error) => {
      console.error("Save failed:", error);
      handleErrorNotification("אירעה שגיאה ביצירת האריח ");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTile(id),
    onSuccess: ( deletedId) => {
      queryClient.setQueryData<Tile[]>(["tiles"], (old = []) =>
        old.filter((tile) => tile._id !== deletedId),
      );

      setPendingChanges({});
      handleSuccessNotification("האריח נמחק בהצלחה!");
    },
    onError: (error) => {
      console.error("Error deleting tile:", error);
      handleErrorNotification("אירעה שגיאה במחיקה");
    },
  });

  const handleChangeColor = (id: string, newColor: Color) => {
    setPendingChanges((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || tiles.find((t) => t._id === id)),
        color: newColor,
      },
    }));
  };

  const handleDelete = (id: string) => {
    setPendingChanges((prev) => ({
      ...prev,
      [id]: { ...tiles.find((t) => t._id === id)!, toDelete: true },
    }));
  };

  const handleCreateTile = (colorToCreate: Color) => {
    const tempId = "temp-" + Date.now();
    setPendingChanges((prev) => ({
      ...prev,
      [tempId]: {
        _id: tempId,
        color: colorToCreate,
        isNew: true,
      },
    }));
  };
  return {
    tiles,
    isLoading,
    isError,
    pendingChanges,
    setPendingChanges,
    handleChangeColor,
    handleDelete,
    handleCreateTile,
    updateMutation: updateMutation,
    deleteMutation: deleteMutation,
    createTileMutation: createTileMutation,
  };
}
