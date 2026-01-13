
import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import style from "./TilePage.module.css"
import { useUser } from "../../context/UserContext";
import { useFooter } from "../../context/FooterContext";

import type { Tile, CreateTile } from "../../types/tile.type";
import { getAllTiles, getColors, updateTileColor, deleteTile, createTile } from "../../api/tiles";
import { permissions } from "../../constants/permissions";
import { TileComponent } from "../../components/Tile/Tile"
import { tilesSchema } from "../../validation/tileSchema";

export function TilePage() {
    const queryClient = useQueryClient();
    const userContext = useUser();
    const { setFooterActions } = useFooter();

    const role = userContext.role;
    const perms = permissions[role] || permissions.viewer;
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    type PendingTile = Partial<Tile> & { isNew?: boolean; toDelete?: boolean };
    const [pendingChanges, setPendingChanges] = useState<Record<string, PendingTile>>({});
    //mutation
    const {
        data: colors = [],
    } = useQuery<string[]>({
        queryKey: ["colors"],
        queryFn: getColors,
    });


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
            alert("השינויים נשמרו בהצלחה!");
        },
        onError: (error) => {
            console.error("Save failed:", error);
            alert("אירעה שגיאה בשמירת הנתונים");
        }
    });

    const createTileMutation = useMutation({
        mutationFn: (newTile: CreateTile) => createTile(newTile)
        ,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tiles"] });
            setPendingChanges({});
            alert("האריח נוצר בהצלחה!");
        },
        onError: (error) => {
            console.error("Save failed:", error);
            alert("אירעה שגיאה ביצירת האריח ");
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
            alert("אירעה שגיאה במחיקה");
        }
    });



    const handleChangeColor = (id: string, newColor: string) => {
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


    const handleCreateTile = (colorToCreate: string) => {
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


    const handleSaveTiles = useCallback(() => {
        const changesToSave = Object.values(pendingChanges);
        if (changesToSave.length === 0) return;

        const creations = changesToSave.filter(c => c.isNew);
        const updates = changesToSave.filter(c => !c.isNew && !c.toDelete);
        const deletions = changesToSave.filter(c => c.toDelete);

        creations.forEach(tile =>
            createTileMutation.mutate({ color: tile.color! })
        );

        if (updates.length > 0) updateMutation.mutate(updates as Tile[]);

        deletions.forEach(tile => deleteMutation.mutate(tile._id!));

        setPendingChanges({});
    }, [pendingChanges]);




    useEffect(() => {
        setFooterActions({
            onSave: handleSaveTiles,
            onUndo: handleUndo,
            disabled:
                Object.keys(pendingChanges).length === 0 ||
                deleteMutation.isPending ||
                updateMutation.isPending || createTileMutation.isPending
        });
    }, [
        pendingChanges,
        handleSaveTiles,
        handleUndo,
        deleteMutation.isPending,
        updateMutation.isPending,
        createTileMutation.isPending
    ]);


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
                            colors={colors}
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
                                        {colors.map((c) => (
                                            <button
                                                key={c}
                                                onClick={() => {
                                                    handleCreateTile(c);
                                                    setIsPickerOpen(false);
                                                }}
                                                style={{ backgroundColor: c }}
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