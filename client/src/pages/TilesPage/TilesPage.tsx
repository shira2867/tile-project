
import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import style from "./TilePage.module.css"
import { useUser } from "../../context/UserContext";
import { useFooter } from "../../context/FooterContext";

import type { Tile, CreateTile } from "../../types/tile.type";
import { getAllTiles, updateTileColor, deleteTile, createTile } from "../../api/tiles";
import { permissions } from "../../constants/permissions";
import { TileComponent } from "../../components/Tile/Tile"
import { tilesSchema } from "../../validation/tileSchema";
import {handleSuccessNotification,handleErrorNotification} from "../../constants/message"
import type { Color } from "../../types/tile.type";
import {colorOptions}  from "../../types/tile.type";



export function TilePage() {
    const queryClient = useQueryClient();
    const userContext = useUser();
const { registerActions } = useFooter();
    const role = userContext.role;
    const perms = permissions[role] || permissions.viewer;
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    type PendingTile = Partial<Tile> & { isNew?: boolean; toDelete?: boolean };
    const [pendingChanges, setPendingChanges] = useState<Record<string, PendingTile>>({});
    //mutation


    const {
        data: tiles = [],
        isLoading,
        isError,
    } = useQuery<Tile[]>({
        queryKey: ["tiles"],
        queryFn: getAllTiles,
    });
    const displayTiles = useMemo(() => {
        const updatedExisting = tiles
            .map((tile) => {
                const pending = pendingChanges[tile._id];
                if (pending?.toDelete) return null;
                if (pending) return { ...tile, ...pending };
                return tile;
            })
            .filter(Boolean) as Tile[];

        const newTiles = Object.values(pendingChanges)
            .filter((change) => change.isNew) as Tile[];

        return [...updatedExisting, ...newTiles];
    }, [tiles, pendingChanges]);

    const updateMutation = useMutation({
        mutationFn: async (changes: Tile[]) => {
            const parseResult = tilesSchema.safeParse(changes);
            if (!parseResult.success) {
                console.error("Validation failed:", parseResult.error);
                throw new Error("נתונים לא תקינים");
            }
            return Promise.all(
                parseResult.data.map(tile => updateTileColor(tile._id, tile.color))
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tiles"] });
            setPendingChanges({});
            handleSuccessNotification("השינויים נשמרו בהצלחה!");
        },
        onError: (error) => {
            console.error("Save failed:", error);
            handleErrorNotification("אירעה שגיאה בשמירת הנתונים");
        }
    });

    const createTileMutation = useMutation({
        mutationFn: (newTile: CreateTile) => createTile(newTile)
        ,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tiles"] });
            setPendingChanges({});
            handleSuccessNotification("האריח נוצר בהצלחה!");
        },
        onError: (error) => {
            console.error("Save failed:", error);
            handleErrorNotification("אירעה שגיאה ביצירת האריח ");
        }
    });

    const deleteMutation = useMutation({

        mutationFn: (id: string) => deleteTile(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tiles"] });
            setPendingChanges({});
        },
        onError: (error) => {
            console.error("Error deleting tile:", error);
            handleErrorNotification("אירעה שגיאה במחיקה");
        }
    });



    const handleChangeColor = (id: string, newColor: Color) => {
        setPendingChanges(prev => ({
            ...prev,
            [id]: { ...(prev[id] || tiles.find(t => t._id === id)), color: newColor }
        }));
    };

    const handleDelete = (id: string) => {
        setPendingChanges(prev => ({
            ...prev,
            [id]: { ...tiles.find(t => t._id === id)!, toDelete: true }
        }));
    };


    const handleCreateTile = (colorToCreate: Color) => {
        const tempId = "temp-" + Date.now();
        setPendingChanges(prev => ({
            ...prev,
            [tempId]: {
                _id: tempId,
                color: colorToCreate,
                isNew: true
            }
        }));
    };

    const handleUndo = useCallback(() => {
        setPendingChanges({});
    }, []);

    const handleSaveTiles = useCallback(async () => {
        const changesToSave = Object.values(pendingChanges);
        if (changesToSave.length === 0) return;

        const creations = changesToSave.filter(c => c.isNew);
        const updates = changesToSave.filter(c => !c.isNew && !c.toDelete);
        const deletions = changesToSave.filter(c => c.toDelete);

        const promises: Promise<any>[] = [];

        creations.forEach(tile =>
            promises.push(createTileMutation.mutateAsync({ color: tile.color! }))
        );

        if (updates.length > 0) {
            promises.push(updateMutation.mutateAsync(updates as Tile[]));
        }

        deletions.forEach(tile => 
            promises.push(deleteMutation.mutateAsync(tile._id!))
        );

        await Promise.all(promises);
        setPendingChanges({}); 
    }, [pendingChanges, createTileMutation, updateMutation, deleteMutation]);

    useEffect(() => {
        registerActions({
            onSave: handleSaveTiles,
            onUndo: handleUndo,
            hasChanges: Object.keys(pendingChanges).length > 0,
            isLoading: deleteMutation.isPending || updateMutation.isPending || createTileMutation.isPending
        });

        return () => registerActions({ 
            onSave: async () => {}, 
            onUndo: () => {}, 
            hasChanges: false 
        });
    }, [pendingChanges, handleSaveTiles, handleUndo, registerActions, deleteMutation.isPending, updateMutation.isPending, createTileMutation.isPending]);

    return (
        <>
            <Header />

            {isLoading ? (
                <div>טוען...</div>
            ) : isError ? (
                <div>אירעה שגיאה</div>
            ) : (
                <div className={style.tilesContainer}>
                    {displayTiles.map(tile => (
                        <TileComponent
                            key={`${tile._id}-${tile.color}`}
                            _id={tile._id}
                            color={tile.color}
                            colors={colorOptions}
                            canEditColor={perms.editColor}
                            canDelete={perms.delete}
                            onChangeColor={(newColor) => handleChangeColor(tile._id, newColor)}
                            onDelete={() => handleDelete(tile._id)}
                        />
                    ))}

                    {perms.create && (
                        <div className={style.addTileWrapper}>
                            {!isPickerOpen ? (
                                <button
                                    className={style.addButton}
                                    onClick={() => setIsPickerOpen(true)}
                                >
                                    +
                                </button>
                            ) : (
                                <div className={style.colorPicker}>
                                    <div className={style.colorGrid}>
                                        {colorOptions.map((c) => (
                                            <button
                                                key={c}
                                                onClick={() => {
                                                    handleCreateTile(c);
                                                    setIsPickerOpen(false);
                                                 }}
                                                data-color={c}                  
                                                className={style.ColorOption}
                                            />
                                        ))}

                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <Footer />
        </>
    );
}