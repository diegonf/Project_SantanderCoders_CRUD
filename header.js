import { updatePageDOM } from "./script.js";
import { getCurrentUser, setCurrentUser } from "./services.js";

const wd = window;

export const navbarUserInit = () => {
  const currentUser = getCurrentUser();

  wd.loggedinContainer.classList.remove('hidden')
  wd.loggedinMsg.innerText = currentUser.email[0].toUpperCase();
  wd.logoutIcon.addEventListener('click', () => {
    if(!confirm('Tem certeza que deseja deslogar?')) return;

    setCurrentUser(null);
    clearLogoutControls();
    updatePageDOM();    
  });
}

export const clearLogoutControls = () => {
  wd.loggedinContainer.classList.add('hidden');
}