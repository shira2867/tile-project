
import { useState, useEffect, useCallback } from "react";
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
//לכולם יכולים לצפות בצבעים
//לeditor יכול לצפות ולשנות צבעים
//admin & moderator יכול לצפות לשנות ליצור ולמחוק
//פונקצית create
export function TilePage() {
    const queryClient = useQueryClient();
    const userContext = useUser();
    const { setFooterActions } = useFooter();

    const role = userContext.role;
    const perms = permissions[role] || permissions.viewer;
    const [selectedColor, setSelectedColor] = useState<string>("");

    type PendingTile = Partial<Tile> & { isNew?: boolean; toDelete?: boolean };
    const [pendingChanges, setPendingChanges] = useState<Record<string, PendingTile>>({});

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


    const updateMutation = useMutation({
        mutationFn: async (changes: Tile[]) => {
            return Promise.all(changes.map(tile => updateTileColor(tile._id, tile.color)));
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


    const handleChangeColor = useCallback((id: string, newColor: string) => {
        setPendingChanges(prev => ({
            ...prev,
            [id]: { ...tiles.find(t => t._id === id)!, color: newColor }
        }));
    }, [tiles]);

    const handleDelete = useCallback((id: string) => {
        setPendingChanges(prev => ({
            ...prev,
            [id]: { ...tiles.find(t => t._id === id)!, toDelete: true }
        }));
    }, [tiles]);


    const handleCreateTile = () => {
        if (!selectedColor) return;

        const tempId = "temp-" + Date.now();
        setPendingChanges(prev => ({
            ...prev,
            [tempId]: {
                _id: tempId,
                color: selectedColor,
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
           {perms.create && (
    <div className={style.createTileDiv}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {colors.map((c) => (
                <button className={style.colorButton}
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    style={{
                        width: "36px",
                        height: "36px",
                        backgroundColor: c,
                        borderRadius: "4px",
                        border: selectedColor === c ? "3px solid #000" : "1px solid #ccc",
                        cursor: "pointer",
                        transition: "transform 0.1s",
                        outline: "none"
                    }}
                    title={c}
                    type="button"
                />
            ))}
        </div>
        
        <button 
            onClick={handleCreateTile} 
            style={{ 
                padding: "8px 16px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold"
            }}
        >
        </button>
    </div>
)}
            {isLoading ? (
                <div>טוען...</div>
            ) : isError ? (
                <div>אירעה שגיאה</div>
            ) : (

                <div className={style.tilesContainer}>
                    {tiles.map(tile => (
                        <TileComponent
                            key={tile._id}
                            _id={tile._id}
                            color={tile.color}
                            colors={colors}
                            canEditColor={perms.editColor}
                            canDelete={perms.delete}
                            onChangeColor={(newColor) => handleChangeColor(tile._id, newColor)}
                            onDelete={() => handleDelete(tile._id)}
                        />
                    ))}

                </div>
            )}

            <Footer />

        </>
    )
}