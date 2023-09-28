import { navbarUserInit } from "./header.js";
import { homePageInit } from "./home.js";
import { userFormInit } from "./login.js";
import { userAuthenticaded } from "./services.js";

const wd = window;

export const updatePageDOM = () => {
  // set initial value to show login page
  setShowLoginPage();

  if (userAuthenticaded()) {
    setShowHomePage();
    navbarUserInit();
    homePageInit();
    
  } else {
    setShowLoginPage();
    userFormInit();
  }
}

const setShowLoginPage = () => {
  wd.homePage.classList.add('hidden');
  wd.loginPage.classList.remove('hidden');
}

const setShowHomePage = () => {
  wd.homePage.classList.remove('hidden');
  wd.loginPage.classList.add('hidden');
}

// runs once in the begging and then after user interactions in home.js, login.js and header.js
updatePageDOM();