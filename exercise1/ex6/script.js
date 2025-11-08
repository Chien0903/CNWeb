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
  const priceFilter = document.getElementById("priceFilter");
  const sortSelect = document.getElementById("sortSelect");

  // === LOCAL STORAGE HELPERS ===
  const STORAGE_KEY = "products";

  function getStoredProducts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function setStoredProducts(products) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch {
      // ignore
    }
  }

  function createProductElement(product) {
    const { name, price, desc, image } = product;
    const article = document.createElement("article");
    article.className = "product-item";
    article.innerHTML = `
      <h3 class="product-name">${name}</h3>
      <p class="product-desc">${desc || "Không có mô tả."}</p>
      <p class="product-price">Giá: ${Number(price).toLocaleString()}₫</p>
      <img src="${
        image || "https://via.placeholder.com/200x200?text=No+Image"
      }" alt="${name}" onerror="this.src='https://via.placeholder.com/200x200?text=No+Image'">
      <button class="delete-btn" aria-label="Xóa sản phẩm">Xóa</button>
    `;
    return article;
  }

  function renderProducts(products) {
    const productList = document.getElementById("product-list");
    if (!productList) return;
    // Xóa tất cả items cũ nhưng giữ lại tiêu đề h2
    productList.querySelectorAll(".product-item").forEach((el) => el.remove());
    // Chèn lần lượt theo thứ tự trong mảng
    const header = productList.querySelector("h2");
    products.forEach((p) => {
      const el = createProductElement(p);
      if (header && header.nextSibling) {
        productList.insertBefore(el, header.nextSibling);
      } else {
        productList.appendChild(el);
      }
    });
  }

  // Lọc theo keyword + khoảng giá + sắp xếp
  function applyFiltersAndRender() {
    let products = getStoredProducts();
    const keyword = searchInput?.value.trim().toLowerCase() || "";

    // Lọc theo từ khóa
    if (keyword) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(keyword) ||
          (p.desc || "").toLowerCase().includes(keyword)
      );
    }

    // Lọc theo giá
    const pf = priceFilter?.value || "all";
    products = products.filter((p) => {
      const price = Number(p.price) || 0;
      if (pf === "lt100") return price < 100000;
      if (pf === "100-200") return price >= 100000 && price <= 200000;
      if (pf === ">200") return price > 200000;
      return true;
    });

    // Sắp xếp
    const sort = sortSelect?.value || "none";
    if (sort === "name-asc") {
      products.sort((a, b) =>
        a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
      );
    } else if (sort === "price-asc") {
      products.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sort === "price-desc") {
      products.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    }

    renderProducts(products);
  }

  function bootstrapStorageFromInitialDOM() {
    const items = Array.from(
      document.querySelectorAll("#product-list .product-item")
    );
    const products = items.map((it) => {
      const name = it.querySelector(".product-name")?.textContent?.trim() || "";
      const priceText = it.querySelector(".product-price")?.textContent || "0";
      const priceNum = Number(
        (priceText.match(/\d+[\d\.\,]*/)?.[0] || "0")
          .replaceAll(".", "")
          .replace(",", ".")
      );
      const desc = it.querySelector(".product-desc")?.textContent?.trim() || "";
      const image = it.querySelector("img")?.getAttribute("src") || "";
      return { name, price: isNaN(priceNum) ? 0 : priceNum, desc, image };
    });
    setStoredProducts(products);
  }

  // Khởi tạo dữ liệu: thử fetch từ products.json, fallback LocalStorage/HTML
  (async function initData() {
    try {
      const res = await fetch("./products.json", { cache: "no-store" });
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      if (Array.isArray(data) && data.length) {
        setStoredProducts(data);
        renderProducts(data);
        return;
      }
    } catch (_) {
      // Có thể do CORS khi mở file trực tiếp
    }
    const stored = getStoredProducts();
    if (stored.length) {
      renderProducts(stored);
    } else {
      bootstrapStorageFromInitialDOM();
      renderProducts(getStoredProducts());
    }
  })();

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
  // Hiệu ứng mở/đóng form với max-height động
  function openForm() {
    if (!form) return;
    // Bỏ display:none để có thể transition
    form.classList.remove("hidden");
    // Bật lớp show để tăng opacity theo CSS
    form.classList.add("show");
    // Đặt max-height theo nội dung thực tế để trượt mượt
    form.style.maxHeight = form.scrollHeight + "px";
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    const nameInput = document.getElementById("newName");
    if (nameInput) nameInput.focus();
  }

  function closeForm() {
    if (!form) return;
    // Thu gọn max-height về 0 để transition đóng
    form.style.maxHeight = "0";
    form.classList.remove("show");
    // Sau khi transition kết thúc, ẩn hẳn bằng hidden để layout gọn hơn
    const onEnd = () => {
      form.classList.add("hidden");
      form.removeEventListener("transitionend", onEnd);
    };
    form.addEventListener("transitionend", onEnd);
  }

  if (addBtn && form) {
    addBtn.addEventListener("click", openForm);
  } else {
    console.warn("Không tìm thấy addProductBtn hoặc addProductForm");
  }

  if (cancelBtn && form) {
    cancelBtn.addEventListener("click", () => {
      closeForm();
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

      // Cập nhật LocalStorage
      const products = getStoredProducts();
      products.unshift({ name, price: Number(price), desc, image });
      setStoredProducts(products);

      // Render lại danh sách từ LocalStorage theo các filter hiện tại
      applyFiltersAndRender();

      // Reset & ẩn form
      form.reset();
      closeForm();

      // Nếu đang có từ khóa tìm kiếm, lọc lại để đảm bảo đồng bộ
      // Áp lại filter nếu đang có từ khóa
      applyFiltersAndRender();

      showSuccessMessage("Đã thêm sản phẩm mới!");
    });
  } else {
    console.warn("Không tìm thấy addProductForm để gắn submit listener");
  }

  // Xóa sản phẩm (event delegation)
  document.getElementById("product-list")?.addEventListener("click", (ev) => {
    const el = ev.target;
    if (!(el instanceof Element)) return;
    if (!el.classList.contains("delete-btn")) return;
    const item = el.closest(".product-item");
    if (!item) return;
    const name = item.querySelector(".product-name")?.textContent?.trim() || "";
    if (!confirm(`Xóa sản phẩm: ${name}?`)) return;
    const products = getStoredProducts().filter((p) => p.name !== name);
    setStoredProducts(products);
    applyFiltersAndRender();
    showSuccessMessage("Đã xóa sản phẩm!");
  });

  // Lắng nghe thay đổi filter/sort
  priceFilter?.addEventListener("change", applyFiltersAndRender);
  sortSelect?.addEventListener("change", applyFiltersAndRender);
  searchBtn?.addEventListener("click", applyFiltersAndRender);
  searchInput?.addEventListener("input", applyFiltersAndRender);

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
