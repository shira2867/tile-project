import { FaTrash } from "react-icons/fa";
import style from './Tile.module.css';
import type { Color } from "../../types/tile.type";

type TileProps = {
  _id: string;
  color: Color;
  canEditColor?: boolean;
  colors?: Color[]; 
  onChangeColor?: (newColor: Color) => void;
  canDelete?: boolean;
  onDelete?: () => void;
};

export const TileComponent: React.FC<TileProps> = ({
  color,
  canEditColor,
  colors = [],
  onChangeColor,
  canDelete,
  onDelete,
}) => {
  const availableColors = colors.filter(c => c !== color);

  return (
    <div className={style.tile} data-color={color}>
      <div className={style.buttons}>
        {canEditColor && (
          <div className={style.colorButtons}>
            {availableColors.map(c => (
              <button 
                className={style.colorButton}
                key={c}
                data-color={c}
                onClick={() => onChangeColor?.(c as Color)}
                type="button"
              />
            ))}
          </div>
        )}
        {canDelete && (
          <button className={style.deleteBtn} onClick={onDelete} type="button">
            <FaTrash />
          </button>
        )}
      </div>
    </div>
  );
};