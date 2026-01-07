
import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import style from "./TilePage.module.css"
import { useUser } from "../../context/UserContext";
import { useFooter } from "../../context/FooterContext";

import type { Tile } from "../../types/tile.type";
import { getAllTiles, getColors, updateTileColor, deleteTile } from "../../api/tiles";
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

    const [pendingChanges, setPendingChanges] = useState<Record<string, Tile>>({});

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


    const { mutate, isPending } = useMutation({
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
            [id]: { ...tiles.find(t => t._id === id)!, color: newColor }
        }));
    };

    const handleDelete = (id: string) => {
        setPendingChanges(prev => ({
            ...prev,
            [id]: { ...tiles.find(t => t._id === id)!,
            toDelete: true
           }
        }));
        
    };


 const handleSaveTiles = useCallback(() => {
    const changesToSave = Object.values(pendingChanges);
    if (changesToSave.length === 0) return;

    const updates = changesToSave.filter(c => !c.toDelete); 
    const deletions = changesToSave.filter(c => c.toDelete);
    if (updates.length > 0) {
        mutate(updates); 
    }

    deletions.forEach(tile => deleteMutation.mutate(tile._id)); 

}, [pendingChanges, mutate, deleteMutation]);


    useEffect(() => {
        setFooterActions({
            onSave: handleSaveTiles,
            onUndo: () => setPendingChanges({}),
            disabled: Object.keys(pendingChanges).length === 0 || isPending
        });

        return () => setFooterActions({ onSave: null, onUndo: null, disabled: false });
    }, [pendingChanges, isPending, handleSaveTiles, setFooterActions]);



    return (
        <>
            <Header />

            {isLoading ? (
                <div>טוען...</div>
            ) : isError ? (
                <div>אירעה שגיאה</div>
            ) : (
                <div className="tiles-container">
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