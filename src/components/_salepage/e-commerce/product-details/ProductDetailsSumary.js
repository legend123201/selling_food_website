/* eslint-disable camelcase */
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
import { useNavigate } from 'react-router-dom';
import plusFill from '@iconify/icons-eva/plus-fill';
import minusFill from '@iconify/icons-eva/minus-fill';
import twitterFill from '@iconify/icons-eva/twitter-fill';
import linkedinFill from '@iconify/icons-eva/linkedin-fill';
import facebookFill from '@iconify/icons-eva/facebook-fill';
import instagramFilled from '@iconify/icons-ant-design/instagram-filled';
import roundAddShoppingCart from '@iconify/icons-ic/round-add-shopping-cart';
import { useFormik, Form, FormikProvider, useField } from 'formik';
// material
import { useTheme, styled } from '@mui/material/styles';
import {
  Box,
  Link,
  Stack,
  Button,
  Rating,
  Tooltip,
  Divider,
  TextField,
  Typography,
  FormHelperText
} from '@mui/material';

import { useSnackbar } from 'notistack';

// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { addCart, getCartList, updateCart } from '../../../../redux/slices/cart';
// routes
import { PATH_SALEPAGE } from '../../../../routes/paths';
// utils
import { fShortenNumber, fCurrency } from '../../../../utils/formatNumber';
//
import { MIconButton } from '../../../@material-extend';
import Label from '../../../Label';
import ColorSinglePicker from '../../../ColorSinglePicker';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.up(1368)]: {
    padding: theme.spacing(5, 8)
  }
}));

// ----------------------------------------------------------------------

const Incrementer = (props) => {
  const [field, , helpers] = useField(props);
  // eslint-disable-next-line react/prop-types
  const { available } = props;
  const { value } = field;
  const { setValue } = helpers;

  const incrementQuantity = () => {
    setValue(value + 1);
  };
  const decrementQuantity = () => {
    setValue(value - 1);
  };

  return (
    <Box
      sx={{
        py: 0.5,
        px: 0.75,
        border: 1,
        lineHeight: 0,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        borderColor: 'grey.50032'
      }}
    >
      <MIconButton size="small" color="inherit" disabled={value <= 1} onClick={decrementQuantity}>
        <Icon icon={minusFill} width={16} height={16} />
      </MIconButton>
      <Typography
        variant="body2"
        component="span"
        sx={{
          width: 40,
          textAlign: 'center',
          display: 'inline-block'
        }}
      >
        {value}
      </Typography>
      <MIconButton size="small" color="inherit" disabled={value >= available} onClick={incrementQuantity}>
        <Icon icon={plusFill} width={16} height={16} />
      </MIconButton>
    </Box>
  );
};

ProductDetailsSumary.propTypes = {
  product: PropTypes.object,
  isEditCart: PropTypes.bool
};

export default function ProductDetailsSumary({ product, isEditCart }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector((state) => state.myCustomUser.data);

  const { id, name, quantityInStock, unitPerchasePrice, unitSalePrice, measureUnit, image } = product;

  const loadBackCartList = () => {
    const excuteAfterGetList = (globalStateNewest) => {
      const stateCart = globalStateNewest.cart;
      if (!stateCart.isSuccess) {
        const variant = 'error';
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(stateCart.errorMessage, { variant });
      }
    };

    dispatch(getCartList(user.id, excuteAfterGetList));
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      quantity: quantityInStock < 1 ? 0 : 1
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const excuteAfterCallApiCart = (globalStateNewest) => {
          const stateCart = globalStateNewest.cart;
          if (stateCart.isSuccess) {
            const variant = 'success';
            if (!isEditCart) {
              enqueueSnackbar('Add to cart success', { variant });
            } else {
              enqueueSnackbar('Update cart item success', { variant });
            }

            loadBackCartList();
          } else {
            const variant = 'error';
            // variant could be success, error, warning, info, or default
            enqueueSnackbar(stateCart.errorMessage, { variant });
          }
        };

        if (user) {
          if (!isEditCart) {
            const newCart = {
              userId: user.id,
              productId: id,
              quantity: values.quantity
            };

            dispatch(addCart(newCart, excuteAfterCallApiCart));
          } else {
            const putCart = {
              userId: user.id,
              productId: id,
              quantity: values.quantity
            };

            dispatch(updateCart(putCart, excuteAfterCallApiCart));
          }
        } else {
          const variant = 'error';
          // variant could be success, error, warning, info, or default
          enqueueSnackbar('You need to login to add to cart!', { variant });
        }

        setSubmitting(false);
      } catch (error) {
        setSubmitting(false);
      }
    }
  });

  const { values, touched, errors, getFieldProps, handleSubmit } = formik;

  return (
    <RootStyle>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Typography variant="h5" paragraph>
            {name}
          </Typography>

          <Typography variant="h3" sx={{ mb: 3 }}>
            &nbsp;{fCurrency(unitSalePrice)}&nbsp;/&nbsp;{measureUnit}
          </Typography>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack spacing={3} sx={{ my: 3 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
                Quantity
              </Typography>
              <div>
                <Incrementer name="quantity" available={quantityInStock} />
                <Typography
                  variant="caption"
                  sx={{
                    mt: 1,
                    display: 'block',
                    textAlign: 'right',
                    color: 'text.secondary'
                  }}
                >
                  Available: {quantityInStock}&nbsp;{measureUnit}
                </Typography>

                <FormHelperText error>{touched.quantity && errors.quantity}</FormHelperText>
              </div>
            </Stack>
          </Stack>
          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mt: 5 }}>
            <Button
              fullWidth
              size="large"
              type="submit"
              color="warning"
              variant="contained"
              startIcon={<Icon icon={roundAddShoppingCart} />}
              sx={{ whiteSpace: 'nowrap' }}
            >
              {isEditCart ? 'Update Cart Item' : 'Add To Cart'}
            </Button>
            <Button
              fullWidth
              size="large"
              type="button"
              variant="contained"
              onClick={() => navigate(PATH_SALEPAGE.checkout)}
            >
              Buy Now
            </Button>
          </Stack>
        </Form>
      </FormikProvider>
    </RootStyle>
  );
}
