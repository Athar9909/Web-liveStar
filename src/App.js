import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Homepage from "./buyerComponent/Homepage/Homepage";
import MyAccount from "./buyerComponent/MyAccount/MyAccount";
import Address from "./buyerComponent/MyAccount/Address";
import Account from "./buyerComponent/MyAccount/Account";
import Favourites from "./buyerComponent/MyAccount/Favourites";
import Contact from "./buyerComponent/Contact/Contact";
import SignUp from "./buyerComponent/LoginRegister/SignUp";
import AdminLogin from "./AdminComponent/AdminLogin/AdminLogin";
import Dashboard from "./AdminComponent/AdminDashboard/Dashboard";
import CategorySub from "./AdminComponent/AdminDashboard/Category&SubCategory/CategorySub";
import Inventory from "./AdminComponent/AdminDashboard/Inventory/Inventory";
import UserManage from "./AdminComponent/AdminDashboard/UserManage/UserManage";
import BrandsManage from "./AdminComponent/AdminDashboard/BrandsManage/BrandsManage";
import Cms from "./AdminComponent/AdminDashboard/ContentManage/Cms";
import OrderReq from "./AdminComponent/AdminDashboard/OrdersManage/OrderReq";
import AgeVerification from "./buyerComponent/AgeVerification";
import AdminForgotPassword from "./AdminComponent/AdminLogin/AdminForgotPassword";
import AdminSendOtp from "./AdminComponent/AdminLogin/AdminSendOtp";
import AdminResetPassword from "./AdminComponent/AdminLogin/AdminResetPassword";
import PendingView from "./AdminComponent/AdminDashboard/UserManage/PendingView";
import ReturnedView from "./AdminComponent/AdminDashboard/UserManage/RetunedView";
import ApprovedView from "./AdminComponent/AdminDashboard/UserManage/ApprovedView";
import EditUser from "./AdminComponent/AdminDashboard/UserManage/EditUser";
import AddUser from "./AdminComponent/AdminDashboard/UserManage/AddUser";
import EditProfile from "./AdminComponent/AdminDashboard/EditProfile";
import ChangePassword from "./AdminComponent/AdminDashboard/ChangePassword";
import RequestOrders from "./buyerComponent/MyAccount/RequestOrder";
import MainMenu from "./buyerComponent/MyAccount/MainMenu";
import PrivacyPolicies from "./buyerComponent/Homepage/PrivacyPolicies";
import ProductByCate from "./buyerComponent/AllProducts/ProductByCate";
import AllBrands from "./buyerComponent/AllProducts/AllBrands";
import ProductBySubCate from "./buyerComponent/AllProducts/ProductBySub";
import ProductByBrand from "./buyerComponent/AllProducts/ProductByBrand";
import TermsCondition from "./buyerComponent/Homepage/Terms&Condition";
import AboutUs from "./buyerComponent/Homepage/AboutUs";
import EditInventory from "./AdminComponent/AdminDashboard/Inventory/EditInventory";
import SingleProduct from "./buyerComponent/AllProducts/SingleProduct";
import AppSignUp from "./pwaComponents/loginComponent/appSignUp";
import AppForgotPassword from "./pwaComponents/loginComponent/appForgotPassword";
import AppOtpVerification from "./pwaComponents/loginComponent/appOtpVerify";
import AppForgotPasswordSuccess from "./pwaComponents/loginComponent/appForgotPasswordSuccess";
import AppHome from "./pwaComponents/homeComponent/appHome";
import AppCart from "./pwaComponents/homeComponent/appCart";
import ScrollToTop from "./pwaComponents/homeComponent/scrollToTop";
import AppSettings from "./pwaComponents/homeComponent/appSettings";
import AppAboutUs from "./pwaComponents/homeComponent/appAboutUs";
import AppPrivacy from "./pwaComponents/homeComponent/appPrivacy";
import AppChangePassword from "./pwaComponents/homeComponent/appChangePassword";
import AppProfile from "./pwaComponents/homeComponent/appProfile";
import AppEditProfile from "./pwaComponents/homeComponent/appEditProfile";
import AppMyOrder from "./pwaComponents/homeComponent/appMyOrder";
import AppRequests from "./pwaComponents/homeComponent/appRequests";
import AppWishlist from "./pwaComponents/homeComponent/appWishlist";
import AppBrands from "./pwaComponents/homeComponent/appBrands";
import AppProductDetail from "./pwaComponents/homeComponent/appProductDetail";
import AppRequestDetail from "./pwaComponents/homeComponent/appRequestDetail";
import AppOrderDetail from "./pwaComponents/homeComponent/appOrderDetail";
import AppProductCategory from "./pwaComponents/homeComponent/appProductCategory";
import AppProductList from "./pwaComponents/homeComponent/appProductList";
import AppCheckout from "./pwaComponents/homeComponent/appCheckout";
import AppThankyou from "./pwaComponents/homeComponent/appThankyou";
import AppContactUs from "./pwaComponents/homeComponent/appContactUs";
import AppLogout from "./pwaComponents/homeComponent/appLogout";
import Cart from "./buyerComponent/Cart/Cart";
import BuyAgain from "./buyerComponent/MyAccount/BuyAgain";
import SignUpAgain from "./buyerComponent/LoginRegister/SignUpAgain";
import MyQuotes from "./buyerComponent/Homepage/MyQuotes";
import Checkout from "./buyerComponent/Cart/Checkout";
import AppPreLogin from "./pwaComponents/loginComponent/appPreLogin";
import AppReSignUp from "./pwaComponents/loginComponent/appReSignUp";
import AppProductBySearch from "./pwaComponents/homeComponent/appProductBySearch";
import AppPreLoginPassword from "./pwaComponents/loginComponent/appPreLoginPasword";
import ViewOrder from "./AdminComponent/AdminDashboard/OrdersManage/viewOrder";
import ViewQuoteReq from "./AdminComponent/AdminDashboard/OrdersManage/viewQuoteReq";
import UserDetails from "./AdminComponent/AdminDashboard/userDetails";
import AppProductBrands from "./pwaComponents/homeComponent/appProductBrands";
import AppCategories from "./pwaComponents/homeComponent/appCategories";
import AppQuotes from "./pwaComponents/homeComponent/appQuotes";
import OrderDetails from "./buyerComponent/MyAccount/OrdersDetails";
import RequestDetails from "./buyerComponent/MyAccount/ReqDetails";
import ProductBySearch from "./buyerComponent/AllProducts/ProductBySearch";
import AllCategories from "./buyerComponent/AllProducts/AllCategories";
import FeaturedProducts from "./buyerComponent/AllProducts/FeaturedProducts";
import SubCategories from "./buyerComponent/AllProducts/AllSubCategories";
import SingleProdBySearch from "./buyerComponent/AllProducts/SingleProdBySearch";
import SubAdmin from "./AdminComponent/AdminDashboard/Sub-Admin/SubAdmin";
import EditOrder from "./AdminComponent/AdminDashboard/OrdersManage/EditOrder";
import AppSubCategories from "./pwaComponents/homeComponent/appSubCategories";
import AppProductSubCategory from "./pwaComponents/homeComponent/appProductSubCategory";
import ViewProduct from "./AdminComponent/AdminDashboard/ViewProduct";
import PdfPrint from "./AdminComponent/AdminDashboard/OrdersManage/PdfPrint";
import AppTerms from "./pwaComponents/homeComponent/AppTerms";
import QuotePdf from "./AdminComponent/AdminDashboard/OrdersManage/QuotePdf";
import Gallery from "./buyerComponent/Footer/Gallery";
import Photos from "./buyerComponent/Footer/Photos";
import GalleryMain from "./AdminComponent/AdminDashboard/GalleryManage/GalleryMain";
import UserPdf from "./AdminComponent/AdminDashboard/OrdersManage/userPdf";
import AppDownloads from "./pwaComponents/homeComponent/appDownloads";
import UserLogin from "./buyerComponent/LoginRegister/UserLogin";
import UserLoginPass from "./buyerComponent/LoginRegister/UserLoginPass";
import UserForgotPass from "./buyerComponent/LoginRegister/UserForgotPass";
import UserUpdatePassword from "./buyerComponent/LoginRegister/UserUpdatePassword";
import UserOtpValidate from "./buyerComponent/LoginRegister/UserOtpValidate";
import AppBuyAgain from "./pwaComponents/homeComponent/appBuyAgain";
import AppDocs from "./pwaComponents/homeComponent/appDocs";
import AppRedirectWeb from "./pwaComponents/homeComponent/appRedirectWeb";
import ProductsByFilter from "./buyerComponent/AllProducts/ProductsByFilter";
import ContactSupport from "./AdminComponent/AdminDashboard/Contact and Support/ContactSupport";
import PullerManagement from "./AdminComponent/AdminDashboard/Puller Manage/PullerManagement";
import ViewPuller from "./AdminComponent/AdminDashboard/Puller Manage/viewPuller";
import HotSelling from "./buyerComponent/AllProducts/HotSelling";
import CloseOut from "./buyerComponent/AllProducts/CloseOut";
import AppHotDealList from "./pwaComponents/homeComponent/appHotDealList";
import AppCloseOutList from "./pwaComponents/homeComponent/appCloseOutList";
import Catelogues from "./buyerComponent/Footer/Catelogues";
import AdminCateFlyers from "./AdminComponent/AdminDashboard/Catalog&Flyers/AdminCateFlyers";
import AllCatalogues from "./buyerComponent/Footer/AllCatalogues";
import AllFlyers from "./buyerComponent/Footer/AllFlyers";
import ViewCatalog from "./buyerComponent/Footer/viewCatalog";
import AddSubAccount from "./AdminComponent/AdminDashboard/UserManage/AddSubAccount";
import ViewSubAcc from "./AdminComponent/AdminDashboard/UserManage/ViewSubAcc";
import EditSubAccount from "./AdminComponent/AdminDashboard/UserManage/EditSubAccount";
import ViewStore from "./buyerComponent/MyAccount/ViewStore";
import AppSubAcc from "./pwaComponents/homeComponent/appSubAcc";
import AppViewSub from "./pwaComponents/homeComponent/appViewSubAcc";
import MonthlyDeals from "./buyerComponent/AllProducts/MonthlyDeals";
import AppMonthlyList from "./pwaComponents/homeComponent/appMonthlyList";
import AppCatalogFlyer from "./pwaComponents/homeComponent/appCatalog&flyer";
import WebView from "./pwaComponents/homeComponent/WebView";
import StarCate from "./AdminComponent/StarCate";
import CreateCatalog from "./AdminComponent/AdminDashboard/Catalog&Flyers/CreateCatalog";
import PreviewCate from "./AdminComponent/AdminDashboard/Catalog&Flyers/PreviewCate";
import EditCatalog from "./AdminComponent/AdminDashboard/Catalog&Flyers/EditCatalog";
import PreviewPrint from "./AdminComponent/AdminDashboard/Catalog&Flyers/PreviewPrint";
import CreatePdfCate from "./AdminComponent/AdminDashboard/Catalog&Flyers/CreatePdfCate";
import PreviewPdfCate from "./AdminComponent/AdminDashboard/Catalog&Flyers/PreviewPdfCate";
import HelpSupport from "./buyerComponent/Extras/HelpSupport";
import LiveDashboard from "./AdminComponent/AdminDashboard/Puller Manage/LiveDashboard";
import ConsentForm from "./buyerComponent/Contact/ConsentForm";
import CreateFlyer from "./AdminComponent/AdminDashboard/Catalog&Flyers/CreateFlyer";
import CreatePdfFlyer from "./AdminComponent/AdminDashboard/Catalog&Flyers/CreatePdfFlyer";
import EditFlyers from "./AdminComponent/AdminDashboard/Catalog&Flyers/EditFlyers";
import NewArrivals from "./buyerComponent/AllProducts/NewArrivals";
import TradeShowManage from "./AdminComponent/AdminDashboard/TradeShows/TradeShowManage";
import OrderForm from "./buyerComponent/Extras/OrderForm";
import ViewTradeStore from "./AdminComponent/AdminDashboard/TradeShows/ViewTradeStore";
import LoginOrderForm from "./buyerComponent/Extras/LoginOrderForm";
import ViewTradeOrder from "./AdminComponent/AdminDashboard/TradeShows/viewTradeOrder";
import ResetPassOrder from "./buyerComponent/Extras/ResetPassOrder";
import OrderFormInvent from "./buyerComponent/Extras/OrderFormInvent";
import TradeOrderPdf from "./AdminComponent/AdminDashboard/TradeShows/TradeOrderPdf";
import TradeMultiplePdfs from "./AdminComponent/AdminDashboard/TradeShows/TradeMultiplePdfs";
import GeneratedQr from "./AdminComponent/AdminDashboard/UserManage/GeneratedQr";
import ViewPersonal from "./AdminComponent/AdminDashboard/UserManage/ViewPersonal";
import EditPersonal from "./AdminComponent/AdminDashboard/UserManage/EditPersonal";
import VisitorManagement from "./AdminComponent/AdminDashboard/VisitorPanel/VisitorManagement";
import GeneratedQrMain from "./AdminComponent/AdminDashboard/UserManage/GeneratedQrMain";
import VisitorCard from "./VisitorCard";
import AppNewArrivalsList from "./pwaComponents/homeComponent/appNewArrivalsList";

