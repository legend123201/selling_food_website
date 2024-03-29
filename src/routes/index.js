import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import SalePageLayout from '../layouts/salePage';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
// import RoleBasedGuard from '../guards/RoleBasedGuard';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          )
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          )
        },
        { path: 'login-unprotected', element: <Login /> },
        { path: 'register-unprotected', element: <Register /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'verify', element: <VerifyCode /> }
      ]
    },

    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to="/dashboard/app" replace /> }, // những dòng dạng dạng thế này nghĩa là nó là path độc lập (có path riêng dành cho nó) nhưng khi thằng cha nó đc gọi thì nó sẽ đc gọi đầu tiên, nghĩa là khi gọi http://localhost:3000/dashboard/ thì http://localhost:3000/dashboard/app sẽ đc gọi liền
        { path: 'app', element: <GeneralApp /> },
        { path: 'ecommerce', element: <GeneralEcommerce /> },
        { path: 'analytics', element: <GeneralAnalytics /> },
        { path: 'banking', element: <GeneralBanking /> },
        { path: 'booking', element: <GeneralBooking /> },

        {
          path: 'todo',
          children: [
            { element: <Navigate to="/dashboard/todo/list" replace /> },
            { path: 'list', element: <TodoList /> },
            { path: 'new', element: <TodoCreate /> },
            { path: ':id/edit', element: <TodoCreate /> }
          ]
        },
        {
          path: 'my-custom-product',
          children: [
            { element: <Navigate to="/dashboard/my-custom-product/list" replace /> },
            { path: 'list', element: <MyCustomProductList /> },
            { path: 'new', element: <MyCustomProductCreate /> },
            { path: ':id/edit', element: <MyCustomProductCreate /> }
          ]
        },
        {
          path: 'my-custom-user',
          children: [
            { element: <Navigate to="/dashboard/my-custom-user/list" replace /> },
            { path: 'list', element: <MyCustomUserList /> }
          ]
        },
        {
          path: 'import-order',
          children: [
            { element: <Navigate to="/dashboard/import-order/list" replace /> },
            { path: 'list', element: <ImportOrderList /> },
            { path: 'new', element: <ImportOrderDetailList /> },
            { path: ':id/:staffOfOrderId/detail', element: <ImportOrderDetailList /> }
          ]
        },
        {
          path: 'bill',
          children: [
            { element: <Navigate to="/dashboard/bill/list" replace /> },
            { path: 'list', element: <BillList /> },
            { path: ':id/:userId/:staffId/detail', element: <BillDetailList /> }
          ]
        },
        {
          path: 'e-commerce',
          children: [
            { element: <Navigate to="/dashboard/e-commerce/shop" replace /> },
            { path: 'shop', element: <EcommerceShop /> },
            { path: 'product/:name', element: <EcommerceProductDetails /> },
            { path: 'list', element: <EcommerceProductList /> },
            { path: 'product/new', element: <EcommerceProductCreate /> },
            { path: 'product/:name/edit', element: <EcommerceProductCreate /> },
            { path: 'checkout', element: <EcommerceCheckout /> },
            { path: 'invoice', element: <EcommerceInvoice /> }
          ]
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/profile" replace /> },
            { path: 'profile', element: <UserProfile /> },
            { path: 'cards', element: <UserCards /> },
            { path: 'list', element: <UserList /> },
            { path: 'new', element: <UserCreate /> },
            { path: ':name/edit', element: <UserCreate /> },
            { path: 'account', element: <UserAccount /> }
          ]
        },
        {
          path: 'blog',
          children: [
            { element: <Navigate to="/dashboard/blog/posts" replace /> },
            { path: 'posts', element: <BlogPosts /> },
            { path: 'post/:title', element: <BlogPost /> },
            { path: 'new-post', element: <BlogNewPost /> }
          ]
        },
        {
          path: 'mail',
          children: [
            { element: <Navigate to="/dashboard/mail/all" replace /> },
            { path: 'label/:customLabel', element: <Mail /> },
            { path: 'label/:customLabel/:mailId', element: <Mail /> },
            { path: ':systemLabel', element: <Mail /> },
            { path: ':systemLabel/:mailId', element: <Mail /> }
          ]
        },
        {
          path: 'chat',
          children: [
            { element: <Chat /> },
            { path: 'new', element: <Chat /> },
            { path: ':conversationKey', element: <Chat /> }
          ]
        },
        { path: 'calendar', element: <Calendar /> },
        { path: 'kanban', element: <Kanban /> }
      ]
    },

    {
      path: 'sale-page',
      element: <SalePageLayout />,
      children: [
        { element: <Navigate to="/sale-page/shop" replace /> },
        { path: 'login', element: <LoginSalePage /> },
        { path: 'register', element: <RegisterSalePage /> },
        { path: 'profile', element: <ProfileSalePage /> },
        { path: 'shop', element: <MyCustomEcommerceShop /> },
        { path: 'product/:id', element: <MyCustomEcommerceProductDetails /> },
        { path: 'checkout', element: <MyCustomEcommerceCheckout /> },
        { path: 'my-bills', element: <MyBills /> },
        { path: 'my-bill-detail-list/billId/:id', element: <MyBillDetailList /> }
      ]
    },

    // Main Routes
    {
      path: '*', // mình tưởng ở đây "*" thì con nó phải là gì đó như "*/coming-soon" nhưng ko, nó y chang path "/" ở dưới????
      // sau khi suy nghĩ thì ở mọi đường link khác đều ko có dấu "/" nhưng nó vẫn tự hiểu ngầm, nhìn đống link trên kia là thấy, thế sao ở dưới lại có 1 cái path "/" ở dưới làm gì cho mất công, vậy thì hiểu rằng có 2 loại link đặc biệt, đó là link mới mở server, là link "/", và link tùm lum gì đó "*" để mình bắt lỗi, 2 cái link này cú pháp y chang nhau, là chỉ cần "localhost:3000/{link children của nó}", bỏ 1 trong 2 (path "*" hoặc path "/") thì cái kia làm nhiệm vụ của cái còn lại luôn =)))), chia 2 cái này rõ ràng vì nhìn lại đi, 2 cái path nó dùng element khác nhau chức năng khác nhau, children cũng khác nhau.
      // sau khi mình test nhiều lần thì mình nhận ra là path ở đây nó tự xóa dấu "/" đằng trước path luôn (đằng sau như "*/" nó ko bỏ dấu "/" đâu, nhưng "dashboard/" thì nó tự bỏ "/" (nên trường hợp này thì ghi hay ko ghi "/" ở sau path nó y chang nhau), mệt não ghê @@, với lại từ 2 dấu "/" trở lên đằng sau path thì cũng lỗi, ko có cách nào truy cập vào children luôn), mình đã test path:"///sss" nhưng nó tự động nhận path:"sss" thôi, ghi "///" trên browser sẽ lỗi liền
      element: <LogoOnlyLayout />, // màn hình chỉ có logo, báo 404 hay sao đó
      children: [
        { element: <Navigate to="/dashboard/user/profile" replace /> },
        { path: 'coming-soon', element: <ComingSoon /> }, // http://localhost:3000/coming-soon
        { path: 'maintenance', element: <Maintenance /> }, // http://localhost:3000/maintenance
        { path: 'pricing', element: <Pricing /> },
        { path: 'payment', element: <Payment /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> } // có thể để ở đây là to="/500" để biết rõ rằng dòng 404 cuối cùng ở dưới kia sẽ ko bao giờ đc gọi vì ở đây cha là path "*" rồi, children cũng là "*"" thì nó bao hết các trường hợp rồi
      ]
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { element: <LandingPage /> }, // trang mặc định của http://localhost:3000
        { path: 'about-us', element: <About /> }, // http://localhost:3000/about-us // bấm ở đây http://localhost:3000/about-us/dsjd nó vẫn ko chạy xuống 404 ở dưới, nó vẫn match trường hợp 404 ở trên
        { path: 'contact-us', element: <Contact /> },
        { path: 'faqs', element: <Faqs /> },
        {
          path: 'components',
          children: [
            { element: <ComponentsOverview /> },
            // FOUNDATIONS
            { path: 'color', element: <Color /> },
            { path: 'typography', element: <Typography /> },
            { path: 'shadows', element: <Shadows /> },
            { path: 'grid', element: <Grid /> },
            { path: 'icons', element: <Icons /> },
            // MATERIAL UI
            { path: 'accordion', element: <Accordion /> },
            { path: 'alert', element: <Alert /> },
            { path: 'autocomplete', element: <Autocomplete /> },
            { path: 'avatar', element: <Avatar /> },
            { path: 'badge', element: <Badge /> },
            { path: 'breadcrumbs', element: <Breadcrumb /> },
            { path: 'buttons', element: <Buttons /> },
            { path: 'checkbox', element: <Checkbox /> },
            { path: 'chip', element: <Chip /> },
            { path: 'dialog', element: <Dialog /> },
            { path: 'label', element: <Label /> },
            { path: 'list', element: <List /> },
            { path: 'menu', element: <Menu /> },
            { path: 'pagination', element: <Pagination /> },
            { path: 'pickers', element: <Pickers /> },
            { path: 'popover', element: <Popover /> },
            { path: 'progress', element: <Progress /> },
            { path: 'radio-button', element: <RadioButtons /> },
            { path: 'rating', element: <Rating /> },
            { path: 'slider', element: <Slider /> },
            { path: 'snackbar', element: <Snackbar /> },
            { path: 'stepper', element: <Stepper /> },
            { path: 'switch', element: <Switches /> },
            { path: 'table', element: <Table /> },
            { path: 'tabs', element: <Tabs /> },
            { path: 'textfield', element: <Textfield /> },
            { path: 'timeline', element: <Timeline /> },
            { path: 'tooltip', element: <Tooltip /> },
            { path: 'transfer-list', element: <TransferList /> },
            { path: 'tree-view', element: <TreeView /> },
            { path: 'data-grid', element: <DataGrid /> },
            // EXTRA COMPONENTS
            { path: 'chart', element: <Charts /> },
            { path: 'map', element: <Map /> },
            { path: 'editor', element: <Editor /> },
            { path: 'copy-to-clipboard', element: <CopyToClipboard /> },
            { path: 'upload', element: <Upload /> },
            { path: 'carousel', element: <Carousel /> },
            { path: 'multi-language', element: <MultiLanguage /> },
            { path: 'animate', element: <Animate /> },
            { path: 'mega-menu', element: <MegaMenu /> },
            { path: 'form-validation', element: <FormValidation /> }
          ]
        }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> } // dòng này sẽ ko đc gọi vì trên kia có path "*" rồi, trừ khi trên kia đổi thành cái khác (vd: "*" => "test") thì dòng này mới đc gọi khi mình bấm tùm lum tùm la vào đường link
  ]);
}

