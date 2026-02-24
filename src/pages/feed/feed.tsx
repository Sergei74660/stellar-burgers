import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  getFeedOrders,
  getFeedsIsLoading
} from '../../services/slices/feeds/feedsSlice';
import { fetchFeeds } from '../../services/slices/feeds/feedsThunks';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(getFeedOrders); // список заказов из ленты
  const isLoading = useSelector(getFeedsIsLoading); // флаг загрузки
  const dispatch = useDispatch(); // функция для вызова экшенов

  // при монтировании грузим ленту
  useEffect(() => {
    dispatch(fetchFeeds());
  }, []);

  // пока грузится - показываем прелоадер
  if (isLoading) {
    return <Preloader />;
  }

  // если заказов нет - тоже прелоадер (на всякий случай)
  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(fetchFeeds());
      }}
    />
  );
};
