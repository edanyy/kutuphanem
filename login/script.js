let isLoginMode = true;
const authContainer = document.getElementById('auth-container');
const forgotContainer = document.getElementById('forgot-container');
const verifyContainer = document.getElementById('verify-container');
const resetContainer = document.getElementById('reset-container');

const formTitle = document.getElementById('form-title');
const authForm = document.getElementById('auth-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submit-btn');
const toggleText = document.getElementById('toggle-text');

const forgotBtn = document.getElementById('forgot-btn');
const forgotForm = document.getElementById('forgot-form');
const forgotEmailInput = document.getElementById('forgot-email');
const forgotCloseBtn = document.getElementById('forgot-close');

const verifyForm = document.getElementById('verify-form');
const verifyCodeInput = document.getElementById('verify-code');
const verifyCloseBtn = document.getElementById('verify-close');

const resendCodeBtn = document.getElementById('resend-code-btn');

const resetForm = document.getElementById('reset-form');
const resetPasswordInput = document.getElementById('reset-password');
const resetCloseBtn = document.getElementById('reset-close');

const messageBox = document.getElementById('message-box');

let generatedCode = '';
let currentEmailForReset = '';
let resendTimer = null;
let resendTimeLeft = 45;

function showMessage(msg, duration = 3000, type = 'success') {
  messageBox.textContent = msg;
  messageBox.className = `message-box ${type}`;
  messageBox.classList.remove('hidden');

  setTimeout(() => {
    messageBox.classList.add('hidden');
  }, duration);
}

function toggleMode() {
  isLoginMode = !isLoginMode;
  if (isLoginMode) {
    formTitle.textContent = 'Giriş Yap';
    submitBtn.textContent = 'Giriş Yap';
    toggleText.innerHTML = 'Kayıtlı değil misin? <button id="toggle-btn" class="link-btn">Kayıt Ol</button>';
  } else {
    formTitle.textContent = 'Kayıt Ol';
    submitBtn.textContent = 'Kayıt Ol';
    toggleText.innerHTML = 'Zaten kayıtlı mısın? <button id="toggle-btn" class="link-btn">Giriş Yap</button>';
  }

  const toggleBtnNew = document.getElementById('toggle-btn');
  toggleBtnNew.addEventListener('click', toggleMode);

  authForm.reset();
}

document.getElementById('toggle-btn').addEventListener('click', toggleMode);

authForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!validateEmail(email)) {
    showMessage('Lütfen geçerli bir e-posta adresi girin.', 4000, 'error');
    return;
  }

  if (password.length < 6) {
    showMessage('Şifre en az 6 karakter olmalı.', 4000, 'error');
    return;
  }

  if (isLoginMode) {
    const savedPassword = localStorage.getItem(email + '_password');

    if (savedPassword === null) {
      showMessage('Böyle bir hesap yok!', 3500, 'error');
    } else if (password === savedPassword) {
      localStorage.setItem('currentUserEmail', email);
      window.location.href = '../application/application.html';
    } else {
      showMessage('E-posta veya şifre yanlış!', 3500, 'error');
    }
    authForm.reset();
  } else {
    const existingPassword = localStorage.getItem(email + '_password');
    if (existingPassword !== null) {
      showMessage('Bu e-posta adresi zaten kayıtlı!', 3500, 'error');
      return;
    }

    localStorage.setItem(email + '_password', password);
    localStorage.setItem(email + '_readBooks', JSON.stringify([]));
    localStorage.setItem(email + '_favoriteBooks', JSON.stringify([]));

    showMessage(`Kayıt başarılı: ${email}`, 3500, 'success');
    authForm.reset();
    toggleMode();
  }
});

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

forgotBtn.addEventListener('click', () => {
  forgotEmailInput.value = '';
  forgotContainer.classList.remove('hidden');
});

forgotCloseBtn.addEventListener('click', () => {
  forgotContainer.classList.add('hidden');
});

forgotForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const forgotEmail = forgotEmailInput.value.trim();

  if (!validateEmail(forgotEmail)) {
    showMessage('Lütfen geçerli e-posta girin.', 4000, 'error');
    return;
  }

  currentEmailForReset = forgotEmail;
  forgotContainer.classList.add('hidden');
  openVerifyModal();
  sendVerificationCode();
});

function openVerifyModal() {
  verifyCodeInput.value = '';
  resendCodeBtn.disabled = true;
  resendCodeBtn.textContent = `Kodu Tekrar Gönder (${resendTimeLeft})`;
  verifyContainer.classList.remove('hidden');
  startResendTimer();
}

verifyCloseBtn.addEventListener('click', () => {
  verifyContainer.classList.add('hidden');
  resetResendTimer();
});

function sendVerificationCode() {
  generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
  console.log('Gönderilen doğrulama kodu:', generatedCode);
  showMessage(`Doğrulama kodunuz: ${generatedCode}`, 5000, 'info');
  startResendTimer();
}

verifyForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const inputCode = verifyCodeInput.value.trim();

  if (inputCode.length !== 6) {
    showMessage('Lütfen 6 haneli kodu girin.', 4000, 'error');
    return;
  }

  if (inputCode !== generatedCode) {
    showMessage('Kod hatalı, lütfen tekrar deneyin.', 4000, 'error');
    return;
  }

  verifyContainer.classList.add('hidden');
  openResetModal();
});

function openResetModal() {
  resetPasswordInput.value = '';
  resetContainer.classList.remove('hidden');
}

resetCloseBtn.addEventListener('click', () => {
  resetContainer.classList.add('hidden');
});

resetForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const newPassword = resetPasswordInput.value.trim();

  if (newPassword.length < 6) {
    showMessage('Şifre en az 6 karakter olmalı.', 4000, 'error');
    return;
  }

  localStorage.setItem(currentEmailForReset + '_password', newPassword);
  showMessage('Şifreniz başarıyla güncellendi!', 4000, 'success');
  resetContainer.classList.add('hidden');
});

function startResendTimer() {
  resendTimeLeft = 45;
  resendCodeBtn.disabled = true;
  resendCodeBtn.textContent = `Kodu Tekrar Gönder (${resendTimeLeft})`;

  if (resendTimer) clearInterval(resendTimer);

  resendTimer = setInterval(() => {
    resendTimeLeft--;
    resendCodeBtn.textContent = `Kodu Tekrar Gönder (${resendTimeLeft})`;

    if (resendTimeLeft <= 0) {
      clearInterval(resendTimer);
      resendCodeBtn.textContent = 'Kodu Tekrar Gönder';
      resendCodeBtn.disabled = false;
    }
  }, 1000);
}

resetResendTimer = () => {
  if (resendTimer) clearInterval(resendTimer);
  resendCodeBtn.textContent = 'Kodu Tekrar Gönder';
  resendCodeBtn.disabled = false;
};

resendCodeBtn.addEventListener('click', () => {
  sendVerificationCode();
});

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            errorMessage.textContent = 'Lütfen kullanıcı adı ve şifre giriniz.';
            errorMessage.style.display = 'block';
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = '../application/application.html';
        } else {
            errorMessage.textContent = 'Kullanıcı adı veya şifre hatalı.';
            errorMessage.style.display = 'block';
        }
    });

    usernameInput.addEventListener('input', function() {
        errorMessage.style.display = 'none';
    });

    passwordInput.addEventListener('input', function() {
        errorMessage.style.display = 'none';
    });
});
