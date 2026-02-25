import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  moveDownIngredient,
  moveUpIngredient,
  removeIngredient
} from '../../services/slices/burger-constructor/burgerConstructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch(); // функция для вызова экшенов
    const handleMoveDown = () => {
      dispatch(moveDownIngredient(index));
    }; // переместить ингредиент вниз

    const handleMoveUp = () => {
      dispatch(moveUpIngredient(index));
    }; // переместить ингредиент вверх

    const handleClose = () => {
      dispatch(removeIngredient(ingredient));
    }; // удалить ингредиент из конструктора

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
