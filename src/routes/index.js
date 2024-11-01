import AccountHistory from '../screen/AccountHistory';
import AdvancedSettings from '../screen/AdvancedSettings';
import ChangePassword from '../screen/ChangePassword';
// import OTPCode from '../screen/OTPCode';
import Settings from '../screen/AccountSettings';
import AgentAssistLogin from '../screen/AgentAssist';
import AgentAssistPermissions from '../screen/AgentAssist/AgentAssistPermissions';
import ContractHistory from '../screen/Contract/ContractHistory';
import ContractPhotos from '../screen/Contract/ContractPhotos';
import ContractUploadPhoto from '../screen/Contract/ContractUploadPhoto';
import CreateContract from '../screen/Contract/CreateContract';
import CreatorContractDetail from '../screen/Contract/CreatorContractDetail';
import FilterContract from '../screen/Contract/FilterContract';
import InviteCosigner from '../screen/Contract/InviteCosigner';
import ProofOfPayment from '../screen/Contract/ProofOfPayment';
import RequestUnlock from '../screen/Contract/RequestUnlock';
import SearchContract from '../screen/Contract/SearchContract';
import TakePhotoContract from '../screen/Contract/TakePhotoContract';
import TransferContract from '../screen/Contract/TransferContract';
import ViewCertificate from '../screen/Contract/ViewCertificate';
import ViewCertificateVerified from '../screen/Contract/ViewContractPdf';
import CreatorTakePhoto from '../screen/Contract/components/CreatorTakePhoto';
import CreatePlot from '../screen/CreatePlot';
import CreateProfile from '../screen/CreateProfile';
import CredentialVerify from '../screen/CredentialVerify';
import EditProfile from '../screen/EditProfile';
import Map from '../screen/Explore';
import FilterPage from '../screen/Explore/FilterPage';
import HelpCenter from '../screen/HelpCenter';
import Invites from '../screen/Invites';
import LinkingAccount from '../screen/LinkingAccount';
import AddAccountLink from '../screen/LinkingAccount/AddAccountLink';
import Main from '../screen/Main';
import MyCert from '../screen/MyCert';
import PlotInfo from '../screen/PlotInfo';
import PlotStatus from '../screen/PlotStatusDetails';
import SendReqClaimant from '../screen/Plots/SendReqClaimant';
import Profile from '../screen/Profile';
import ProfileHistory from '../screen/ProfileHistory';
import ReplacePhoneNumber from '../screen/ReplacePhoneNumber';
import ScanQr from '../screen/ScanQr/index';
import TakeAPhoto from '../screen/TakeAPhoto';
import TransferOwnership from '../screen/TransferOwnership';
import WelcomeScreen from '../screen/Welcome';
import ForgotPassword from '../screen/Welcome/ForgotPassword';
import Login from '../screen/Welcome/SignIn';
import SignUp from '../screen/Welcome/SignUp';
import SetPassword from '../screen/Welcome/SignUp/SetPassword';
import SearchAndDownload from '../screen/SearchAndDownload';
import MapPreview from '../screen/MapPreview';
import MyOfflinePlot from '../screen/MyOfflinePlot';
import PolygonPending from '../screen/PolygonPending';
import OfflineCreatePlot from '../screen/OfflineCreatePlot';
import OfflineMap from '../screen/OfflineMap';
import AskRecommendation from '../screen/AskRecommendation';
import NewRecommendation from '../screen/AskRecommendation/NewRecommendation';
import TestRNMapBox from '../screen/TestRNMapBox';
import UploadOfflinePlot from '../screen/UploadOfflinePlot';
import AssignInviteOfflinePlot from '../screen/UploadOfflinePlot/AssignClaimants';
import RatingDetail from '../screen/RatingDetail';
import ClaimrankSystem from '../screen/ClaimrankSystem/ClaimrankSystem';
import F from '../components/FaceRecognition/index';

