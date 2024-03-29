import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// material
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getMyCustomProduct } from '../../redux/slices/myCustomProduct';
import { getCategoryList } from 'src/redux/slices/category';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import MyCustomProductNewForm from '../../components/_dashboard/myCustomProduct/MyCustomProductNewForm';

// ----------------------------------------------------------------------

export default function MyCustomProductCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const currentMyCustomProduct = useSelector((state) => state.myCustomProduct.data);
  const isEdit = pathname.includes('edit');
  const { enqueueSnackbar } = useSnackbar();

  const excuteAfterGetItem = (globalStateNewest) => {
    const stateMyCustomProduct = globalStateNewest.myCustomProduct;
    if (!stateMyCustomProduct.isSuccess) {
      const variant = 'error';
      // variant could be success, error, warning, info, or default
      enqueueSnackbar(stateMyCustomProduct.errorMessage, { variant });
    }
  };

  const excuteAfterGetListCategory = (globalStateNewest) => {
    const stateCategory = globalStateNewest.category;
    if (!stateCategory.isSuccess) {
      const variant = 'error';
      // variant could be success, error, warning, info, or default
      enqueueSnackbar(stateCategory.errorMessage, { variant });
    }
  };

  useEffect(() => {
    if (isEdit && id) {
      dispatch(getMyCustomProduct(id, excuteAfterGetItem));
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCategoryList(excuteAfterGetListCategory));
  }, [dispatch]);

  return (
    <Page title="User: Create a new product | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new product' : 'Edit product'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Product', href: PATH_DASHBOARD.myCustomProduct.root },
            { name: !isEdit ? 'New product' : 'Edit product' }
          ]}
        />

        {isEdit ? (
          <MyCustomProductNewForm isEdit={isEdit} currentMyCustomProduct={currentMyCustomProduct} />
        ) : (
          <MyCustomProductNewForm isEdit={isEdit} currentMyCustomProduct={null} />
        )}
      </Container>
    </Page>
  );
}
