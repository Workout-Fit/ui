import Toastify from 'toastify-js';

export const showToast = (
	severity: 'success' | 'error' | 'warning' | 'info',
	options: Toastify.Options
) => Toastify({ ...options, className: `toastify--${severity}` }).showToast();
