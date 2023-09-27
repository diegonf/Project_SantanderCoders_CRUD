export const getUsersDB = () => {
  return JSON.parse(localStorage.getItem('usersDB')) || [];
}

export const addNewUserToDB = (user) => {
  const users = getUsersDB();
  users.push(user);
  localStorage.setItem('usersDB', JSON.stringify(users));
}

export const setCurrentUser = (user) => {
  if(!user) {
    sessionStorage.setItem('currentUser', JSON.stringify({id: '', email: '', authenticaded: false }));
    return;
  }
  
  sessionStorage.setItem('currentUser', JSON.stringify({ id: user.id, email: user.email, authenticaded: true }));
}

export const getCurrentUser = () => {
  return JSON.parse(sessionStorage.getItem('currentUser'));
}

export const userAuthenticaded = () => {
  const currentUser = getCurrentUser();
  if(currentUser?.authenticaded === true && currentUser?.email !== '' && currentUser?.id !== '') return true
  else {
    setCurrentUser(null);
    return false;
  }
}

export const createBreed = (breed) => {
  if(!breed) return;

  const user = getCurrentUser();
  const breeds = readBreeds();
  breeds.push(breed);
  localStorage.setItem(user.id, JSON.stringify(breeds));
}

export const readBreeds = () => {
  const user = getCurrentUser();
  return JSON.parse(localStorage.getItem(user.id)) || [];
}