// IMPORT COMPONENTS

// Authentication
const Login = Loadable(lazy(() => import('../pages/authentication/Login')));
const Register = Loadable(lazy(() => import('../pages/authentication/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/authentication/ResetPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/authentication/VerifyCode')));
// Dashboard
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const GeneralEcommerce = Loadable(lazy(() => import('../pages/dashboard/GeneralEcommerce')));
const GeneralAnalytics = Loadable(lazy(() => import('../pages/dashboard/GeneralAnalytics')));
const GeneralBanking = Loadable(lazy(() => import('../pages/dashboard/GeneralBanking')));
const GeneralBooking = Loadable(lazy(() => import('../pages/dashboard/GeneralBooking')));
// my custom route ==================================
const TodoList = Loadable(lazy(() => import('../pages/dashboard/TodoList')));
const TodoCreate = Loadable(lazy(() => import('../pages/dashboard/TodoCreate')));
const MyCustomProductList = Loadable(lazy(() => import('../pages/dashboard/MyCustomProductList')));
const MyCustomProductCreate = Loadable(lazy(() => import('../pages/dashboard/MyCustomProductCreate')));
const MyCustomUserList = Loadable(lazy(() => import('../pages/dashboard/MyCustomUserList')));
const BillList = Loadable(lazy(() => import('../pages/dashboard/BillList')));
const BillDetailList = Loadable(lazy(() => import('../pages/dashboard/BillDetailList')));
const ImportOrderList = Loadable(lazy(() => import('../pages/dashboard/ImportOrderList')));
const ImportOrderDetailList = Loadable(lazy(() => import('../pages/dashboard/ImportOrderDetailList')));

