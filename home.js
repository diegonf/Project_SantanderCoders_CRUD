import { countryList } from "./countries.js";
import { createBreed } from "./services.js";

const wd = window;

export const breedFormInit = () => {
  // load countries data
  countriesDataInit();

  // init form as hidden
  setHideForm();

  wd.btnAddBreed.addEventListener('click', setShowForm);
  wd.btnCloseBreedForm.addEventListener('click', setHideForm);

  wd.breedImageLink.addEventListener('input', setImagePreview);
  wd.newBreedForm.addEventListener('submit', handleFormSubmit)
}

const countriesDataInit = () => {
  countryList.forEach(country => {
    const countryOpt = document.createElement('option');
    countryOpt.value = country.toLowerCase();
    countryOpt.innerText = country;
    wd.breedCountry.appendChild(countryOpt);
  });
}

const setHideForm = () => wd.formPopup.classList.add('hidden');

const setShowForm = () => wd.formPopup.classList.remove('hidden');

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

  createBreed(breed);
  wd.newBreedForm.reset();
  setDefaultImage();
  alert('Cadastro realizado com sucesso!');
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
