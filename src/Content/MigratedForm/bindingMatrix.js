import CustomerForm from './TrulyMigratedComponents/CustomerForm';
import ContactForm from './TrulyMigratedComponents/ContactForm';

export const bindingMatrix = {
	contact_form: {
		component: ContactForm,
	},
	customer_form: {
		component: CustomerForm,
	},
};

export const migratedBindingTypes = Object.keys(bindingMatrix);
