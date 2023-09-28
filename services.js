import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

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
  breeds.push({...breed, id: uuidv4()});
  setBreedsLS(breeds);
}

export const readBreeds = () => {
  const user = getCurrentUser();
  return JSON.parse(localStorage.getItem(user.id)) || [];
}

// const readBreed = (id) => {
//   const breeds = readBreeds();
//   const breed = breeds.find(item => item.id === id);
//   if(!breed) throw new Error("ID não encontrado!");

//   return breed;
// }

export const deleteBreed = (breed) => {
  const breeds = readBreeds();
  const breedIndex = breeds.findIndex(item => item.id === breed.id);
  if(breedIndex === -1) throw new Error('ID não encontrado!');

  breeds.splice(breedIndex, 1);
  setBreedsLS(breeds);
}

export const updateBreed = (id, newBreed) => {
  const breeds = readBreeds();
  const breedIndex = breeds.findIndex(item => item.id === id);
  if(breedIndex === -1) throw new Error("ID não encontrado");

  breeds.splice(breedIndex, 1, newBreed);
  setBreedsLS(breeds);
}

const setBreedsLS = (breeds) => {
  const user = getCurrentUser();
  localStorage.setItem(user.id, JSON.stringify(breeds));
};