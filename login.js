import { updatePageDOM } from "./script.js";
import { addNewUserToDB, userLogin } from "./services.js";
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const wd = window;

export const userFormInit = () => {
  // tabs
  setLoginTab(); // setting initial value
  wd.loginTab.addEventListener('click', setLoginTab);
  wd.registerTab.addEventListener('click', setRegisterTab);

  // password visibility
  setHideRegisterPassword(); // setting initial value
  wd.registerOpenEye.addEventListener('click', setHideRegisterPassword);
  wd.regiserClosedEye.addEventListener('click', setShowRegisterPassword);

  // submit buttons
  wd.loginForm.addEventListener('submit', handleLoginFormSubmit);
  wd.registerForm.addEventListener('submit', handleRegisterFormSubmit);
}

const setLoginTab = () => {
  wd.loginTab.classList.add('bg-white');
  wd.loginForm.classList.remove('hidden');
  wd.registerTab.classList.remove('bg-white');
  wd.registerForm.classList.add('hidden');
}

const setRegisterTab = () => {
  wd.loginTab.classList.remove('bg-white');
  wd.loginForm.classList.add('hidden');
  wd.registerTab.classList.add('bg-white');
  wd.registerForm.classList.remove('hidden');
}

const setShowRegisterPassword = () => {
  wd.registerPass.type = 'text';
  wd.registerPass.placeholder = 'senha';
  wd.registerOpenEye.classList.remove('hidden');
  wd.regiserClosedEye.classList.add('hidden');
}

const setHideRegisterPassword = () => {
  wd.registerPass.type = 'password';
  wd.registerPass.placeholder = '********';
  wd.registerOpenEye.classList.add('hidden');
  wd.regiserClosedEye.classList.remove('hidden');
}

// 👇 Register - Form Submit
const handleRegisterFormSubmit = (event) => {
  event.preventDefault();

  const email = event.target.registerEmail.value;
  const password = event.target.registerPass.value;

  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);

  if (!emailValidation.valid || !passwordValidation.valid) {
    setRegisterErrorMsgs(emailValidation.msg, passwordValidation.msg);
    return;
  }

  try {
    addNewUserToDB({ email, password, id: uuidv4() });
    wd.registerForm.reset();
    alert("Usuário cadastrado com sucesso!");
  } catch (error) {
    setRegisterErrorMsgs('', error);   
  }
}

const validateEmail = (email) => {
  if (email === '') return { valid: false, msg: 'Email não pode ser vazio!' };

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const invalidEmail = !regex.test(email);
  if (invalidEmail) return { valid: false, msg: 'Email invalido. Email deve ser no formato email@exemplo.com' };

  return { valid: true, msg: '' };
}

const validatePassword = (password) => {
  if (password === '') return { valid: false, msg: 'Password não pode ser vazio!' };

  if (password.length < 3) return { valid: false, msg: 'Password precisa ter pelo menos 3 caracteres!' };

  return { valid: true, msg: '' };
}

const setRegisterErrorMsgs = (emailMsg, passwordMsg) => {
  wd.registerEmailSpan.innerText = emailMsg;
  wd.registerPassSpan.innerText = passwordMsg;

  setTimeout(() => {
    wd.registerEmailSpan.innerText = '';
    wd.registerPassSpan.innerText = '';
  }, 3000);
}
// ☝ Register - Form Submit


// 👇 Login - Form Submit
const handleLoginFormSubmit = (event) => {
  event.preventDefault();

  const email = event.target.email.value;
  const password = event.target.password.value;

  if (email === '' || password === '') {
    const emailMsg = email === '' ? 'Email não pode ser vazio!' : ''
    const passwordMsg = password === '' ? 'Password não pode ser vazio' : ''
    setLoginErrorMsgs(emailMsg, passwordMsg);

    return;
  }

  const user = userLogin(email, password);
  if (!user) {
    setLoginErrorMsgs('', 'Usuário ou senha incorretos!');
    return;
  }

  alert("Login realizado com sucesso!")
  wd.loginForm.reset();

  updatePageDOM();
}

const setLoginErrorMsgs = (emailMsg, passwordMsg) => {
  wd.loginEmailSpan.innerText = emailMsg;
  wd.loginPasswordSpan.innerText = passwordMsg;

  setTimeout(() => {
    wd.loginEmailSpan.innerText = '';
    wd.loginPasswordSpan.innerText = '';
  }, 3000);
}
// ☝ Login - Form Submit



