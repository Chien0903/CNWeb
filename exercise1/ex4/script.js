document.addEventListener("DOMContentLoaded", () => {
  // === TÌM KIẾM SẢN PHẨM ===
  function searchProducts() {
    const keyword = searchInput.value.toLowerCase().trim();
    const products = document.querySelectorAll(".product-item");
    let foundCount = 0;

    products.forEach((item) => {
      const name = item
        .querySelector(".product-name")
        .textContent.toLowerCase();
      const desc = item
        .querySelector(".product-desc")
        .textContent.toLowerCase();

      if (name.includes(keyword) || desc.includes(keyword)) {
        item.style.display = "";
        foundCount++;
      } else {
        item.style.display = "none";
      }
    });

    showSearchResults(keyword, foundCount);
  }

  function showSearchResults(keyword, count) {
    let resultMsg = document.getElementById("searchResult");
    if (!resultMsg) {
      resultMsg = document.createElement("p");
      resultMsg.id = "searchResult";
      resultMsg.style.textAlign = "center";
      resultMsg.style.marginTop = "10px";
      const searchSection = document.getElementById("search-section");
      searchSection.appendChild(resultMsg);
    }

    if (keyword === "") resultMsg.textContent = "";
    else if (count === 0) {
      resultMsg.textContent = `Không tìm thấy sản phẩm nào với từ khóa "${keyword}"`;
      resultMsg.style.color = "#e74c3c";
    } else {
      resultMsg.textContent = `Tìm thấy ${count} sản phẩm với từ khóa "${keyword}"`;
      resultMsg.style.color = "#27ae60";
    }
  }

  // === LẤY CÁC PHẦN TỬ SAU KHI DOM ĐÃ LOAD ===
  const addBtn = document.getElementById("addProductBtn");
  const form = document.getElementById("addProductForm");
  const cancelBtn = document.getElementById("cancelBtn");
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");

  // === TÌM KIẾM ===
  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", searchProducts);
    searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") searchProducts();
    });
    searchInput.addEventListener("input", searchProducts);
  } else {
    console.warn("Không tìm thấy searchBtn hoặc searchInput");
  }

  // === ẨN / HIỆN FORM THÊM SẢN PHẨM ===
  if (addBtn && form) {
    addBtn.addEventListener("click", () => {
      form.classList.toggle("hidden");
      if (!form.classList.contains("hidden")) {
        form.scrollIntoView({ behavior: "smooth", block: "start" });
        const nameInput = document.getElementById("newName");
        if (nameInput) nameInput.focus();
      }
    });
  } else {
    console.warn("Không tìm thấy addProductBtn hoặc addProductForm");
  }

  if (cancelBtn && form) {
    cancelBtn.addEventListener("click", () => {
      form.classList.add("hidden");
      form.reset();
      const error = document.getElementById("errorMsg");
      if (error) error.textContent = "";
    });
  }

  // === THÊM SẢN PHẨM MỚI ===
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("newName").value.trim();
      const price = document.getElementById("newPrice").value.trim();
      const desc = document.getElementById("newDesc").value.trim();
      const image = document.getElementById("newImage").value.trim();
      const errorMsg = document.getElementById("errorMsg");
      let errors = [];

      if (!name) errors.push("Tên sản phẩm không được để trống");
      if (!price || isNaN(price) || Number(price) <= 0)
        errors.push("Giá sản phẩm phải là số dương");
      if (desc && desc.length < 10)
        errors.push("Mô tả phải có ít nhất 10 ký tự");
      if (image && !isValidUrl(image)) errors.push("URL ảnh không hợp lệ");

      if (errors.length > 0) {
        errorMsg.innerHTML = errors.join("<br>");
        return;
      }

      errorMsg.textContent = "";

      // Tạo sản phẩm mới
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

      // Thêm ngay sau tiêu đề trong danh sách sản phẩm
      const productList = document.getElementById("product-list");
      if (productList) {
        const header = productList.querySelector("h2");
        if (header && header.nextSibling) {
          productList.insertBefore(newItem, header.nextSibling);
        } else {
          productList.appendChild(newItem);
        }
      }

      // Reset & ẩn form
      form.reset();
      form.classList.add("hidden");

      // Nếu đang có từ khóa tìm kiếm, lọc lại để đảm bảo đồng bộ
      if (searchInput && searchInput.value.trim() !== "") {
        searchProducts();
      }

      showSuccessMessage("Đã thêm sản phẩm mới!");
    });
  } else {
    console.warn("Không tìm thấy addProductForm để gắn submit listener");
  }

  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  function showSuccessMessage(message) {
    const msg = document.createElement("div");
    msg.textContent = message;
    msg.style.cssText = `
      position: fixed; top: 20px; right: 20px;
      background-color: #27ae60; color: #fff;
      padding: 10px 20px; border-radius: 5px;
      font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2500);
  }
});
