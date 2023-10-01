import { updatePageDOM } from "./script.js";
import { currentUser, userLogout } from "./services.js";

const wd = window;

export const navbarUserInit = () => {

  setUserLoggedinControls();

  wd.logoutIcon.addEventListener('click', logout);
}

const setUserLoggedinControls = () => {
  const user = currentUser();
  wd.loggedinContainer.classList.remove('hidden')
  wd.loggedinMsg.innerText = user.email[0].toUpperCase();
}

const logout = () => {
  if (!confirm('Tem certeza que deseja deslogar?')) return;

  userLogout();
  setHideUserLoggedinControls();
  updatePageDOM();
}

const setHideUserLoggedinControls = () => {
  wd.loggedinContainer.classList.add('hidden');
}

export const updateNavbarTimer = (timer) => {
  wd.timer.innerText = timer;
}