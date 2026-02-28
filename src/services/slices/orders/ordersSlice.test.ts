import { ordersSlice, TOrdersState } from './ordersSlice';
import { fetchOrder, fetchProfileOrders } from './ordersThunks';
import { TOrder } from '@utils-types';

const initialState: TOrdersState = {
  orders: [],
  order: null,
  isLoading: false
};

describe('Тестирование ordersSlice', () => {
  describe('Асинхронные редьюсеры', () => {
    describe('[fetchProfileOrders] История заказов', () => {
      test('[pending] отправка', () => {
        const { isLoading } = ordersSlice.reducer(initialState, {
          type: fetchProfileOrders.pending.type
        });

        expect(isLoading).toBe(true);
      });

      test('[rejected] ошибка', () => {
        const { isLoading } = ordersSlice.reducer(initialState, {
          type: fetchProfileOrders.rejected.type
        });

        expect(isLoading).toBe(false);
      });

      test('[fulfilled] успех', () => {
        const payloadMock: TOrder[] = [
          {
            _id: '69a231aba64177001b32dfea',
            ingredients: [
              '643d69a5c3f7b9001cfa093c',
              '643d69a5c3f7b9001cfa093e',
              '643d69a5c3f7b9001cfa093f',
              '643d69a5c3f7b9001cfa0940'
            ],
            status: 'done',
            name: 'Метеоритный люминесцентный бессмертный краторный бургер',
            createdAt: '2026-02-28T00:07:07.449Z',
            updatedAt: '2026-02-28T00:07:07.662Z',
            number: 102092
          },
          {
            _id: '69a2321aa64177001b32dfeb',
            ingredients: ['643d69a5c3f7b9001cfa093d'],
            status: 'done',
            name: 'Флюоресцентный бургер',
            createdAt: '2026-02-28T00:08:58.870Z',
            updatedAt: '2026-02-28T00:08:59.112Z',
            number: 102093
          }
        ];
        const { orders, isLoading } = ordersSlice.reducer(initialState, {
          type: fetchProfileOrders.fulfilled.type,
          payload: payloadMock
        });

        expect(orders).toEqual(payloadMock);
        expect(isLoading).toBe(false);
      });
    });

    describe('[fetchOrder] Информация о заказе', () => {
      test('[pending] отправка', () => {
        const { isLoading } = ordersSlice.reducer(initialState, {
          type: fetchOrder.pending.type
        });

        expect(isLoading).toBe(true);
      });

      test('[rejected] ошибка', () => {
        const { isLoading } = ordersSlice.reducer(initialState, {
          type: fetchOrder.rejected.type
        });

        expect(isLoading).toBe(false);
      });

      test('[fulfilled] успех', () => {
        const payloadMock = {
          orders: [
            {
              _id: '69a23297a64177001b32dfec', 
              ingredients: [
                '643d69a5c3f7b9001cfa093d',
                '643d69a5c3f7b9001cfa093e',
                '643d69a5c3f7b9001cfa093d'
              ],
              owner: 
                {name: "Сергей",
                email: "sergei@gmail.com"  
              } ,
              status: 'done',
              name: 'Флюоресцентный люминесцентный бургер',
              createdAt: '2026-02-28T00:11:03.471Z',
              updatedAt: '2026-02-28T00:11:03.717Z',
              number: 102094,
              __v: 0
            }
          ]
        };
        const { order, isLoading } = ordersSlice.reducer(initialState, {
          type: fetchOrder.fulfilled.type,
          payload: payloadMock
        });

        expect(order).toEqual(payloadMock.orders[0]);
        expect(isLoading).toBe(false);
      });
    });
  });
});
