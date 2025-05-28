const searchInput = document.getElementById('search-input');
const suggestionsList = document.getElementById('suggestions-list');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
const modalBookCover = document.getElementById('modal-book-cover');
const modalBookTitle = document.getElementById('modal-book-title');
const modalBookAuthor = document.getElementById('modal-book-author');
const modalBookYear = document.getElementById('modal-book-year');
const modalBookDescription = document.getElementById('modal-book-description');
const addReadBtn = document.getElementById('add-read');
const addFavBtn = document.getElementById('add-fav');

const changePhotoBtn = document.getElementById('change-photo-btn');
const photoInput = document.getElementById('photo-input');
const profilePhoto = document.getElementById('profile-photo');
const changePasswordBtn = document.getElementById('change-password-btn');
const deleteAccountBtn = document.getElementById('delete-account-btn');
const passwordForm = document.getElementById('password-form');
const cancelPasswordBtn = document.getElementById('cancel-password');
const deleteModal = document.getElementById('delete-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const homeBtn = document.getElementById('home-btn');

const profileBtn = document.getElementById('profile-btn');
const logoutBtn = document.getElementById('logout-btn');
const readBooksBtn = document.getElementById('read-books-btn');
const favoritesBtn = document.getElementById('favorites-btn');
const homePageBtn = document.getElementById('home-page-btn');

const readBooksListDiv = document.getElementById('read-books-list');
const searchBox = document.querySelector('.search-box');
const mainTitle = document.querySelector('.main-content h1');

let selectedBook = null;

async function searchBooks(query) {
  if (!query) {
    suggestionsList.innerHTML = '';
    return;
  }
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5`);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      showSuggestions(data.items);
    } else {
      suggestionsList.innerHTML = '<li>Sonuç bulunamadı.</li>';
    }
  } catch (error) {
    suggestionsList.innerHTML = '<li>Hata oluştu. Lütfen tekrar deneyin.</li>';
  }
}

function showSuggestions(items) {
  suggestionsList.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('li');
    const title = item.volumeInfo.title || "Başlık yok";
    const authors = item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : "Yazar yok";
    li.textContent = `${title} - ${authors}`;
    li.addEventListener('click', () => openModal(item));
    suggestionsList.appendChild(li);
  });
}

function openModal(book) {
  selectedBook = book;
  const info = book.volumeInfo;

  modalBookCover.src = info.imageLinks ? info.imageLinks.thumbnail : 'https://via.placeholder.com/128x195?text=No+Image';
  modalBookTitle.textContent = info.title || "Bilgi yok";
  modalBookAuthor.textContent = info.authors ? info.authors.join(', ') : "Bilgi yok";
  modalBookYear.textContent = info.publishedDate ? info.publishedDate.slice(0, 4) : "Bilgi yok";
  modalBookDescription.textContent = info.description || "Açıklama yok.";

  modal.style.display = 'flex';
  suggestionsList.innerHTML = '';
  searchInput.value = '';
}

if (modalClose) {
  modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

if (modal) {
  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

// Toast mesajı gösterme fonksiyonu
function showToast(message) {
  const toastContainer = document.getElementById('toast-container');
  const toastMessage = document.getElementById('toast-message');
  const toastDurationBar = document.getElementById('toast-duration-bar');

  // Mesajı ayarla
  toastMessage.textContent = message;
  
  // Önceki animasyonu temizle
  toastContainer.classList.remove('show');
  toastDurationBar.style.animation = 'none';
  
  // Yeni mesajı göster
  requestAnimationFrame(() => {
    toastContainer.classList.add('show');
    toastDurationBar.style.animation = 'toast-duration 7s linear forwards';
  });

  // 7 saniye sonra mesajı kaldır
  setTimeout(() => {
    toastContainer.classList.remove('show');
  }, 7000);
}

if (addReadBtn) {
  addReadBtn.addEventListener('click', () => {
    if (!selectedBook) return;

    const currentUserEmail = localStorage.getItem('currentUserEmail');
    if (!currentUserEmail) {
      showToast("Kitap eklemek için giriş yapmalısınız.");
      return;
    }
    let readBooks = JSON.parse(localStorage.getItem(currentUserEmail + '_readBooks') || '[]');

    const isAlreadyAdded = readBooks.some(book => book.id === selectedBook.id);

    if (isAlreadyAdded) {
      showToast(`"${selectedBook.volumeInfo.title}" zaten okuduklarınızda.`);
    } else {
      readBooks.push({
        id: selectedBook.id,
        volumeInfo: {
          title: selectedBook.volumeInfo.title || "Başlık yok",
          authors: selectedBook.volumeInfo.authors || [],
          publishedDate: selectedBook.volumeInfo.publishedDate || "Bilgi yok",
          imageLinks: selectedBook.volumeInfo.imageLinks || {}
        }
      });

      localStorage.setItem(currentUserEmail + '_readBooks', JSON.stringify(readBooks));
      showToast(`"${selectedBook.volumeInfo.title}" başarıyla okuduklarınıza eklendi!`);
    }

    modal.style.display = 'none';
  });
}

if (addFavBtn) {
  addFavBtn.addEventListener('click', () => {
    if (!selectedBook) return;

    const currentUserEmail = localStorage.getItem('currentUserEmail');
    if (!currentUserEmail) {
      showToast("Kitap favorilere eklemek için giriş yapmalısınız.");
      return;
    }
    let favoriteBooks = JSON.parse(localStorage.getItem(currentUserEmail + '_favoriteBooks') || '[]');

    const isAlreadyAdded = favoriteBooks.some(book => book.id === selectedBook.id);

    if (isAlreadyAdded) {
      showToast(`"${selectedBook.volumeInfo.title}" zaten favorilerinizde.`);
    } else {
      favoriteBooks.push({
        id: selectedBook.id,
        volumeInfo: {
          title: selectedBook.volumeInfo.title || "Başlık yok",
          authors: selectedBook.volumeInfo.authors || [],
          publishedDate: selectedBook.volumeInfo.publishedDate || "Bilgi yok",
          imageLinks: selectedBook.volumeInfo.imageLinks || {}
        }
      });

      localStorage.setItem(currentUserEmail + '_favoriteBooks', JSON.stringify(favoriteBooks));
      showToast(`"${selectedBook.volumeInfo.title}" başarıyla favorilerinize eklendi!`);
    }

    modal.style.display = 'none';
  });
}

if (searchInput) {
  let debounceTimeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      searchBooks(searchInput.value.trim());
    }, 300);
  });
}

if (changePhotoBtn && photoInput) {
  changePhotoBtn.addEventListener('click', () => {
    photoInput.click();
  });

  photoInput.addEventListener('change', e => {
    const file = e.target.files[0];
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    if(file && currentUserEmail) {
      const reader = new FileReader();
      reader.onload = () => {
        profilePhoto.src = reader.result;
        localStorage.setItem(currentUserEmail + '_profilePhoto', reader.result);
        alert("Profil fotoğrafınız değiştirildi!");
      };
      reader.readAsDataURL(file);
    }
  });
}

if (changePasswordBtn && passwordForm) {
  changePasswordBtn.addEventListener('click', () => {
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    if (!currentUserEmail) {
      alert("Şifre değiştirmek için giriş yapmalısınız.");
      return;
    }
    passwordForm.classList.remove('hidden');
    passwordForm.scrollIntoView({behavior: 'smooth'});
  });

  if (cancelPasswordBtn) {
    cancelPasswordBtn.addEventListener('click', () => {
      passwordForm.reset();
      passwordForm.classList.add('hidden');
    });
  }

  passwordForm.addEventListener('submit', e => {
    e.preventDefault();

    const currentPass = document.getElementById('current-password').value.trim();
    const newPass = document.getElementById('new-password').value.trim();
    const confirmPass = document.getElementById('confirm-password').value.trim();

    const currentUserEmail = localStorage.getItem('currentUserEmail');
    if (!currentUserEmail) {
      alert("Şifre değiştirmek için giriş yapmalısınız.");
      return;
    }

    if(!currentPass || !newPass || !confirmPass) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    const savedPassword = localStorage.getItem(currentUserEmail + '_password');

    if(currentPass !== savedPassword) {
      alert("Mevcut şifreniz yanlış.");
      return;
    }

    if(newPass.length < 6) {
      alert("Yeni şifre en az 6 karakter olmalı.");
      return;
    }

    if(newPass !== confirmPass) {
      alert("Yeni şifre ve onayı uyuşmuyor.");
      return;
    }

    localStorage.setItem(currentUserEmail + '_password', newPass);

    alert("Şifreniz başarıyla değiştirildi!");
    passwordForm.reset();
    passwordForm.classList.add('hidden');
  });
}

if (deleteAccountBtn && deleteModal) {
  console.log('Delete account button and modal found:', { deleteAccountBtn, deleteModal });
  deleteModal.style.display = 'none';
  deleteAccountBtn.addEventListener('click', () => {
    console.log('Delete account button clicked');
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    console.log('Current user email:', currentUserEmail);
    if (!currentUserEmail) {
      alert("Hesap silmek için giriş yapmalısınız.");
      return;
    }
    deleteModal.style.display = 'flex';
    console.log('Delete modal shown');
  });
  if (cancelDeleteBtn) {
    console.log('Cancel delete button found:', cancelDeleteBtn);
    cancelDeleteBtn.addEventListener('click', () => {
      console.log('Cancel delete button clicked');
      deleteModal.style.display = 'none';
      console.log('Delete modal hidden');
    });
  }
  if (confirmDeleteBtn) {
    console.log('Confirm delete button found:', confirmDeleteBtn);
    confirmDeleteBtn.addEventListener('click', () => {
      console.log('Confirm delete button clicked');
      const currentUserEmail = localStorage.getItem('currentUserEmail');
      console.log('Current user email for deletion:', currentUserEmail);
      if (!currentUserEmail) {
        alert("Hesap silmek için giriş yapmalısınız.");
        return;
      }
      console.log('Removing user data from localStorage');
      localStorage.removeItem(currentUserEmail + '_password');
      localStorage.removeItem(currentUserEmail + '_profilePhoto');
      localStorage.removeItem(currentUserEmail + '_readBooks');
      localStorage.removeItem(currentUserEmail + '_favoriteBooks');
      localStorage.removeItem('currentUserEmail');
      console.log('User data removed from localStorage');
      window.location.href = '../login/index.html';
    });
  }
  window.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
      deleteModal.style.display = 'none';
    }
  });
}

if (profileBtn) {
  console.log('Profile button found:', profileBtn);
  profileBtn.addEventListener('click', () => {
    console.log('Profile button clicked');
    const anasayfa = document.getElementById('anasayfa');
    const profil = document.getElementById('profil');
    if (anasayfa) {
      anasayfa.classList.add('hidden');
      console.log('anasayfa hidden class added');
    }
    if (profil) {
      profil.classList.remove('hidden');
      console.log('profil hidden class removed');
    }
  });
}

if (homePageBtn) {
  console.log('Home page button found:', homePageBtn);
  homePageBtn.addEventListener('click', () => {
    console.log('Home page button clicked');
    const profil = document.getElementById('profil');
    const anasayfa = document.getElementById('anasayfa');
    if (profil) {
      profil.classList.add('hidden');
      console.log('profil hidden class added (from homePageBtn)');
    }
    if (anasayfa) {
      anasayfa.classList.remove('hidden');
      console.log('anasayfa hidden class removed (from homePageBtn)');
    }
    if (searchBox) searchBox.style.display = 'block';
    if (mainTitle) mainTitle.textContent = 'Kitap Arama';
  });
}

if (logoutBtn) {
  console.log('Logout button found:', logoutBtn);
  logoutBtn.addEventListener('click', () => {
    console.log('Logout button clicked');
    localStorage.removeItem('currentUserEmail');
    window.location.href = '../login/index.html';
  });
}

if (homeBtn) {
  console.log('Home button found (profile page):', homeBtn);
  homeBtn.addEventListener('click', () => {
    console.log('Home button clicked (profile page)');
    const profil = document.getElementById('profil');
    const anasayfa = document.getElementById('anasayfa');
    if (profil) {
      profil.classList.add('hidden');
      console.log('profil hidden class added (from homeBtn)');
    }
    if (anasayfa) {
      anasayfa.classList.remove('hidden');
      console.log('anasayfa hidden class removed (from homeBtn)');
    }
    if (searchBox) searchBox.style.display = 'block';
    if (mainTitle) mainTitle.textContent = 'Kitap Arama';
  });
}

if (readBooksBtn && readBooksListDiv && searchBox && mainTitle) {
  readBooksBtn.addEventListener('click', () => {
    document.getElementById('profil').classList.add('hidden');
    document.getElementById('anasayfa').classList.remove('hidden');
    searchBox.style.display = 'none';
    mainTitle.textContent = 'Okuduklarım';
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    if (!currentUserEmail) {
      readBooksListDiv.innerHTML = '<p>Okuduklarınızı görmek için giriş yapmalısınız.</p>';
      return;
    }
    let readBooks = JSON.parse(localStorage.getItem(currentUserEmail + '_readBooks') || '[]');
    let booksHtml = '';
    if (readBooks.length > 0) {
      booksHtml = readBooks.map(book => `
        <div class="read-book-item">
          <img src="${book.volumeInfo.imageLinks.thumbnail || 'https://via.placeholder.com/100x150?text=No+Image'}" alt="${book.volumeInfo.title}">
          <div class="book-info">
            <h3>${book.volumeInfo.title}</h3>
            <p>Yazar: ${book.volumeInfo.authors.join(', ' || 'Bilgi yok')}</p>
            <p>Basım Yılı: ${book.volumeInfo.publishedDate.slice(0, 4) || 'Bilgi yok'}</p>
          </div>
          <button class="remove-read-btn" data-book-id="${book.id}">Okuduklarımdan Kaldır</button>
        </div>
      `).join('');
    } else {
      booksHtml = '<p>Henüz okuduğunuz kitap yok.</p>';
    }
    readBooksListDiv.innerHTML = booksHtml;
  });
}

if (readBooksListDiv) {
  readBooksListDiv.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-read-btn')) {
      const bookIdToRemove = e.target.dataset.bookId;
      const currentUserEmail = localStorage.getItem('currentUserEmail');
      if (!currentUserEmail) return;
      
      // Kitabın başlığını bul
      const bookItem = e.target.closest('.read-book-item');
      const bookTitle = bookItem.querySelector('.book-info h3').textContent;
      
      let readBooks = JSON.parse(localStorage.getItem(currentUserEmail + '_readBooks') || '[]');
      readBooks = readBooks.filter(book => book.id !== bookIdToRemove);
      localStorage.setItem(currentUserEmail + '_readBooks', JSON.stringify(readBooks));
      
      // Kitabı listeden kaldır
      bookItem.remove();
      
      // Toast mesajını göster
      showToast(`"${bookTitle}" okuduklarınızdan kaldırıldı.`);
      
      // Eğer liste boşsa mesaj göster
      if (readBooks.length === 0) {
        readBooksListDiv.innerHTML = '<p>Henüz okuduğunuz kitap yok.</p>';
      }
    }
  });
}

if (favoritesBtn && readBooksListDiv && searchBox && mainTitle) {
  favoritesBtn.addEventListener('click', () => {
    document.getElementById('profil').classList.add('hidden');
    document.getElementById('anasayfa').classList.remove('hidden');
    searchBox.style.display = 'none';
    mainTitle.textContent = 'Favorilerim';
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    if (!currentUserEmail) {
      readBooksListDiv.innerHTML = '<p>Favorilerinizi görmek için giriş yapmalısınız.</p>';
      return;
    }
    let favoriteBooks = JSON.parse(localStorage.getItem(currentUserEmail + '_favoriteBooks') || '[]');
    let booksHtml = '';
    if (favoriteBooks.length > 0) {
      booksHtml = favoriteBooks.map(book => `
        <div class="read-book-item">
          <img src="${book.volumeInfo.imageLinks.thumbnail || 'https://via.placeholder.com/100x150?text=No+Image'}" alt="${book.volumeInfo.title}">
          <div class="book-info">
            <h3>${book.volumeInfo.title}</h3>
            <p>Yazar: ${book.volumeInfo.authors.join(', ' || 'Bilgi yok')}</p>
            <p>Basım Yılı: ${book.volumeInfo.publishedDate.slice(0, 4) || 'Bilgi yok'}</p>
          </div>
          <button class="remove-fav-btn" data-book-id="${book.id}">Favorilerden Kaldır</button>
        </div>
      `).join('');
    } else {
      booksHtml = '<p>Henüz favori kitabınız yok.</p>';
    }
    readBooksListDiv.innerHTML = booksHtml;
  });
}

if (readBooksListDiv) {
  readBooksListDiv.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-fav-btn')) {
      const bookIdToRemove = e.target.dataset.bookId;
      const currentUserEmail = localStorage.getItem('currentUserEmail');
      if (!currentUserEmail) return;
      
      // Kitabın başlığını bul
      const bookItem = e.target.closest('.read-book-item');
      const bookTitle = bookItem.querySelector('.book-info h3').textContent;
      
      let favoriteBooks = JSON.parse(localStorage.getItem(currentUserEmail + '_favoriteBooks') || '[]');
      favoriteBooks = favoriteBooks.filter(book => book.id !== bookIdToRemove);
      localStorage.setItem(currentUserEmail + '_favoriteBooks', JSON.stringify(favoriteBooks));
      
      // Kitabı listeden kaldır
      bookItem.remove();
      
      // Toast mesajını göster
      showToast(`"${bookTitle}" favorilerinizden kaldırıldı.`);
      
      // Eğer liste boşsa mesaj göster
      if (favoriteBooks.length === 0) {
        readBooksListDiv.innerHTML = '<p>Henüz favori kitabınız yok.</p>';
      }
    }
  });
}

window.addEventListener('DOMContentLoaded', function() {
  const currentUserEmail = localStorage.getItem('currentUserEmail');
  if (currentUserEmail) {
    const savedPhoto = localStorage.getItem(currentUserEmail + '_profilePhoto');
    if (savedPhoto) {
      if (profilePhoto) profilePhoto.src = savedPhoto;
      const sidebarPhoto = document.getElementById('sidebar-profile-pic');
      if (sidebarPhoto) sidebarPhoto.src = savedPhoto;
    }
  }
});