import React from 'react';
import { useSelector } from '../../services/store';
import {
  getIsAuthChecked,
  getUser
} from '../../services/slices/user/userSlice';
import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.JSX.Element;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: TProtectedRouteProps): React.JSX.Element => {
  const isAuthChecked = useSelector(getIsAuthChecked); // флаг что токен проверили
  const user = useSelector(getUser); // юзер или null
  const location = useLocation();

  // // если еще не проверили токен - показываем прелоадер
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // если страница для авторизованных, а юзер не залогинен
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // если страница для неавторизованных, а юзер уже залогинен
  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  return children;
};
