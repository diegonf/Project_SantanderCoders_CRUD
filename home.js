import { countryList } from "./countries.js";
import { createBreed, deleteBreed, readBreeds, updateBreed } from "./services.js";

const wd = window;
let edittingBreed = {status: false, id: ''};
let isStartOfClickInsideBreedForm = false;
let isStartOfClickInsideCardModal = false;

export const homePageInit = () => {
  // load countries data in the form
  countriesDataInit();

  // init form as hidden
  setHideForm();

  // init modal as hidden
  setHideBreedModal();

  // print cards from db (local storage)
  updateCardsDOM();

  // open and close form modal
  wd.btnAddBreed.addEventListener('click', () => setShowForm());
  wd.btnCloseBreedForm.addEventListener('click', setHideForm);
  wd.document.addEventListener('click', closeFormOnOutsideClick); // close form modal when clicked outside
  wd.document.addEventListener('mousedown', closeFormOnOutsideClick); // close form modal when clicked outside
  
  // load img preview and submit form
  wd.breedImageLink.addEventListener('input', setImagePreview);
  wd.newBreedForm.addEventListener('submit', handleFormSubmit);
  
  // close card (breed) modal
  wd.btnCloseBreedModal.addEventListener('click', setHideBreedModal);
  wd.document.addEventListener('click', closeCardModalOnOutsideClick); // close card modal when clicked outside
  wd.document.addEventListener('mousedown', closeCardModalOnOutsideClick); // close card modal when clicked outside
}

// 👇 Form Controls
const countriesDataInit = () => {
  countryList.forEach(country => {
    const countryOpt = document.createElement('option');
    countryOpt.value = country;
    countryOpt.innerText = country;
    wd.breedCountry.appendChild(countryOpt);
  });
}

const setHideForm = () => wd.formModal.classList.add('hidden');

const setShowForm = (breed) => {
  if(breed) {
    edittingBreed.status = true;
    edittingBreed.id = breed.id;

    wd.newBreedForm.breedName.value = breed.name; 
    wd.newBreedForm.breedImageLink.value = breed.img; 
    wd.newBreedForm.breedCountry.value = breed.country; 
    wd.newBreedForm.breedYear.value = breed.year; 
    wd.newBreedForm.breedDescription.value = breed.description; 

    wd.btnSubmitBreedForm.innerText = "Atualizar";
    setImagePreview();
  } else {
    edittingBreed.status = false;
    edittingBreed.id = '';
    wd.btnSubmitBreedForm.innerText = "Registrar";
  }

  wd.formModal.classList.remove('hidden');
};

const setImagePreview = () => {
  const link = wd.breedImageLink.value;
  const img = new Image();

  if (link === '') {
    setDefaultImage();
    return;
  }

  img.src = link;
  img.onload = () => {
    wd.imgPreview.src = link;
    wd.imgPreview.className = 'object-contain w-full h-full'
  }

  img.onerror = () => {
    wd.imgPreview.src = './assets/home-imgs/img-error.svg';
    wd.imgPreview.className = 'opacity-30'
  }
}

const setDefaultImage = () => {
  wd.imgPreview.src = './assets/home-imgs/img-icon.svg';
  wd.imgPreview.className = 'opacity-30'
}

const closeFormOnOutsideClick = (event) => {
  if(event.type === 'mousedown') {
    isStartOfClickInsideBreedForm = wd.formModalContainer.contains(event.target);
    return;
  }

  if(isStartOfClickInsideBreedForm) return;

  const clickedOutOfForm = !wd.formModalContainer.contains(event.target) && wd.formModal.contains(event.target);
  if (clickedOutOfForm) setHideForm();
  
}
// ☝ Form Controls


// 👇 Add New Breed - Form Submition
const handleFormSubmit = (event) => {
  event.preventDefault();

  const elem = event.target;
  const breed = {
    name: elem.breedName.value,
    img: elem.breedImageLink.value,
    country: elem.breedCountry.value,
    year: elem.breedYear.value,
    description: elem.breedDescription.value,
  }

  const nameValidation = validateBreedName(breed.name);
  const imgValidation = validateBreedImg(breed.img);
  const countryValidation = validateBreedCountry(breed.country);
  const yearValidation = validateBreedYear(breed.year);
  const descriptionValidation = validateBreedDescription(breed.description);

  const error = !nameValidation.valid || !imgValidation.valid || !countryValidation.valid || !yearValidation.valid || !descriptionValidation.valid;

  if (error) {
    setErrorMsgs(nameValidation.msg, imgValidation.msg, countryValidation.msg, yearValidation.msg, descriptionValidation.msg);
    setTimeout(setErrorMsgs, 3000);
    return;
  }

  if(edittingBreed.status) {
    updateBreed(edittingBreed.id, breed);
    alert('Cadastro atualizado com sucesso!');
    setHideForm();
    openBreedModal({...breed, id: edittingBreed.id});
    edittingBreed = {status: false, id: ''};
  } else {
    createBreed(breed);
    alert('Cadastro realizado com sucesso!');
  }

  wd.newBreedForm.reset();
  setDefaultImage();
  updateCardsDOM();
}

