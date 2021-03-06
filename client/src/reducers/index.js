import {combineReducers} from 'redux';
// import {reducer as formReducer} from 'redux-form';
import NavBarReducer from './NavbarReducer';
import UserReducer from './UserReducer';
import OwnerReducer from './OwnerReducer';
import CustomerReducer from './CustomerReducer';
import PaymentAccounts from './PaymentReducer'
import AdminReducer from './AdminReducer';
import {registration} from './RegistrationReducer';
import {authentication} from './AuthenticationReducer';
import {service} from './Service';
import {reservation} from './ServiceReservationReducer';

const rootReducer = combineReducers({
	// navbarState: NavBarReducer
	UserReducer,
	OwnerReducer,
	CustomerReducer,
	AdminReducer,
	registration,
	authentication,
	service,
	reservation,
	payment_accounts: PaymentAccounts
});

export default rootReducer;