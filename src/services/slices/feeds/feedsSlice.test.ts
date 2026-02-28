import { feedsSlice, TFeedsState } from './feedsSlice';
import { fetchFeeds } from './feedsThunks';

const initialState: TFeedsState = {
  orders: [],
  currentOrder: null,
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: undefined
};

describe('Тестирование feedsSlice', () => {
  describe('Асинхронные редьюсеры', () => {
    describe('[fetchFeeds] Лента заказов', () => {
      test('[pending] отправка', () => {
        const { error, isLoading } = feedsSlice.reducer(initialState, {
          type: fetchFeeds.pending.type
        });

        expect(error).toBeUndefined();
        expect(isLoading).toBe(true);
      });

      test('[rejected] ошибка', () => {
        const errorMessage = 'error';
        const { error, isLoading } = feedsSlice.reducer(initialState, {
          type: fetchFeeds.rejected.type,
          error: { message: errorMessage }
        });

        expect(error).toBe(errorMessage);
        expect(isLoading).toBe(false);
      });

      test('[fulfilled] успех', () => {
        const payloadMock = {
          success: true,
          orders: [
            {
              _id: '69a23030a64177001b32dfe8',
              ingredients: [
                '643d69a5c3f7b9001cfa093d',
                '643d69a5c3f7b9001cfa093e',
                '643d69a5c3f7b9001cfa0940',
                '643d69a5c3f7b9001cfa0949',
                '643d69a5c3f7b9001cfa0943',
                '643d69a5c3f7b9001cfa093d'
              ],
              status: 'done',
              name: 'Space метеоритный экзо-плантаго флюоресцентный люминесцентный бургер',
              createdAt: '2026-02-28T00:00:48.565Z',
              updatedAt: '2026-02-28T00:00:48.806Z',
              number: 102091
            },
            {
              _id: '69a22f65a64177001b32dfe6',
              ingredients: [
                '643d69a5c3f7b9001cfa093d',
                '643d69a5c3f7b9001cfa093e',
                '643d69a5c3f7b9001cfa093d'
              ],
              status: 'done',
              name: 'Флюоресцентный люминесцентный бургер',
              createdAt: '2026-02-27T23:57:25.308Z',
              updatedAt: '2026-02-27T23:57:25.527Z',
              number: 102090
            }
          ],
          total: 26085,
          totalToday: 131
        };
        const { error, isLoading, total, totalToday, orders } =
          feedsSlice.reducer(initialState, {
            type: fetchFeeds.fulfilled.type,
            payload: payloadMock
          });

        expect(error).toBeUndefined();
        expect(orders).toEqual(payloadMock.orders);
        expect(total).toBe(payloadMock.total);
        expect(totalToday).toBe(payloadMock.totalToday);
        expect(isLoading).toBe(false);
      });
    });
  });
});
