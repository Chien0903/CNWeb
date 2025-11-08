// === TÌM KIẾM SẢN PHẨM ===
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// Hàm tìm kiếm sản phẩm
function searchProducts() {
  const keyword = searchInput.value.toLowerCase().trim();
  const products = document.querySelectorAll(".product-item");
  let foundCount = 0;

  products.forEach((item) => {
    const name = item.querySelector(".product-name").textContent.toLowerCase();
    const desc = item.querySelector(".product-desc").textContent.toLowerCase();

    // Tìm kiếm trong cả tên và mô tả
    if (name.includes(keyword) || desc.includes(keyword)) {
      item.style.display = "";
      foundCount++;
    } else {
      item.style.display = "none";
    }
  });

  // Hiển thị kết quả tìm kiếm
  showSearchResults(keyword, foundCount);
}

// Hiển thị kết quả tìm kiếm
function showSearchResults(keyword, count) {
  let resultMsg = document.getElementById("searchResult");
  if (!resultMsg) {
    resultMsg = document.createElement("p");
    resultMsg.id = "searchResult";
    resultMsg.style.textAlign = "center";
    resultMsg.style.margin = "10px 0";
    resultMsg.style.fontWeight = "bold";
    searchInput.parentNode.appendChild(resultMsg);
  }

  if (keyword === "") {
    resultMsg.textContent = "";
  } else if (count === 0) {
    resultMsg.textContent = `Không tìm thấy sản phẩm nào với từ khóa "${keyword}"`;
    resultMsg.style.color = "#e74c3c";
  } else {
    resultMsg.textContent = `Tìm thấy ${count} sản phẩm với từ khóa "${keyword}"`;
    resultMsg.style.color = "#27ae60";
  }
}

// Sự kiện click nút tìm kiếm
searchBtn.addEventListener("click", searchProducts);

// Tìm kiếm real-time khi gõ
searchInput.addEventListener("input", searchProducts);

// Cho phép tìm kiếm bằng cách nhấn Enter
searchInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    searchProducts();
  }
});

// === ẨN/HIỆN FORM THÊM SẢN PHẨM (trong cùng trang) ===
const addBtn = document.getElementById("addProductBtn");
const form = document.getElementById("addProductForm");
const cancelBtn = document.getElementById("cancelBtn");

addBtn.addEventListener("click", () => {
  form.classList.toggle("hidden");
  if (!form.classList.contains("hidden")) {
    const nameInput = document.getElementById("newName");
    if (nameInput) nameInput.focus();
  }
});

cancelBtn.addEventListener("click", () => {
  form.classList.add("hidden");
  form.reset();
  const error = document.getElementById("errorMsg");
  if (error) error.textContent = "";
});

function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("newName").value.trim();
  const price = document.getElementById("newPrice").value.trim();
  const desc = document.getElementById("newDesc").value.trim();
  const image = document.getElementById("newImage").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  // Validation chi tiết
  let errors = [];

  if (!name) {
    errors.push("Tên sản phẩm không được để trống");
  } else if (name.length < 3) {
    errors.push("Tên sản phẩm phải có ít nhất 3 ký tự");
  }

  if (!price) {
    errors.push("Giá sản phẩm không được để trống");
  } else if (isNaN(price) || Number(price) <= 0) {
    errors.push("Giá sản phẩm phải là số dương");
  } else if (Number(price) > 10000000) {
    errors.push("Giá sản phẩm không được vượt quá 10,000,000₫");
  }

  if (image && !isValidUrl(image)) {
    errors.push("URL ảnh không hợp lệ");
  }

  if (errors.length > 0) {
    errorMsg.innerHTML = errors.join("<br>");
    return;
  }

  errorMsg.textContent = "";

  // Tạo phần tử sản phẩm mới và thêm vào đầu danh sách
  const newItem = document.createElement("article");
  newItem.className = "product-item";
  newItem.innerHTML = `
    <h3 class="product-name">${name}</h3>
    <p class="product-desc">${desc || "Không có mô tả."}</p>
    <p class="product-price">Giá: ${Number(price).toLocaleString()}₫</p>
    <img src="${
      image || "https://via.placeholder.com/200x200?text=No+Image"
    }" alt="${name}" onerror="this.src='https://via.placeholder.com/200x200?text=No+Image'">
  `;

  const productList = document.getElementById("product-list");
  if (productList) {
    productList.prepend(newItem);
  }

  // Reset và ẩn form
  form.reset();
  form.classList.add("hidden");

  // Thông báo thành công
  showSuccessMessage("Sản phẩm đã được thêm thành công!");
}

// Hàm kiểm tra URL hợp lệ
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Hàm hiển thị thông báo thành công
function showSuccessMessage(message) {
  const successMsg = document.createElement("div");
  successMsg.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #27ae60;
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 1000;
    font-weight: bold;
  `;
  successMsg.textContent = message;
  document.body.appendChild(successMsg);

  // Tự động ẩn sau 3 giây
  setTimeout(() => {
    successMsg.remove();
  }, 3000);
}
