// Simple validation functions for beginners

// Check if email is valid
export const isValidEmail = (email) => {
  return email && email.includes('@') && email.includes('.');
};

// Check if password is strong enough
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Check if mobile number is valid
export const isValidMobile = (mobile) => {
  return mobile && mobile.length >= 10;
};

// Check if name is valid
export const isValidName = (name) => {
  return name && name.trim().length >= 2;
};

// Check if amount is valid
export const isValidAmount = (amount, balance = null) => {
  const num = parseFloat(amount);
  
  if (!amount || isNaN(num) || num <= 0) {
    return { valid: false, message: 'Amount must be greater than 0' };
  }
  
  if (num > 100000) {
    return { valid: false, message: 'Amount cannot exceed ₹1,00,000' };
  }
  
  if (balance !== null && num > balance) {
    return { valid: false, message: 'Insufficient balance' };
  }
  
  return { valid: true, message: '' };
};

// Validate registration form
export const validateRegistrationForm = (formData) => {
  const errors = {};
  
  if (!isValidName(formData.firstName)) {
    errors.firstName = 'First name must be at least 2 characters';
  }
  
  if (!isValidName(formData.lastName)) {
    errors.lastName = 'Last name must be at least 2 characters';
  }
  
  if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Password validation removed for OTP-only login
  
  if (!isValidMobile(formData.mobile)) {
    errors.mobile = 'Mobile number must be at least 10 digits';
  }
  
  return errors;
};

// Validate login form
export const validateLoginForm = (formData) => {
  const errors = {};
  
  if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!formData.password) {
    errors.password = 'Password is required';
  }
  
  return errors;
};