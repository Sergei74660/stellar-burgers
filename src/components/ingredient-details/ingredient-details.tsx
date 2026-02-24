import { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { getIngredientById } from '../../services/slices/burger-ingredients/burgerIngredientsSlice';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id } = useParams(); // достаем id из адресной строки
  const navigate = useNavigate(); // функция для навигации

  if (!id) {
    navigate(-1);
    return;
  }

  const ingredientData = useSelector(getIngredientById)(id); // ищем ингредиент по id в сторе

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
