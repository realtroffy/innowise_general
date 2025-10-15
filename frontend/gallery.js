const API_BASE = "http://localhost:8080/api/images";
const gallery = document.getElementById("gallery");
const loading = document.getElementById("loading");
const logoutBtn = document.getElementById("logout-btn");

const accessToken = localStorage.getItem("accessToken");

if (!accessToken) {
  window.location.href = "index.html";
}

let page = 0;
let isLoading = false;
let hasMore = true;

async function fetchImages() {
  if (isLoading || !hasMore) return;
  isLoading = true;
  loading.style.display = "block";

  try {
    const res = await fetch(`${API_BASE}?page=${page}&size=10`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.status === 401) {
      // токен недействителен
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "index.html";
      return;
    }

    if (!res.ok) throw new Error("Failed to load images");

    const data = await res.json();
    renderImages(data.content);
    hasMore = !data.last;
    page++;
  } catch (err) {
    console.error(err);
  } finally {
    isLoading = false;
    loading.style.display = "none";
  }
}

function renderImages(images) {
  images.forEach((img) => {
    const div = document.createElement("div");
    div.classList.add("image-card");
    div.innerHTML = `
            <img src="${img.url}" alt="${img.description}">
            <p>${img.description || "No description"}</p>
        `;
    gallery.appendChild(div);
  });
}

window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    fetchImages();
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "index.html";
});

fetchImages();
