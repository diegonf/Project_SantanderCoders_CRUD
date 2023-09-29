import { updatePageDOM } from "./script.js";
import { getCurrentUser, setCurrentUser } from "./services.js";

const wd = window;

export const navbarUserInit = () => {

  setUserLoggedinControls();

  wd.logoutIcon.addEventListener('click', logout);
}

const setUserLoggedinControls = () => {
  const currentUser = getCurrentUser();
  wd.loggedinContainer.classList.remove('hidden')
  wd.loggedinMsg.innerText = currentUser.email[0].toUpperCase();
}

const logout = () => {
  if (!confirm('Tem certeza que deseja deslogar?')) return;

  setCurrentUser(null);
  setHideUserLoggedinControls();
  updatePageDOM();
}

const setHideUserLoggedinControls = () => {
  wd.loggedinContainer.classList.add('hidden');
}

export const updateTimer = (timer) => {
  wd.timer.innerText = timer;
}