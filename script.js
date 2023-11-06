let songData = null;

document.addEventListener("DOMContentLoaded", function () {
  fetch('songs.json')
    .then(response => response.json())
    .then(json => {
      songData = json;
      if (songData && songData.songs.length > 0) {

      setupSoundCloudPlayer(songData.songs[0]); // Setup player with the first song
      }
      populateGridAndFilters(); // Populate grid and filters
    });

  updateDateTime();
  setInterval(updateDateTime, 60000);
  fetchWeather();
});

// Make sure the songData is populated before calling this function
function setupSoundCloudPlayer(song) {
  const iframeElement = document.createElement("iframe");
  iframeElement.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(song.url)}`;
  iframeElement.width = "100%";
  iframeElement.height = "166";
  iframeElement.frameBorder = "no";
  iframeElement.scrolling = "no";
  iframeElement.allow = "autoplay";
  iframeElement.style.display = "block"; // Ensure it's visible

  const soundcloudPlayerContainer = document.getElementById("soundcloud-player");
  soundcloudPlayerContainer.innerHTML = ''; // Clear any existing content
  soundcloudPlayerContainer.appendChild(iframeElement);

  const widget = SC.Widget(iframeElement); // Initialize SoundCloud widget


  widget.bind(SC.Widget.Events.READY, function () {
    document.querySelector(".currently-playing").textContent = `NOW PLAYING: ${song.title}`;
  });

  widget.bind(SC.Widget.Events.PLAY, function () {
    widget.getCurrentSound(function (sound) {
      const currentlyPlayingElement = document.querySelector(".currently-playing");
      currentlyPlayingElement.textContent = `NOW PLAYING: ${sound.title}`;
      currentlyPlayingElement.classList.add('clickable');
      currentlyPlayingElement.onclick = function () {
        openPopup(sound.permalink_url);
      };
    });
  });

  const playButton = document.getElementById("playButton");
  const playIcon = playButton.querySelector(".play-icon");
  const stopIcon = playButton.querySelector(".stop-icon");

  playButton.addEventListener("click", () => {
    const isPlaying = playButton.getAttribute("data-playing") === "true";
    widget.toggle();
    if (isPlaying) {
      playIcon.style.display = "block";
      stopIcon.style.display = "none";
      playButton.setAttribute("data-playing", "false");
    } else {
      playIcon.style.display = "none";
      stopIcon.style.display = "block";
      playButton.setAttribute("data-playing", "true");
    }
  });
}
function openPopup(songUrl) {
  console.log('Attempting to open popup for URL:', songUrl);

  const songDetails = songData.songs.find(s => s.url === songUrl);

  if (!songDetails) {
    console.error("No details found for the song URL:", songUrl);
    return;
  }

  document.getElementById('songTitle').textContent = songDetails.title;
  document.getElementById('songAuthor').textContent = songDetails.author;
  document.getElementById('image1').src = songDetails.image1;
  document.getElementById('image2').src = songDetails.image2;

  const description1Element = document.getElementById('description1');
  const description2Element = document.getElementById('description2');

  description1Element.textContent = songDetails.description1 || "Description 1 not available";
  description2Element.textContent = songDetails.description2 || "Description 2 not available";

  document.getElementById('songPopup').style.display = 'block';
}


function closePopup() {
  document.getElementById('songPopup').style.display = 'none';
}





  function updateDateTime() {
    const now = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    document.getElementById("date").textContent = "Date: " + now.toLocaleDateString("en-US", options);
    document.getElementById("time").textContent = "Time: " + now.toLocaleTimeString("en-US");
  }
  function fetchWeather() {
    const apiKey = "fd31b6f4f5d9fcdeca9b39a97bacc424"; // Replace with your actual API key
    const city = "Providence, US";
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.main && typeof data.main.temp !== 'undefined') {
          const temp = (data.main.temp - 273.15).toFixed(1);
          document.getElementById("weather-data").textContent = `${temp}°C in ${city}`;
        } else {
          throw new Error('Temperature data is not available.');
        }
      })
      .catch(error => {
        console.error("There was a problem with fetching the weather data:", error);
      });
  }

// Filter and grid functionality
const filters = document.getElementById("filters");
const filtersInitialTop = filters.offsetTop;



const filterButtons = document.querySelectorAll(".filter-button");
const clearButton = document.querySelector(".clear-button");

function hideOtherFilters(clickedButton) {
  console.log('hideOtherFilters called'); // To confirm function is called

  const filterButtons = document.querySelectorAll(".filter-button");
  filterButtons.forEach((button) => {
    if (button !== clickedButton) {
      button.style.display = "none";
    }
  });
}

function showAllFilters() {
  console.log('showAllFilters called'); // To confirm function is called

  const filterButtons = document.querySelectorAll(".filter-button");
  filterButtons.forEach((button) => {
    button.style.display = "inline-block";
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!button.classList.contains("clear-button")) {
      hideOtherFilters(button);
    } else {
      showAllFilters();
    }
  });
});

clearButton.addEventListener("click", () => {
  filterGrid("All");
  showAllFilters();
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}





function createGridItem(data) {
  const gridItem = document.createElement("div");
  gridItem.classList.add("grid-item");
  gridItem.setAttribute("data-category", data.category);

  const link = document.createElement("a");
  link.target = "_blank";
  link.href = data.link;
  gridItem.appendChild(link);

  const img = document.createElement("img");
  img.src = `./assets/images/${data.image}`;
  link.appendChild(img);

  const overlay = document.createElement("div");
  overlay.classList.add("overlay");

  // Create a new div to hold the title and name/year
  const titleNameDiv = document.createElement("div");
  titleNameDiv.classList.add("title-name-container");

  // Create and append the title (h3 element)
  const title = document.createElement("h3");
  title.classList.add("grid-title");
  title.textContent = data.title;
  titleNameDiv.appendChild(title); // Append to the titleNameDiv instead of overlay

  // Create and append the name and year (p element)
  const nameYear = document.createElement("p");
  nameYear.classList.add("grid-name-year");
  nameYear.textContent = `${data.name} — ${data.year}`;
  titleNameDiv.appendChild(nameYear); // Append to the titleNameDiv instead of overlay

  // Now append the combined title and name/year div to the overlay
  overlay.appendChild(titleNameDiv);

  // Continue with the rest of the overlay content as before
  const description = document.createElement("p");
  description.classList.add("grid-description");
  description.textContent = data.description;
  overlay.appendChild(description);

  link.appendChild(overlay);

  return gridItem;
}


function filterGrid(category) {
  const gridItems = document.querySelectorAll(".grid-item");
  gridItems.forEach((item) => {
    const itemCategories = item.dataset.category
      .split(", ")
      .map((cat) => cat.trim());

    if (category === "All" || itemCategories.includes(category)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}
function populateGridAndFilters() {
  const url = "./info.json";
  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      const container = document.querySelector(".grid-container");
      const sheetData = json.Sheet1;

      shuffleArray(sheetData);

      sheetData.forEach((data) => {
        const gridItem = createGridItem(data);
        container.appendChild(gridItem);
      });

      const categories = [
        ...new Set(
          sheetData.flatMap((item) =>
            item.category.split(", ").map((category) => category.trim())
          )
        ),
      ];

      const filterContainer = document.getElementById("filters");

      // Create and append the clear button first
      const clearButton = document.createElement("button");
      clearButton.textContent = "Clear";
      clearButton.classList.add("filter-button", "clear-button");
      clearButton.style.display = "none"; // Initially hidden
      filterContainer.appendChild(clearButton);

      clearButton.addEventListener("click", function () {
        filterGrid("All");
        showAllFilters();
      });

      // Create filter buttons
      categories.forEach((category) => {
        const filterButton = document.createElement("button");
        filterButton.textContent = category;
        filterButton.classList.add("filter-button");
        filterButton.addEventListener("click", function () {
          hideOtherFilters(this, clearButton); // Also pass the clearButton
          filterGrid(category);
        });
        filterContainer.appendChild(filterButton);
      });
    });
}

function hideOtherFilters(clickedButton, clearButton) {
  // Hide all filter buttons except the clicked one
  const filterButtons = document.querySelectorAll(".filter-button");
  filterButtons.forEach((button) => {
    if (button !== clickedButton && button !== clearButton) {
      button.style.display = "none";
    }
  });
  clearButton.style.display = "inline-block"; // Show the clear button
}

function showAllFilters() {
  // Show all filter buttons and hide the clear button
  const filterButtons = document.querySelectorAll(".filter-button");
  filterButtons.forEach((button) => {
    button.style.display = "inline-block";
  });
  const clearButton = document.querySelector(".clear-button");
  clearButton.style.display = "none"; // Hide the clear button
}

function filterGrid(category) {
  const gridItems = document.querySelectorAll(".grid-item");
  gridItems.forEach((item) => {
    const itemCategories = item.dataset.category
      .split(", ")
      .map((cat) => cat.trim());

    if (category === "All" || itemCategories.includes(category)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}

function smoothScrollTo(element, duration) {
  var startingY = window.pageYOffset;
  var elementY = window.pageYOffset + element.getBoundingClientRect().top;
  var targetY = document.body.scrollHeight - elementY < window.innerHeight ? document.body.scrollHeight - window.innerHeight : elementY;
  var diff = targetY - startingY;
  var easing = function(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  };
  var start;

  if (!diff) return;

  // Bootstrap our animation - it will get called right before next frame shall be rendered.
  window.requestAnimationFrame(function step(timestamp) {
    if (!start) start = timestamp;
    // Elapsed milliseconds since start of scrolling.
    var time = timestamp - start;
    // Get percent of completion in range [0, 1].
    var percent = Math.min(time / duration, 1);
    // Apply the easing.
    // It can cause bad-looking slow frames in browser performance tool, so be careful.
    percent = easing(percent);

    window.scrollTo(0, startingY + diff * percent);

    // Proceed with animation as long as we wanted it to.
    if (time < duration) {
      window.requestAnimationFrame(step);
    }
  })
}

function highlightCitation(refId, citationId) {
  // Clear all previous highlights
  // document.querySelectorAll('.highlighted').forEach(function(element) {
  //   element.classList.remove('highlighted');
  // });

  // Highlight the reference in the text
  var refElement = document.getElementById(refId);
  if(refElement) {
    refElement.classList.add('highlighted');
  }

  // Scroll to and highlight the citation at the bottom
  var citationElement = document.getElementById(citationId);
  if(citationElement) {
    citationElement.classList.add('highlighted');
    // Increase the duration here for a slower scroll
    smoothScrollTo(citationElement, 1500); // Scrolls over num of mili seconds
  }
}


