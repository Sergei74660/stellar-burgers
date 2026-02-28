import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearOrderModalData,
  getConstructorItems,
  getOrderModalData,
  getOrderRequest
} from '../../services/slices/burger-constructor/burgerConstructorSlice';
import { orderBurger } from '../../services/slices/burger-constructor/burgerConstructorThunks';
import { getIsAuthenticated } from '../../services/slices/user/userSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch(); // функция для вызова экшенов
  const navigate = useNavigate(); // функция для перехода между страницами
  const constructorItems = useSelector(getConstructorItems); // текущие ингредиенты в конструкторе
  const orderRequest = useSelector(getOrderRequest); // флаг отправки заказа (true/false)
  const isAuthenticated = useSelector(getIsAuthenticated); // авторизован ли юзер

  const orderModalData = useSelector(getOrderModalData); // данные последнего заказа

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    // если юзер не авторизован - кидаем на логин
    if (!isAuthenticated) {
      return navigate('/login');
    }

    // отправляем заказ на сервер (массив id ингредиентов)
    dispatch(
      orderBurger([
        constructorItems.bun._id,
        ...constructorItems.ingredients.map(({ _id }) => _id),
        constructorItems.bun._id
      ])
    );
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModalData());
  };
  // считаем общую стоимость (булка считается дважды)
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems] // пересчитываем при изменении ингредиентов
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