function App() {
  const [apiData, setApiData] = useState([]);
  const [cateName, setCateName] = useState();
  const width = window.innerWidth;

  const GetData = (data) => {
    console.log(data);
    setCateName(data);
  };
  console.log("Hello!");

  return (
    <div className="App">
      <ToastContainer />
      <RecoilRoot>
        <Router>
          <ScrollToTop />

          <Routes>
            <Route
              path="*"
              element={width < 999 ? <Homepage /> : <Homepage />}
            />
            <Route
              path="/"
              element={width < 999 ? <AppHome /> : <Homepage />}
            />
            <Route
              path="/MyAccount"
              element={<MyAccount newData={GetData} apiData={apiData} />}
            />
            <Route path="/StarCatalog" element={<StarCate />} />
            <Route path="/Register/ReSubmit" element={<SignUpAgain />} />
            <Route path="/RequestOrder" element={<RequestOrders />} />
            <Route path="/OrderDetails" element={<OrderDetails />} />
            <Route path="/MainMenu" element={<MainMenu />} />
            <Route path="/Address" element={<Address />} />
            <Route path="/Account" element={<Account />} />
            <Route path="/Account/Store/View/:id" element={<ViewStore />} />
            <Route path="/Favourites" element={<Favourites />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/BuyAgain" element={<BuyAgain />} />
            <Route path="/app/OrderForm/:name" element={<OrderForm />} />
            <Route
              path="/app/OrderForm/viewInventory"
              element={<OrderFormInvent />}
            />
            <Route path="/orderform/:name" element={<LoginOrderForm />} />
            <Route
              path="/app/OrderForm/ResetPassword"
              element={<ResetPassOrder />}
            />

            <Route
              path="/app/ProductSearch/:id"
              element={<ProductBySearch />}
            />
            <Route path="/AgeVerified" element={<AgeVerification />} />
            <Route path="/PrivacyPolicies" element={<PrivacyPolicies />} />
            <Route path="/Terms&Condition" element={<TermsCondition />} />
            <Route path="/AboutUs" element={<AboutUs />} />

            <Route
              path="/Category/:id"
              element={<ProductByCate CateName={cateName} />}
            />

            <Route
              path="/Category/Sub-Category/:id"
              element={<ProductBySubCate />}
            />

            <Route
              path="/app/productBrands/:id"
              element={width < 999 ? <AppProductBrands /> : <ProductByBrand />}
            />

            <Route path="/Products/Filter" element={<ProductsByFilter />} />
            <Route path="/app/verify" element={<AgeVerification />} />
            <Route path="/Admin/SubAdmin" element={<SubAdmin />} />
            {/* <Route path="/user/viewDocs" element={<ViewDocs />} /> */}
            <Route
              path="/AllProducts/Product/:id"
              element={width < 999 ? <AppProductDetail /> : <SingleProduct />}
            />

            {/* <Route path="/AllBrands" element={<AllBrands />} /> */}
            <Route path="/Cart" element={<Cart />} />
            <Route path="/app/helpSupport" element={<Cart />} />
            <Route path="/MyQuotes" element={<MyQuotes />} />
            {/* admin Routes */}
            <Route path="/AdminLogin" element={<AdminLogin />} />
            <Route
              path="/AdminForgotPassword"
              element={<AdminForgotPassword />}
            />
            <Route path="/AdminVerifyOtp" element={<AdminSendOtp />} />
            <Route
              path="/AdminResetPassword"
              element={<AdminResetPassword />}
            />
            <Route path="/AdminDashboard" element={<Dashboard />} />
            <Route
              path="/AdminDashboard/EditProfile"
              element={<EditProfile />}
            />
            <Route
              path="/AdminDashboard/ChangePassword"
              element={<ChangePassword />}
            />
            <Route path="/UserManage" element={<UserManage />} />
            <Route path="/UserManage/PendingView" element={<PendingView />} />
            <Route path="/UserManage/ReturnedView" element={<ReturnedView />} />
            <Route path="/UserManage/ApprovedView" element={<ApprovedView />} />
            <Route
              path="/UserManage/ApprovedView/Personal/Edit/:id"
              element={<EditPersonal />}
            />
            <Route
              path="/UserManage/User/Sub-account/:id"
              element={<ViewSubAcc />}
            />

            <Route
              path="/UserManage/User/View-Personal/:id"
              element={<ViewPersonal />}
            />
            <Route
              path="/UserManage/User/Personal/Edit/:id"
              element={<EditPersonal />}
            />
            <Route
              path="/UserManage/User/Sub-account/Edit/:id"
              element={<EditSubAccount />}
            />
            <Route
              path="/UserManage/ApprovedView-editUser"
              element={<EditUser />}
            />
            <Route path="/UserManage/AddUser" element={<AddUser />} />
            <Route
              path="/UserManage/AddSubAccount/:id"
              element={<AddSubAccount />}
            />
            <Route path="/CategorySub" element={<CategorySub />} />
            <Route path="/Inventory" element={<Inventory />} />
            <Route path="/Puller-Management" element={<PullerManagement />} />

            <Route path="/Catelog-Flyers" element={<AdminCateFlyers />} />
            <Route
              path="/admin/Tradeshow-manage"
              element={<TradeShowManage />}
            />
            <Route
              path="/admin/view-TradeStore/:id"
              element={<ViewTradeStore />}
            />
            <Route
              path="/admin/trade-show/viewTradeOrder/:id"
              element={<ViewTradeOrder />}
            />
            <Route path="/VisitorPanel" element={<VisitorManagement />} />

            <Route
              path="/Catelog-Flyers/Create-New/:id"
              element={<CreateCatalog />}
            />

            <Route
              path="/Catelog-Flyers/Create-Flyer/:id"
              element={<CreateFlyer />}
            />
            <Route
              path="/Catelog-Flyers/Create-Flyer-pdf/:id"
              element={<CreatePdfFlyer />}
            />

            <Route
              path="/Catelog-Flyers/Create-New-pdf/:id"
              element={<CreatePdfCate />}
            />

            <Route
              path="/Catelog-Flyers/EditCatalog/:id"
              element={<EditCatalog />}
            />
            <Route
              path="/Catelog-Flyers/EditFlyers/:id"
              element={<EditFlyers />}
            />

            <Route
              path="/Catelog-Flyers/Preview-Catalog/:id"
              element={<PreviewCate />}
            />
            <Route
              path="/Catelog-Flyers/Preview-Catalog-pdf/:id"
              element={<PreviewPdfCate />}
            />
            <Route
              path="/Catelog-Flyers/PreviewPrint-Catalog/:id"
              element={<PreviewPrint />}
            />
            <Route
              path="/Puller-Management/Puller-details/:id"
              element={<ViewPuller />}
            />

            <Route
              path="/Puller-Management/LiveDashboard"
              element={<LiveDashboard />}
            />
            <Route path="/Inventory/View" element={<ViewProduct />} />
            <Route
              path="/Inventory/View-Edit/:id"
              element={<EditInventory />}
            />
            <Route path="/BrandsManage" element={<BrandsManage />} />
            <Route path="/Gallery-Management" element={<GalleryMain />} />
            <Route path="/Cms" element={<Cms />} />
            <Route path="/Contact&Support" element={<ContactSupport />} />
            <Route path="/OrderRequest" element={<OrderReq />} />
            <Route path="/OrderRequest/Pdf/:id" element={<PdfPrint />} />
            <Route
              path="/TradeOrderRequest/Pdf/:id"
              element={<TradeOrderPdf />}
            />
            <Route
              path="/TradeOrderRequest/MultiplePdf"
              element={<TradeMultiplePdfs />}
            />
            <Route path="/GeneratedQr/:id" element={<GeneratedQr />} />
            <Route path="/GeneratedQrMain/:id" element={<GeneratedQrMain />} />
            <Route path="/OrderRequest/user/Pdf/:id" element={<UserPdf />} />
            <Route path="/QuoteRequest/Pdf/:id" element={<QuotePdf />} />
            <Route path="/OrderRequest/ViewOrder/:id" element={<ViewOrder />} />
            <Route
              path="/OrderRequest/ViewOrder/Edit"
              element={<EditOrder />}
            />
            <Route
              path="/OrderRequest/ViewQuotationRequest"
              element={<ViewQuoteReq />}
            />
            <Route path="/OrderRequest" element={<OrderReq />} />
            <Route
              path="/app/Gallery"
              element={width < 999 ? <AppHome /> : <Gallery />}
            />
            <Route path="/app/Gallery/Photos/:id" element={<Photos />} />
            <Route
              path="/app/events/catelog&flyer"
              element={width < 999 ? <AppCatalogFlyer /> : <Catelogues />}
            />
            <Route path="/Dashboard/UserDetails" element={<UserDetails />} />
            <Route path="/Cart/Checkout" element={<Checkout />} />
            <Route path="/app/subCategories" element={<SubCategories />} />
            <Route
              path="/app/product-details/:id"
              element={<SingleProdBySearch />}
            />

            {/* App Routes */}
            <Route
              path="/"
              element={width < 999 ? <AppHome /> : <Homepage />}
            />

            <Route
              path="/app/webView"
              element={width < 999 ? <WebView /> : <Homepage />}
            />

            <Route
              path="/app/downloads"
              element={width < 999 ? <AppDownloads /> : <Homepage />}
            />

            <Route
              path="/app/pre-login"
              element={width < 999 ? <AppPreLogin /> : <Homepage />}
            />
            <Route
              path="/app/login"
              element={width < 999 ? <AppPreLogin /> : <UserLogin />}
            />
            <Route
              path="/app/login-password"
              element={width < 999 ? <AppPreLogin /> : <UserLoginPass />}
            />
            <Route
              path="/app/pre-login-password"
              element={width < 999 ? <AppPreLoginPassword /> : <Homepage />}
            />
            <Route
              path="/app/register"
              element={width < 999 ? <AppSignUp /> : <SignUp />}
            />
            <Route
              path="/app/re-register"
              element={width < 999 ? <AppReSignUp /> : <SignUp />}
            />
            <Route
              path="/app/forgot-password"
              element={width < 999 ? <AppForgotPassword /> : <UserForgotPass />}
            />
            <Route
              path="/app/update-password"
              element={
                width < 999 ? <AppForgotPassword /> : <UserUpdatePassword />
              }
            />

            <Route
              path="/app/otp-verification"
              element={width < 999 ? <AppOtpVerification /> : <Homepage />}
            />
            <Route
              path="/app/success"
              element={
                width < 999 ? <AppForgotPasswordSuccess /> : <Homepage />
              }
            />
            <Route
              path="/app/home"
              element={width < 999 ? <AppHome /> : <Homepage />}
            />
            <Route
              path="/app/homeGuest"
              element={width < 999 ? <AppHome /> : <Homepage />}
            />
            <Route
              path="/app/otp"
              element={
                width < 999 ? <AppOtpVerification /> : <UserOtpValidate />
              }
            />
            <Route
              path="/app/redirect/constantRedirect99/:id"
              element={width < 999 ? <AppRedirectWeb /> : <Homepage />}
            />
            <Route
              path="/app/buy-again"
              element={width < 999 ? <AppBuyAgain /> : <Homepage />}
            />
            <Route
              path="/app/profile/docs"
              element={width < 999 ? <AppDocs /> : <Homepage />}
            />
            <Route
              path="/app/cart"
              element={width < 999 ? <AppCart /> : <Cart />}
            />
            <Route
              path="/app/quotes"
              element={width < 999 ? <AppQuotes /> : <MyQuotes />}
            />
            <Route
              path="/app/help-support"
              element={width < 999 ? <AppHome /> : <HelpSupport />}
            />
            <Route
              path="/app/settings"
              element={width < 999 ? <AppSettings /> : <MyAccount />}
            />
            <Route
              path="/app/privacy-policy"
              element={width < 999 ? <AppPrivacy /> : <PrivacyPolicies />}
            />
            <Route
              path="/app/term-condition"
              element={width < 999 ? <AppTerms /> : <TermsCondition />}
            />
            <Route
              path="/app/about-us"
              element={width < 999 ? <AppAboutUs /> : <AboutUs />}
            />
            <Route
              path="/app/change-password"
              element={width < 999 ? <AppChangePassword /> : <Account />}
            />
            <Route
              path="/app/profile"
              element={width < 999 ? <AppProfile /> : <Account />}
            />
            <Route
              path="/app/edit-profile"
              element={width < 999 ? <AppEditProfile /> : <Account />}
            />
            <Route
              path="/app/my-order"
              element={width < 999 ? <AppMyOrder /> : <MyAccount />}
            />
            <Route
              path="/app/my-request"
              element={width < 999 ? <AppRequests /> : <RequestOrders />}
            />
            <Route
              path="/app/brands"
              element={width < 999 ? <AppBrands /> : <AllBrands />}
            />
            {/* <Route
              path="/app/event/catalog&flyer"
              element={width < 999 ? <AppCatalogFlyer /> : <Catelogues />}
            /> */}
            <Route
              path="/app/Categories"
              element={width < 999 ? <AppCategories /> : <AllCategories />}
            />
            <Route
              path="/app/Sub-Categories/:id"
              element={width < 999 ? <AppSubCategories /> : <AllCategories />}
            />
            <Route
              path="/app/wishlist"
              element={width < 999 ? <AppWishlist /> : <Favourites />}
            />
            <Route
              path="/app/product-detail/:id"
              element={width < 999 ? <AppProductDetail /> : <Homepage />}
            />
            <Route
              path="/app/product-by-search"
              element={width < 999 ? <AppProductBySearch /> : <Homepage />}
            />
            <Route
              path="/app/request-detail/:id"
              element={width < 999 ? <AppRequestDetail /> : <RequestDetails />}
            />

            <Route
              path="/app/order-detail/:id"
              element={width < 999 ? <AppOrderDetail /> : <OrderDetails />}
            />

            <Route
              path="/app/profile/sub-account"
              element={width < 999 ? <AppSubAcc /> : <Homepage />}
            />
            <Route
              path="/app/profile/sub-account/view/:id"
              element={width < 999 ? <AppViewSub /> : <Homepage />}
            />
            <Route
              path="/app/product-category/:id"
              element={<AppProductCategory />}
            />
            <Route
              path="/app/product-subCategory/:id"
              element={<AppProductSubCategory />}
            />
            <Route
              path="/app/productBrands/:id"
              element={width < 999 ? <AppProductBrands /> : <AllBrands />}
            />
            <Route path="/app/product-list" element={<AppProductList />} />
            <Route
              path="/app/product-list/Hot-Deal"
              element={<AppHotDealList />}
            />
             <Route
              path="/app/new-arrival-list"
              element={<AppNewArrivalsList />}
            />
            <Route
              path="/app/product-list/Close-Out"
              element={<AppCloseOutList />}
            />
            <Route
              path="/app/product-list/Monthly"
              element={<AppMonthlyList />}
            />
            <Route
              path="/app/events/catelog&flyer/All-Catalogs"
              element={<AllCatalogues />}
            />
            <Route
              path="/app/events/catelog&flyer/All-Flyers"
              element={<AllFlyers />}
            />
            <Route
              path="/app/events/catelog&flyer/View"
              element={<ViewCatalog />}
            />
            <Route
              path="/app/featured-products"
              element={<FeaturedProducts />}
            />
            <Route
              path="/app/new-arrivals-products"
              element={<NewArrivals />}
            />
            <Route path="/app/HotSelling-products" element={<HotSelling />} />
            <Route path="/app/CloseOut-products" element={<CloseOut />} />
            <Route path="/app/monthly-products" element={<MonthlyDeals />} />
            <Route
              path="/app/checkout"
              element={width < 999 ? <AppCheckout /> : <Checkout />}
            />
            <Route path="/app/thankyou" element={<AppThankyou />} />
            <Route
              path="/app/contact-us"
              element={width < 999 ? <AppContactUs /> : <Contact />}
            />
            <Route
              path="/app/consent-form"
              element={width < 999 ? <AppContactUs /> : <ConsentForm />}
            />
            <Route
              path="/app/terms"
              element={width < 999 ? <AppTerms /> : <TermsCondition />}
            />
            <Route
              path="/app/logout"
              element={width < 999 ? <AppLogout /> : <Homepage />}
            />
            <Route
              path="*"
              component={width < 999 ? <AppHome /> : <Homepage />}
            />
            <Route path="/:7000/visitor/:id" element={<VisitorCard />} />
          </Routes>
        </Router>
      </RecoilRoot>
    </div>
  );
}
//THis is main file
export default App;
