import { navbarUserInit, updateNavbarTimer } from "./header.js";
import { homePageInit, updateCardsDOM } from "./home.js";
import { userFormInit } from "./login.js";
import { currentUser } from "./services.js";

const wd = window;

export const updatePageDOM = () => {
  // set initial value to show login page
  setShowLoginPage();

  if (currentUser()) {
    setShowHomePage();
    navbarUserInit();
    homePageInit();
    timerController.startMyInterval();
    
  } else {
    setShowLoginPage();
    userFormInit();
    timerController.clearMyInterval();
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

const timerController = {
  timer: 5,
  myInterval: null,
  handleTimer: function() {
    updateNavbarTimer(this.timer--)
    if(this.timer === -1) {
      updateCardsDOM();
      this.timer = 5;
    }
  },
  startMyInterval: function() {
    this.myInterval = setInterval(() => this.handleTimer(), 1000);
  },
  clearMyInterval: function() {
    clearInterval(this.myInterval);
  }
}

updatePageDOM();
// runs once in the begging and then after user interactions in home.js, login.js and header.js or with setInterval