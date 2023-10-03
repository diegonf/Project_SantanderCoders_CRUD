const CRUD_LINK = 'https://crudcrud.com/api/277b6c206311461696d4af60f4c0505f';

// 👇 user Register and Login
export const addNewUserToDB = (user) => {
  const users = getUsersDB();
  const emailExists = users.some(item => item.email === user.email);
  if (emailExists) throw new Error('Email já cadastrado, favor realizar login!');

  users.push(user);
  localStorage.setItem('usersDB', JSON.stringify(users));
}

export const currentUser = () => {
  const userLoggedin = JSON.parse(sessionStorage.getItem('currentUser'));

  const validUser = userLoggedin?.authenticaded && userLoggedin?.email && userLoggedin?.id;
  if (validUser) return userLoggedin;
  
  setCurrentUser(null);
  return null;
}

export const userLogin = (email, password) => {
  const users = getUsersDB();
  const user = users.find(item => item.email === email);

  if (!user) return false;
  if (user.password !== password) return false;

  setCurrentUser(user);
  return user;
}

export const userLogout = () => {
  setCurrentUser(null);
}

const getUsersDB = () => {
  return JSON.parse(localStorage.getItem('usersDB')) || [];
}

const setCurrentUser = (user) => {
  if (!user) {
    sessionStorage.setItem('currentUser', JSON.stringify({ id: '', email: '', authenticaded: false }));
    return;
  }

  sessionStorage.setItem('currentUser', JSON.stringify({ id: user.id, email: user.email, authenticaded: true }));
}
// ☝ user Register and Login



// 👇 CRUD db breeds
export const createBreed = async (breed) => {
  if (!breed) return;

  //CRUD CRUD
  const response = await fetch(getURL(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(breed)
  });
  if (!response.ok) throw new Error('Não foi possível completar a solicitação!');

  const newBreed = await response.json();

  //LS
  const breeds = await readBreeds();
  breeds.push(newBreed);
  setBreedsLS(breeds);
}

export const readBreeds = async (firstRender) => {
  // LS
  const user = currentUser();
  const breedsLocalStorage = JSON.parse(localStorage.getItem(user.id));
  if (breedsLocalStorage && !firstRender) return breedsLocalStorage;

  // CRUD CRUD (only if no data was found on LS or if it is firstRender after login)
  const response = await fetch(getURL());
  if (!response.ok) throw new Error('Não foi possível completar a solicitação!');
  const breedsDB = await response.json();

  setBreedsLS(breedsDB);
  return breedsDB;
}

export const readBreed = async (_id) => {
  if (!_id) return;

  // crud crud
  const response = await fetch(`${getURL()}/${_id}`);
  if (!response.ok) throw new Error('Não foi possível completar a solicitação!');

  const breed = await response.json();
  return breed;
}

export const deleteBreed = async (breed) => {
  if (!breed) return;

  // CRUD CRUD
  const response = await fetch(`${getURL()}/${breed._id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Não foi possível completar a solicitação!');

  // LS
  const breeds = await readBreeds();
  const breedIndex = breeds.findIndex(item => item._id === breed._id);
  if (breedIndex === -1) throw new Error('ID não encontrado!');

  breeds.splice(breedIndex, 1);
  setBreedsLS(breeds);
}

export const updateBreed = async (_id, newBreed) => {
  if (!_id || !newBreed) return;

  // CRUD CRUD
  const response = await fetch(`${getURL()}/${_id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newBreed)
  });
  if (!response.ok) throw new Error('Não foi possível completar a solicitação!');

  // LS
  const breeds = await readBreeds();
  const breedIndex = breeds.findIndex(item => item._id === _id);
  if (breedIndex === -1) throw new Error("ID não encontrado");

  breeds.splice(breedIndex, 1, { ...newBreed, _id });
  setBreedsLS(breeds);
}

const setBreedsLS = (breeds) => {
  const user = currentUser();
  localStorage.setItem(user.id, JSON.stringify(breeds));
};

const getURL = () => {
  const user = currentUser();
  const url = `${CRUD_LINK}/breeds${user.id}`;
  return url;
}
// ☝ CRUD db breeds