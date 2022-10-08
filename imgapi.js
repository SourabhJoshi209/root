const imageGallery = document.getElementById("image-gallery");
const searchInput = document.getElementById("search-input");
const searchForm = document.getElementById("search-form");
const moreBtn = document.getElementById("more");
const loader = document.getElementById("loader-container");
const errorMessage = document.getElementById("error-message");

const getDataFromAPI = async (API_ENDPOINT) => {
  showLoading();
  const response = await fetch(API_ENDPOINT, {
    method: "GET",
    headers: {
      Authorization: API_KEY,
      Accept: "application/json",
    },
  });
  const data = await response.json();
  return data;
};

const displayPhotosFromData = (data) => {
  // console.log(data);
  
  const objArr = data.data;
  console.log(objArr);
  objArr.forEach((pic) => {
    const newSingleImage = document.createElement("div");
    newSingleImage.classList.add("single-image");
    newSingleImage.classList.add("border");
    newSingleImage.innerHTML = `
      <div class="image-preview">
            <img src=${pic.images.downsized_medium.url} />
          </div>
          <div class="image-data">
            <a target="_blank" href=${pic.embed_url} class="author">By @${pic.username}</a>
            <a target="_blank" href=${pic.images.original.url}>Download</a>
          </div>
      `;
    imageGallery.appendChild(newSingleImage);
  });
  hideLoading();
};


const getCuratedPhotos = async () => {
  const data = await getDataFromAPI("https://api.giphy.com/v1/stickers/trending?api_key="+API_KEY+"&limit=40");
  console.log(data);
  displayPhotosFromData(data);
};

const getSearchedPhotos = async (e) => {
  e.preventDefault();
  const inputValue = searchInput.value.trim();
  const searchQuery = inputValue.split(" ").join("+");
  if (searchQuery === "") {
    return;
  }
  searchInput.value = "";
  searchInput.blur();
  imageGallery.innerHTML = "";
  const data = await getDataFromAPI(
    `https://api.giphy.com/v1/stickers/search?&api_key=${API_KEY}&limit=40&q=${searchQuery}`
  );
  //console.log("SearchedData",data);

  if (data.data.length === 0) {
    errorMessage.innerText = `We Couldn't Find Anything For "${inputValue}"`;
    moreBtn.style.display = "none";
    hideLoading();
    return;
  } else {
    errorMessage.innerText = "";
  }
  displayPhotosFromData(data);
};

const showLoading = () => {
  loader.classList.add("active");
};
const hideLoading = () => {
  loader.classList.remove("active");
};


// EVENT LISTENERS

searchForm.addEventListener("submit", getSearchedPhotos);


getCuratedPhotos();
