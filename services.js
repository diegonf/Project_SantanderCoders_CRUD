const CRUD_LINK = 'https://crudcrud.com/api/ca7ee6b776934a729027cae99c79560c';
const CRUD_LINK2 = 'https://crudcrud.com/api/7052d71a03784ff397c0059cd194e13a';

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

const getURL = () => {
  const currentUser = getCurrentUser();
  const url = `${CRUD_LINK}/breeds${currentUser.id}`;
  return url;
}

export const createBreed = async (breed) => {
  if(!breed) return;

  //CRUD CRUD
  const response = await fetch(getURL(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(breed)
  });
  if(!response.ok) throw new Error('Não foi possível completar a solicitação!');

  const newBreed = await response.json();

  //LS
  const breeds = await readBreeds();
  breeds.push(newBreed);
  setBreedsLS(breeds);
}

export const readBreeds = async () => {
  // LS
  const user = getCurrentUser();
  const breedsLocalStorage = JSON.parse(localStorage.getItem(user.id));
  
  // CRUD CRUD
  const response = await fetch(getURL());
  if(!response.ok) throw new Error('Não foi possível completar a solicitação!');
  const breedsDB = await response.json();
  console.log('DB CRUD CRUD: ', breedsDB);

  if(breedsLocalStorage) return breedsLocalStorage; 
  setBreedsLS(breedsDB);
  return breedsDB;
}

export const readBreed = async (_id) => {
  if(!_id) return;

  // crud crud
  const response = await fetch(`${getURL()}/${_id}`);
  if(!response.ok) throw new Error('Não foi possível completar a solicitação!');

  const breed = await response.json();
  return breed;
}

export const deleteBreed = async (breed) => {
  if(!breed) return;
  
  // CRUD CRUD
  const response = await fetch(`${getURL()}/${breed._id}`, {method: 'DELETE'});
  if(!response.ok) throw new Error('Não foi possível completar a solicitação!');

  // LS
  const breeds = await readBreeds();
  const breedIndex = breeds.findIndex(item => item._id === breed._id);
  if(breedIndex === -1) throw new Error('ID não encontrado!');

  breeds.splice(breedIndex, 1);
  setBreedsLS(breeds);
}

export const updateBreed = async (_id, newBreed) => {
  if(!_id || !newBreed) return;
  
  // CRUD CRUD
  const response = await fetch(`${getURL()}/${_id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newBreed)
  });
  if(!response.ok) throw new Error('Não foi possível completar a solicitação!');

  // LS
  const breeds = await readBreeds();
  const breedIndex = breeds.findIndex(item => item._id === _id);
  if(breedIndex === -1) throw new Error("ID não encontrado");

  breeds.splice(breedIndex, 1, {...newBreed, _id});
  setBreedsLS(breeds);
}

const setBreedsLS = (breeds) => {
  const user = getCurrentUser();
  localStorage.setItem(user.id, JSON.stringify(breeds));
};
