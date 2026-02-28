import {
  addIngredient,
  burgerConstructorSlice,
  moveDownIngredient,
  moveUpIngredient,
  removeIngredient,
  setBun,
  TBurgerConstructorState
} from './burgerConstructorSlice';
import { TIngredient } from '@utils-types';
import { configureStore, nanoid } from '@reduxjs/toolkit';
import { orderBurger } from './burgerConstructorThunks';
import * as burgerApi from '@api';

describe('Проверяют редьюсер слайса burgerConstructor', () => {
  test('добавление булочки', () => {
    const initialState: TBurgerConstructorState = {
      constructorItems: {
        bun: null,
        ingredients: []
      },
      orderRequest: false,
      orderModalData: null
    };
    const bun: TIngredient = {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    };
    const newState = burgerConstructorSlice.reducer(initialState, setBun(bun));
    const expectedBun = newState.constructorItems.bun;

    expect(bun).toEqual(expectedBun);
  });

  test('добавление ингредиента', () => {
    const initialState: TBurgerConstructorState = {
      constructorItems: {
        bun: null,
        ingredients: []
      },
      orderRequest: false,
      orderModalData: null
    };
    const ingredient: TIngredient = {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    };
    const newState = burgerConstructorSlice.reducer(
      initialState,
      addIngredient(ingredient)
    );
    const expectedIngredient = newState.constructorItems.ingredients[0];

    expect(expectedIngredient).toHaveProperty('id');
    const { id, ...rest } = expectedIngredient;
    expect(rest).toEqual(ingredient);
  });

  test('удаление ингредиента', () => {
    const ingredient: TIngredient & { id: string } = {
      id: nanoid(),
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    };
    const initialState: TBurgerConstructorState = {
      constructorItems: {
        bun: null,
        ingredients: [ingredient]
      },
      orderRequest: false,
      orderModalData: null
    };
    const newState = burgerConstructorSlice.reducer(
      initialState,
      removeIngredient(ingredient)
    );
    const ingredients = newState.constructorItems.ingredients;

    expect(ingredients).toHaveLength(0);
  });

  describe('перемещение ингредиентов', () => {
    let initialState: TBurgerConstructorState;
    const ingredient1: TIngredient & { id: string } = {
      id: nanoid(),
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    };
    const ingredient2: TIngredient & { id: string } = {
      id: nanoid(),
      _id: '643d69a5c3f7b9001cfa0942',
      name: 'Соус Spicy-X',
      type: 'sauce',
      proteins: 30,
      fat: 20,
      carbohydrates: 40,
      calories: 30,
      price: 90,
      image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
    };

    beforeEach(() => {
      initialState = {
        constructorItems: {
          bun: null,
          ingredients: [ingredient1, ingredient2]
        },
        orderRequest: false,
        orderModalData: null
      };
    });

    test('перемещение первого ингредиента вниз', () => {
      const newState = burgerConstructorSlice.reducer(
        initialState,
        moveDownIngredient(0)
      );
      const expectedIngredients = newState.constructorItems.ingredients;

      expect(ingredient1).toEqual(expectedIngredients[1]);
      expect(ingredient2).toEqual(expectedIngredients[0]);
    });

    test('перемещение второго ингредиента вверх', () => {
      const newState = burgerConstructorSlice.reducer(
        initialState,
        moveUpIngredient(1)
      );
      const expectedIngredients = newState.constructorItems.ingredients;

      expect(ingredient1).toEqual(expectedIngredients[1]);
      expect(ingredient2).toEqual(expectedIngredients[0]);
    });
  });

  describe('тест асинхронных экшенов', () => {
    test('совершение нового заказа', async () => {
      const orderBurgerRequest = [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa093d'
      ];
      const expectedOrderData = {
        ingredients: [
          '643d69a5c3f7b9001cfa093d',
          '643d69a5c3f7b9001cfa093e',
          '643d69a5c3f7b9001cfa093d'
        ],
        _id: '69a22b82a64177001b32dfe3',
        status: 'done',
        name: 'Флюоресцентный люминесцентный бургер',
        createdAt: '2026-02-27T23:40:50.483Z',
        updatedAt: '2026-02-27T23:40:50.732Z',
        number: 102089
      };
      const orderBurgerResponse = {
        success: true,
        name: 'Флюоресцентный люминесцентный бургер',
        order: expectedOrderData
      };
      const orderBurgerMock = jest
        .spyOn(burgerApi, 'orderBurgerApi')
        .mockResolvedValue(orderBurgerResponse);
      const store = configureStore({
        reducer: {
          burgerConstructor: burgerConstructorSlice.reducer
        }
      });

      await store.dispatch(orderBurger(orderBurgerRequest));

      const { orderModalData } = store.getState().burgerConstructor;

      expect(orderBurgerMock).toHaveBeenCalledWith(orderBurgerRequest);
      expect(orderModalData).toEqual(expectedOrderData);
    });
  });
});