const LoginSalePage = Loadable(lazy(() => import('../pages/salePage/Login')));
const RegisterSalePage = Loadable(lazy(() => import('../pages/salePage/Register')));
const ProfileSalePage = Loadable(lazy(() => import('../pages/salePage/Profile')));
const MyCustomEcommerceShop = Loadable(lazy(() => import('../pages/salePage/MyCustomEcommerceShop')));
const MyCustomEcommerceProductDetails = Loadable(
  lazy(() => import('../pages/salePage/MyCustomEcommerceProductDetails'))
);
const MyCustomEcommerceCheckout = Loadable(lazy(() => import('../pages/salePage/MyCustomEcommerceCheckout')));
const MyBills = Loadable(lazy(() => import('../pages/salePage/MyBills')));
const MyBillDetailList = Loadable(lazy(() => import('../pages/salePage/MyBillDetailList')));

// ===================================================
const EcommerceShop = Loadable(lazy(() => import('../pages/dashboard/EcommerceShop')));
const EcommerceProductDetails = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductDetails')));
const EcommerceProductList = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductList')));
const EcommerceProductCreate = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductCreate')));
const EcommerceCheckout = Loadable(lazy(() => import('../pages/dashboard/EcommerceCheckout')));
const EcommerceInvoice = Loadable(lazy(() => import('../pages/dashboard/EcommerceInvoice')));
const BlogPosts = Loadable(lazy(() => import('../pages/dashboard/BlogPosts')));
const BlogPost = Loadable(lazy(() => import('../pages/dashboard/BlogPost')));
const BlogNewPost = Loadable(lazy(() => import('../pages/dashboard/BlogNewPost')));
const UserProfile = Loadable(lazy(() => import('../pages/dashboard/UserProfile')));
const UserCards = Loadable(lazy(() => import('../pages/dashboard/UserCards')));
const UserList = Loadable(lazy(() => import('../pages/dashboard/UserList')));
const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));
const UserCreate = Loadable(lazy(() => import('../pages/dashboard/UserCreate')));
const Chat = Loadable(lazy(() => import('../pages/dashboard/Chat')));
const Mail = Loadable(lazy(() => import('../pages/dashboard/Mail')));
const Calendar = Loadable(lazy(() => import('../pages/dashboard/Calendar')));
const Kanban = Loadable(lazy(() => import('../pages/dashboard/Kanban')));
// Main
const LandingPage = Loadable(lazy(() => import('../pages/LandingPage')));
const About = Loadable(lazy(() => import('../pages/About')));
const Contact = Loadable(lazy(() => import('../pages/Contact')));
const Faqs = Loadable(lazy(() => import('../pages/Faqs')));
const ComingSoon = Loadable(lazy(() => import('../pages/ComingSoon')));
const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')));
const Pricing = Loadable(lazy(() => import('../pages/Pricing')));
const Payment = Loadable(lazy(() => import('../pages/Payment')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
// Components
const ComponentsOverview = Loadable(lazy(() => import('../pages/ComponentsOverview')));
const Color = Loadable(lazy(() => import('../pages/components-overview/foundations/FoundationColors')));
const Typography = Loadable(lazy(() => import('../pages/components-overview/foundations/FoundationTypography')));
const Shadows = Loadable(lazy(() => import('../pages/components-overview/foundations/FoundationShadows')));
const Grid = Loadable(lazy(() => import('../pages/components-overview/foundations/FoundationGrid')));
const Icons = Loadable(lazy(() => import('../pages/components-overview/foundations/FoundationIcons')));
const Accordion = Loadable(lazy(() => import('../pages/components-overview/material-ui/Accordion')));
const Alert = Loadable(lazy(() => import('../pages/components-overview/material-ui/Alert')));
const Autocomplete = Loadable(lazy(() => import('../pages/components-overview/material-ui/Autocomplete')));
const Avatar = Loadable(lazy(() => import('../pages/components-overview/material-ui/Avatar')));
const Badge = Loadable(lazy(() => import('../pages/components-overview/material-ui/Badge')));
const Breadcrumb = Loadable(lazy(() => import('../pages/components-overview/material-ui/Breadcrumb')));
const Buttons = Loadable(lazy(() => import('../pages/components-overview/material-ui/buttons')));
const Checkbox = Loadable(lazy(() => import('../pages/components-overview/material-ui/Checkboxes')));
const Chip = Loadable(lazy(() => import('../pages/components-overview/material-ui/chips')));
const Dialog = Loadable(lazy(() => import('../pages/components-overview/material-ui/dialog')));
const Label = Loadable(lazy(() => import('../pages/components-overview/material-ui/Label')));
const List = Loadable(lazy(() => import('../pages/components-overview/material-ui/Lists')));
const Menu = Loadable(lazy(() => import('../pages/components-overview/material-ui/Menus')));
const Pagination = Loadable(lazy(() => import('../pages/components-overview/material-ui/Pagination')));
const Pickers = Loadable(lazy(() => import('../pages/components-overview/material-ui/pickers')));
const Popover = Loadable(lazy(() => import('../pages/components-overview/material-ui/Popover')));
const Progress = Loadable(lazy(() => import('../pages/components-overview/material-ui/progress')));
const RadioButtons = Loadable(lazy(() => import('../pages/components-overview/material-ui/RadioButtons')));
const Rating = Loadable(lazy(() => import('../pages/components-overview/material-ui/Rating')));
const Slider = Loadable(lazy(() => import('../pages/components-overview/material-ui/Slider')));
const Snackbar = Loadable(lazy(() => import('../pages/components-overview/material-ui/Snackbar')));
const Stepper = Loadable(lazy(() => import('../pages/components-overview/material-ui/stepper')));
const Switches = Loadable(lazy(() => import('../pages/components-overview/material-ui/Switches')));
const Table = Loadable(lazy(() => import('../pages/components-overview/material-ui/table')));
const Tabs = Loadable(lazy(() => import('../pages/components-overview/material-ui/Tabs')));
const Textfield = Loadable(lazy(() => import('../pages/components-overview/material-ui/textfield')));
const Timeline = Loadable(lazy(() => import('../pages/components-overview/material-ui/Timeline')));
const Tooltip = Loadable(lazy(() => import('../pages/components-overview/material-ui/Tooltip')));
const TransferList = Loadable(lazy(() => import('../pages/components-overview/material-ui/transfer-list')));
const TreeView = Loadable(lazy(() => import('../pages/components-overview/material-ui/TreeView')));
const DataGrid = Loadable(lazy(() => import('../pages/components-overview/material-ui/data-grid')));
//
const Charts = Loadable(lazy(() => import('../pages/components-overview/extra/Charts')));
const Map = Loadable(lazy(() => import('../pages/components-overview/extra/Map')));
const Editor = Loadable(lazy(() => import('../pages/components-overview/extra/Editor')));
const CopyToClipboard = Loadable(lazy(() => import('../pages/components-overview/extra/CopyToClipboard')));
const Upload = Loadable(lazy(() => import('../pages/components-overview/extra/Upload')));
const Carousel = Loadable(lazy(() => import('../pages/components-overview/extra/Carousel')));
const MultiLanguage = Loadable(lazy(() => import('../pages/components-overview/extra/MultiLanguage')));
const Animate = Loadable(lazy(() => import('../pages/components-overview/extra/animate')));
const MegaMenu = Loadable(lazy(() => import('../pages/components-overview/extra/MegaMenu')));
const FormValidation = Loadable(lazy(() => import('../pages/components-overview/extra/form-validation')));
