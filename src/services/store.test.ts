import { rootReducer } from './store';
import { configureStore } from '@reduxjs/toolkit';

test('инициализация rootReducer', () => {
  const store = configureStore({
    reducer: rootReducer
  });
  const state = store.getState();
  const expectedState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
  expect(state).toEqual(expectedState);
});
