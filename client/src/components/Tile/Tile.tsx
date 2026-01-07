import { FaTrash } from "react-icons/fa"
import style from './Tile.module.css'
import { useState } from "react";
type TileProps = {
  _id:string;
  color: string;
  canEditColor?: boolean;
  colors?: string[]; 
  onChangeColor?: (newColor: string) => void;
  canDelete?: boolean;
  onDelete?: () => void;
};

 export const TileComponent: React.FC<TileProps> = ({
  _id,
  color,
  canEditColor,
  colors = [],
  onChangeColor,
  canDelete,
  onDelete,
}) => {
 const availableColors = colors.filter(c => c !== color);
  return (
    <div className={style.tile} style={{ backgroundColor: color }}>
  {canEditColor && (
    <div className={style.colorButtons}>
      {availableColors.map(c => (
        <button
          key={c}
          style={{ backgroundColor: c }}
          onClick={() => onChangeColor?.(c)}
        />
      ))}
    </div>
  )}
  {canDelete && (
    <button className={style.deleteBtn} onClick={onDelete}>
      <FaTrash />
    </button>
  )}
</div>

  );
};
