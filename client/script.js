const $form = $(".ui.form");
let map;

document.addEventListener("DOMContentLoaded", async () => {
  await initializeForm();
  // let layerGroup = L.layerGroup().addTo(map);
  // let marker;
  map = L.map("map", { doubleClickZoom: false, zoomControl: false })
  map.locate({
    setView: true
  });
L.tileLayer(`https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=76506c0cca54471c8ab044c3d9bb37cd`,

{useCache: true,
crossOrigin: true}).addTo(map);

  $form.removeClass("loading");
  navigator.geolocation.getCurrentPosition(setUserCoordinates);
  $form.on("submit", async function (e) {
    e.preventDefault();
    if ($form.form("is valid")) {
      document.querySelector("#submitBtn").classList.add("disabled");
      const userInput = $form.form("get values"); // get form values
      const mediaID = await getMediaID(); // get media id for post request
      let userID = await getUserID(userInput); // get user id for post request
      await addReport(mediaID, userID, userInput);
      resetForm();
      document.querySelector("#successMessage").style.display = "block";
      preserveInput(userInput);
    }
  });
});

function setUserCoordinates(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  document.querySelector("#position").value = `(${lat}, ${lon})`;
  // layerGroup.clearLayers();\
  // marker.remove;
  // marker = 
  map.locate({
    setView: true,
    maxZoom: 50
  });
  L.marker([lat, lon]).addTo(map);
  // map.setView([lat, lon], 46)
  // updateMarker(lat, lon)
}

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

async function getMediaURL() {
  let postID = uuidv4();
  let file = document.getElementById("hidden-new-file").files[0];
  let blob = file.slice(0, file.size, "image/jpeg");
  let formData = new FormData();
  formData.append(
    "hidden-new-file",
    new File([blob], `${postID}.jpeg`, { type: "image/jpeg" })
  );
  await fetch("/upload", {
    method: "POST",
    body: formData,
  }).then((res) => res.text());
  return `https://storage.googleapis.com/weedwarriors/${postID}.jpeg`;
}

async function getMediaID() {
  const query = `SELECT id FROM media WHERE id=(SELECT max(id) FROM media)`;
  const mediaFetch = await fetch(`/api/custom/${query}`);
  const media = await mediaFetch.json();
  const mediaID = media.length > 0 ? media[0].id + 1 : 1;
  const mediaURL = await getMediaURL();

  await fetch("/api/media", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: mediaID,
      url: mediaURL,
    }),
  })
    .then((res) => res.json())
    .then((json) => console.log(json));

  return mediaID;
}

async function getUserID(userInput) {
  const query = `SELECT id FROM users WHERE email = '${userInput.email}' AND first_name = '${userInput.first_name}' AND last_name = '${userInput.last_name}'`;
  const userFetch = await fetch(`/api/custom/${query}`);
  let user = await userFetch.json();
  let userID;

  if (user.length > 0) {
    userID = user[0].id;
  } else {
    const usersFetch = await fetch("api/users");
    const users = await usersFetch.json();
    userID = users.data ? users.data.length + 1 : 1;
    await addUser(userID, userInput);
  }
  return userID;
}

async function addUser(userID, userInput) {
  await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: userID,
      first_name: userInput.first_name,
      last_name: userInput.last_name,
      email: userInput.email,
    }),
  })
    .then((res) => res.json())
    .then((json) => console.log(json));
}

async function addReport(mediaID, userID, userInput) {
  await fetch("/api/reports", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timestamp: new Date().toISOString().slice(0, 19).replace("T", " "), // FIX TIMEZONE
      catalog_id: userInput.plant.split(",")[0],
      location: userInput.position,
      severity_id: Math.round(userInput.severity / 10),
      media_id: mediaID,
      comments: userInput.comments,
      user_id: userID,
    }),
  })
    .then((res) => res.json())
    .then((json) => console.log(json));
}

async function initializeForm() {
  // create lists of values for dropdowns
  let catalogData = JSON.parse(sessionStorage.getItem("catalogData"));
  if (!catalogData) {
    const catalogFetch = await fetch("/api/catalog");
    const catalog = await catalogFetch.json();
    catalogData = [];
    catalog.data.forEach((plant) => {
      catalogData.push({
        name: `${plant.common_name} [<em>${plant.latin_name}</em>]`,
        value: `${plant.id},${plant.latin_name},${plant.common_name}`,
      });
    });
    sessionStorage.setItem("catalogData", JSON.stringify(catalogData));
  }

  restoreInput(); // restore user information if exists

  // instantiate form elements
  $(".ui.plant").dropdown({
    fullTextSearch: true,
    placeholder: "Search plant",
    values: catalogData,
  });

  let severityData = [];
  Array.from([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]).forEach((level) => {
    severityData.push({
      name: `${level}%`,
      value: level,
    });
  });

  $(".ui.severity").dropdown({
    placeholder: "Select severity level",
    values: severityData,
  });

  // define form fields
  $(".ui.form").form({
    fields: {
      first_name: "empty",
      last_name: "empty",
      email: "email",
      position: "empty",
      plant: "empty",
      severity: "empty",
      file: "empty",
      comments: "minLength[0]", // make comments optional
    },
  });

  // listen for file upload to show path
  const fileUploadPath = document.querySelector("#uploadedFilePath");
  document.querySelector("#hidden-new-file").addEventListener("change", () => {
    fileUploadPath.innerHTML = $(".form")
      .form("get value", "file")
      .replace("C:\\fakepath\\", "");
  });
}

function resetForm() {
  $(".ui.form").form("clear");
  navigator.geolocation.getCurrentPosition(setUserCoordinates);
  document.querySelector("#uploadedFilePath").innerHTML = "";
  document.querySelector("#successMessage").style.display = "none";
  document.querySelector("#submitBtn").classList.remove("disabled");
}

function preserveInput(userInput) {
  localStorage.setItem("email", JSON.stringify(userInput.email));
  localStorage.setItem("first_name", JSON.stringify(userInput.first_name));
  localStorage.setItem("last_name", JSON.stringify(userInput.last_name));
  restoreInput();
  navigator.geolocation.getCurrentPosition(setUserCoordinates);
}

function restoreInput() {
  let email = JSON.parse(localStorage.getItem("email"));
  let first_name = JSON.parse(localStorage.getItem("first_name"));
  let last_name = JSON.parse(localStorage.getItem("last_name"));
  if (email && first_name && last_name) {
    $(".ui.form").form("set values", {
      first_name: first_name,
      last_name: last_name,
      email: email,
    });

    document.querySelectorAll(".saveInput").forEach((field) => {
      field.classList.add("disabled");
    });
    document.querySelector("#clearUserInfoBtn").style.display = "block";
    document.querySelector('#name-fields').style.display = "none";
    document
      .querySelector("#clearUserInfoBtn")
      .addEventListener("click", (e) => {
        clearInput();
      });
  }
}

function clearInput() {
  document.querySelector("#clearUserInfoBtn").style.display = "none";
  localStorage.clear();
  document.querySelector('#name-fields').style.display = "block";
  resetForm();
  document.querySelectorAll(".saveInput").forEach((field) => {
    field.classList.remove("disabled");
  });
}