const validateBreedName = (name) => {
  if (name === '') return { valid: false, msg: 'Nome não pode ser vazio!' };

  return { valid: true, msg: '' };
};

const validateBreedImg = (img) => {
  if (img === '') return { valid: false, msg: 'Link da foto não pode ser vazio!' };

  const imgFile = wd.imgPreview.src.split('/').pop();
  if (imgFile === 'img-error.svg') return { valid: false, msg: 'Link inválido!' }

  return { valid: true, msg: '' };
};

const validateBreedCountry = (country) => {
  if (country === '') return { valid: false, msg: 'País de origem não pode ser vazio!' };

  return { valid: true, msg: '' };
};

const validateBreedYear = (year) => {
  if (year === '') return { valid: false, msg: 'Ano de origem não pode ser vazio!' };

  const currentYear = new Date().getFullYear();
  if (year > currentYear) return { valid: false, msg: 'Ano de origem deve ser <= ano atual!' };

  return { valid: true, msg: '' };
};

const validateBreedDescription = (description) => {
  if (description === '') return { valid: false, msg: 'Descrição não pode ser vazio!' };

  return { valid: true, msg: '' };
};

const setErrorMsgs = (name, img, country, year, description) => {
  wd.breedNameSpan.innerText = name || '';
  wd.breedImageLinkSpan.innerText = img || '';
  wd.breedCountrySpan.innerText = country || '';
  wd.breedYearSpan.innerText = year || '';
  wd.breedDescriptionSpan.innerText = description || '';
}
// ☝ Add New Breed - Form Submition


// 👇 Breed Modal - Open/close and Edit/Delete Buttons
const openBreedModal = (breed) => {
  setShowBreedModal();

  wd.modalImg.src = breed.img;
  wd.modalTitle.innerText = breed.name;
  wd.modalCountry.innerText = breed.country;
  wd.modalYear.innerText = breed.year;
  wd.modalDescription.innerText = breed.description;

  // removing previous event listener
  const btnEditClone = wd.btnEditBreed.cloneNode(true);
  const btnDeleteClone = wd.btnDeleteBreed.cloneNode(true);
  wd.btnEditBreed.parentNode.replaceChild(btnEditClone, wd.btnEditBreed);
  wd.btnDeleteBreed.parentNode.replaceChild(btnDeleteClone, wd.btnDeleteBreed);

  // buttons card (breed) modal
  wd.btnEditBreed.addEventListener('click', () => editBreed(breed));
  wd.btnDeleteBreed.addEventListener('click', () => delBreed(breed));
}

const setShowBreedModal = () => {
  wd.cardModal.classList.remove('hidden');
}

const setHideBreedModal = () => {
  wd.cardModal.classList.add('hidden');

  wd.modalImg.src = '#';
  wd.modalTitle.innerText = 'Raça do Cachorro';
  wd.modalCountry.innerText = 'País';
  wd.modalYear.innerText = 'Ano';
  wd.modalDescription.innerText = 'Descrição da Raça';
}

const delBreed = (breed) => {
  deleteBreed(breed);

  alert(`Raça ${breed.name} deletada com sucesso!`);
  setHideBreedModal();
  updateCardsDOM();
}

const editBreed = (breed) => {
  setHideBreedModal();
  setShowForm(breed);
}

const closeCardModalOnOutsideClick = (event) => {
  if(event.type === 'mousedown') {
    isStartOfClickInsideCardModal = wd.cardModalContainer.contains(event.target);
    return;
  }

  if(isStartOfClickInsideCardModal) return;

  const clickedOutOfCardModal = !wd.cardModalContainer.contains(event.target) && wd.cardModal.contains(event.target);
    if (clickedOutOfCardModal) setHideBreedModal();
  
}
// ☝ Breed Modal - Open/close and Edit/Delete Buttons


const updateCardsDOM = () => {
  const breeds = readBreeds();

  wd.listContainer.innerHTML = ''; // clear all cards

  breeds.forEach(breed => {
    const breedCard = document.createElement('div');
    breedCard.className = 'border-2 border-solid border-teal-500 rounded-2xl cursor-pointer hover:scale-110 transition flex flex-col max-sm:w-[calc(50%-(2rem/2))] max-sm:max-w-[15rem] max-md:w-[calc(33.33%-(8rem/3))] max-lg:w-[calc(25%-(12rem/4))] w-[calc(20%-16rem/5)]';

    const imgContainer = document.createElement('div');
    imgContainer.className = 'h-52 xl:h-64 2xl:h-[20rem]';

    const img = document.createElement('img');
    img.src = breed.img;
    img.alt = `Foto da raça ${breed.name}`;
    img.className = 'w-full h-full rounded-t-2xl object-cover object-top bg-teal-300'

    const nameContainer = document.createElement('div');
    nameContainer.className = 'flex-1 w-full flex justify-center items-center';

    const name = document.createElement('h2');
    name.className = 'text-center font-bold p-3';
    name.innerText = breed.name;

    breedCard.appendChild(imgContainer);
    breedCard.appendChild(nameContainer);
    imgContainer.appendChild(img);
    nameContainer.appendChild(name);
    wd.listContainer.appendChild(breedCard);

    breedCard.addEventListener('click', () => openBreedModal(breed));

  });
}