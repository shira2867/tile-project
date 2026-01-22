import { useState, useEffect, useCallback, useMemo } from "react";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import style from "./TilePage.module.css";
import { useUser } from "../../context/UserContext";
import { useFooter } from "../../context/FooterContext";
import type { Tile } from "../../types/tile.type";

import { permissions } from "../../constants/permissions";
import { TileComponent } from "../../components/Tile/Tile";

import { colorOptions } from "../../types/tile.type";
import { useTile } from "../../hooks/useTileCustom";

export function TilePage() {
  const userContext = useUser();
  const { registerActions } = useFooter();
  const role = userContext.role;
  const perms = permissions[role] || permissions.viewer;
  const [isPickerOpen, setIsPickerOpen] = useState(false);

 const {  
  tiles,
  isLoading,
  isError,
  pendingChanges,
  setPendingChanges,
  handleChangeColor,
  handleDelete,
  handleCreateTile,
  updateMutation, 
  deleteMutation,
  createTileMutation,
   
} = useTile();


  const displayTiles = useMemo(() => {
    const updatedExisting = tiles
      .map((tile) => {
        const pending = pendingChanges[tile._id];
        if (pending?.toDelete) return null;
        if (pending) return { ...tile, ...pending };
        return tile;
      })
      .filter(Boolean) as Tile[];

    const newTiles = Object.values(pendingChanges).filter(
      (change) => change.isNew,
    ) as Tile[];

    return [...updatedExisting, ...newTiles];
  }, [tiles, pendingChanges]);


  const handleUndo = useCallback(() => {
    setPendingChanges({});
  }, []);

  const handleSaveTiles = useCallback(async () => {
    const changesToSave = Object.values(pendingChanges);
    if (changesToSave.length === 0) return;

    const creations = changesToSave.filter((c) => c.isNew);
    const updates = changesToSave.filter((c) => !c.isNew && !c.toDelete);
    const deletions = changesToSave.filter((c) => c.toDelete);

    const promises: Promise<any>[] = [];

    creations.forEach((tile) =>
      promises.push(createTileMutation.mutateAsync({ color: tile.color! })),
    );

    if (updates.length > 0) {
      promises.push(updateMutation.mutateAsync(updates as Tile[]));
    }

    deletions.forEach((tile) =>
      promises.push(deleteMutation.mutateAsync(tile._id!)),
    );

    await Promise.all(promises);
    setPendingChanges({});
  }, [pendingChanges, createTileMutation, updateMutation, deleteMutation]);

  useEffect(() => {
    registerActions({
      onSave: handleSaveTiles,
      onUndo: handleUndo,
      hasChanges: Object.keys(pendingChanges).length > 0,
      isLoading:
        deleteMutation.isPending ||
        updateMutation.isPending ||
        createTileMutation.isPending,
    });

    return () =>
      registerActions({
        onSave: async () => {},
        onUndo: () => {},
        hasChanges: false,
      });
  }, [
    pendingChanges,
    handleSaveTiles,
    handleUndo,
    registerActions,
    deleteMutation.isPending,
    updateMutation.isPending,
    createTileMutation.isPending,
  ]);

  return (
    <>
      <Header />

      {isLoading ? (
        <div>טוען...</div>
      ) : isError ? (
        <div>אירעה שגיאה</div>
      ) : (
        <div className={style.conteiner}>
        <div className={style.tilesContainer}>
          {displayTiles.map((tile) => (
            <TileComponent
              key={tile._id}
              _id={tile._id}
              color={tile.color}
              colors={colorOptions}
              canEditColor={perms.editColor}
              canDelete={perms.delete}
              onChangeColor={(newColor) =>
                handleChangeColor(tile._id, newColor)
              }
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
        </div>
      )}

      <Footer />
    </>
  );
}
