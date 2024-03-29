import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// material
import { styled, useTheme } from '@mui/material/styles';
// redux
import { useDispatch } from 'react-redux';
import { getMyCustomUser } from '../../redux/slices/myCustomUser';
// hooks
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
//
import SalePageNavbar from './SalePageNavbar';
import { PATH_SALEPAGE } from '../../routes/paths';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

export default function SalePageLayout() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const enqueueSnackbar = useSnackbar();
  const theme = useTheme();
  const { collapseClick } = useCollapseDrawer();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');

    if (
      !userId &&
      pathname !== PATH_SALEPAGE.root &&
      pathname !== PATH_SALEPAGE.shop &&
      !pathname.includes('product') &&
      pathname !== PATH_SALEPAGE.login &&
      pathname !== PATH_SALEPAGE.register
    ) {
      navigate(PATH_SALEPAGE.login);
    }
  }, [pathname]);

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      const excuteAfterGetItem = (globalStateNewest) => {
        const stateMyCustomUser = globalStateNewest.myCustomUser;

        if (!stateMyCustomUser.isSuccess) {
          const variant = 'error';
          // variant could be success, error, warning, info, or default
          enqueueSnackbar(stateMyCustomUser.errorMessage, { variant });
        }
      };

      dispatch(getMyCustomUser(userId, excuteAfterGetItem));
    }
  }, [dispatch]);

  return (
    <RootStyle>
      {pathname !== PATH_SALEPAGE.login && pathname !== PATH_SALEPAGE.register && (
        <SalePageNavbar onOpenSidebar={() => setOpen(true)} />
      )}

      <MainStyle
        sx={{
          transition: theme.transitions.create('margin', {
            duration: theme.transitions.duration.complex
          }),
          ...(collapseClick && {
            ml: '102px'
          })
        }}
      >
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}