const routes = [
    {
        component: WelcomeScreen,
        name: 'Welcome',
        options: { headerShown: false },
    },
    {
        component: Login,
        name: 'Login',
        options: { headerShown: false, title: '' },
    },
    {
        component: SignUp,
        name: 'SignUp',
        options: { headerShown: false, title: '' },
    },
    {
        component: SetPassword,
        name: 'SetPassword',
        options: { headerShown: true, title: 'Set Password' },
    },
    {
        component: ForgotPassword,
        name: 'ForgotPassword',
        options: { headerShown: false, title: 'Forgot Password' },
    },
    {
        component: AssignInviteOfflinePlot,
        name: 'uploadOfflinePlotAssign',
        options: { headerShown: false },
    },
    // {
    //     component: OTPCode,
    //     name: 'OTPCode',
    //     options: { headerShown: true, title: 'PIN Code Verification' },
    // },
    {
        component: AgentAssistLogin,
        name: 'AgentAssistLogin',
        options: { headerShown: false, title: 'Agent Assist Login' },
    },
    {
        component: AgentAssistPermissions,
        name: 'AgentAssistPermissions',
        options: { headerShown: false, title: 'Agent Assist Permissions' },
    },
    {
        component: TakeAPhoto,
        name: 'TakeAPhoto',
        options: { headerShown: false, title: 'Take a Photo of Face' },
    },
    {
        component: CreateProfile,
        name: 'CreateProfile',
        options: { headerShown: true, title: 'Create Profile' },
    },
    {
        component: Map,
        name: 'Map',
        options: { headerShown: true, title: 'Map' },
    },
    {
        component: Main,
        name: 'Main',
        options: { headerShown: false },
    },
    {
        component: CreatePlot,
        name: 'CreatePlot',
        options: { headerShown: false },
    },
    {
        component: Profile,
        name: 'Profile',
        options: { headerShown: false },
    },
    {
        component: EditProfile,
        name: 'EditProfile',
        options: { headerShown: false },
    },
    {
        component: PlotInfo,
        name: 'PlotInfo',
        options: { headerShown: false },
    },
    {
        component: HelpCenter,
        name: 'HelpCenter',
        options: { headerShown: true, title: 'Help Center' },
    },
    {
        component: Invites,
        name: 'Invites',
        options: { headerShown: false },
    },
    {
        component: PolygonPending,
        name: 'PolygonPending',
        options: { headerShown: false },
    },
    {
        component: PlotStatus,
        name: 'PlotStatusDetails',
        options: { headerShown: false },
    },
    {
        component: FilterPage,
        name: 'FilterPage',
        options: { headerShown: false },
    },
    // New Contract
    {
        component: CreateContract,
        name: 'CreateContract',
        options: { headerShown: false },
    },
    {
        component: CreatorContractDetail,
        name: 'CreatorContractDetail',
        options: { headerShown: false },
    },
    {
        component: ViewCertificate,
        name: 'ViewCertificate',
        options: { headerShown: false },
    },
    {
        component: InviteCosigner,
        name: 'InviteCosigner',
        options: { headerShown: false },
    },
    {
        component: ViewCertificateVerified,
        name: 'ViewCertificateVerified',
        options: { headerShown: false },
    },
    {
        component: ScanQr,
        name: 'ScanQr',
        options: { headerShown: false },
    },
    {
        component: CredentialVerify,
        name: 'CredentialVerify',
        options: { headerShown: false },
    },
    {
        component: ReplacePhoneNumber,
        name: 'ReplacePhoneNumber',
        options: { headerShown: false, title: 'Update Phone Number' },
    },
    {
        component: AdvancedSettings,
        name: 'AdvancedSettings',
        options: { headerShown: true, title: 'Advanced Settings' },
    },
    {
        component: ProfileHistory,
        name: 'ProfileHistory',
        options: { headerShown: false },
    },
    {
        component: MyCert,
        name: 'MyCert',
        options: { headerShown: false, title: 'My Certificate' },
    },
    {
        component: AccountHistory,
        name: 'AccountHistory',
        options: { headerShown: false, title: 'Account History' },
    },
    {
        component: TestRNMapBox,
        name: 'TestRNMapBox',
        options: { headerShown: false, title: 'TestRNMapBox' },
    },
    // {
    //     component: Settings,
    //     name: 'Settings',
    //     options: { headerShown: true, title: 'Settings' },
    // },
    {
        component: Settings,
        name: 'Settings',
        options: { headerShown: true, title: 'Settings' },
    },
    {
        component: ChangePassword,
        name: 'ChangePassword',
        options: { headerShown: false },
    },
    {
        component: RequestUnlock,
        name: 'RequestUnlock',
        options: { headerShown: false },
    },
    {
        component: ProofOfPayment,
        name: 'ProofOfPayment',
        options: { headerShown: false },
    },
    {
        component: ContractHistory,
        name: 'ContractHistory',
        options: { headerShown: false },
    },
    {
        component: LinkingAccount,
        name: 'LinkingAccount',
        options: { headerShown: false },
    },
    {
        component: AddAccountLink,
        name: 'AddAccountLink',
        options: { headerShown: false },
    },
    {
        component: CreatorTakePhoto,
        name: 'CreatorTakePhoto',
        options: { headerShown: false },
    },
    {
        component: AskRecommendation,
        name: 'AskRecommendation',
        options: { headerShown: false },
    },
    {
        component: NewRecommendation,
        name: 'NewRecommendation',
        options: { headerShown: false },
    },
    {
        component: TakePhotoContract,
        name: 'TakePhotoContract',
        options: { headerShown: false },
    },
    {
        component: ContractUploadPhoto,
        name: 'ContractUploadPhoto',
        options: { headerShown: false },
    },
    {
        component: SearchContract,
        name: 'SearchContract',
        options: { headerShown: false },
    },
    {
        component: FilterContract,
        name: 'FilterContract',
        options: { headerShown: false },
    },
    {
        component: ContractPhotos,
        name: 'ContractPhotos',
        options: { headerShown: false },
    },
    {
        component: SendReqClaimant,
        name: 'SendReqClaimant',
        options: { headerShown: false },
    },
    {
        component: TransferOwnership,
        name: 'TransferOwnership',
        options: { headerShown: false },
    },
    {
        component: TransferContract,
        name: 'TransferContract',
        options: { headerShown: false },
    },
    {
        component: OfflineMap,
        name: 'OfflineMap',
        options: { headerShown: false },
    },
    {
        component: MapPreview,
        name: 'MapPreview',
        options: { headerShown: false },
    },
    {
        component: UploadOfflinePlot,
        name: 'UploadOfflinePlot',
        options: { headerShown: false },
    },
    {
        component: OfflineCreatePlot,
        name: 'OfflineCreatePlot',
        options: { headerShown: false },
    },
    {
        component: SearchAndDownload,
        name: 'SearchAndDownload',
        options: { headerShown: false },
    },
    {
        component: MyOfflinePlot,
        name: 'MyOfflinePlot',
        options: { headerShown: false },
    },
    {
        component: RatingDetail,
        name: 'RatingDetail',
        options: { headerShown: false },
    },
    {
        component: ClaimrankSystem,
        name: 'ClaimrankSystem',
        options: { headerShown: false },
    },
    {
        component: F,
        name: 'FaceRecognition',
        options: { headerShown: false },
    },
];

export default routes;
