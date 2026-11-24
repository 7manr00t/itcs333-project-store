// login.js -> login, show the logged in user, and logout

let loginForm = document.getElementById('login-form');
let message = document.getElementById('message');
let who = document.getElementById('who');
let logoutBtn = document.getElementById('logout-btn');

// ask the server who is logged in now
async function checkUser() {
  let response = await apiFetch('/api/auth/me');
  if (response === null) {
    return;
  }

  if (response.status === 200) { //200=OK
    let user = await response.json();
    who.textContent = 'Logged in as ' + user.username;
    if (user.is_admin === 1) {
      who.textContent += ' (admin)';
    }
    logoutBtn.style.display = 'inline-block';
    loginForm.style.display = 'none';
  } else {
    who.textContent = 'You are not logged in.';
  }
}

// login form
loginForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  let username = document.getElementById('username').value.trim();
  let password = document.getElementById('password').value;

  if (username === '' || password === '') {
    message.textContent = 'Please enter username and password.';
    message.className = 'msg err';
    return;
  }

  try {
    let response = await apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, password: password })
    });

    if (response === null) {
      return;
    }

    if (response.status === 200) {
      message.textContent = 'Login successful!';
      message.className = 'msg ok';
      setTimeout(function () {
        window.location.href = '/catalog/index.html';
      }, 1000);
    } else {
      message.textContent = 'Wrong username or password.';
      message.className = 'msg err';
    }
  } catch (error) {
    message.textContent = 'Error: could not connect to the server.';
    message.className = 'msg err';
  }
});

// logout button
logoutBtn.addEventListener('click', async function () {
  await apiFetch('/api/auth/logout', { method: 'POST' });
  window.location.reload();
});

// run when the page opens
document.addEventListener('DOMContentLoaded', checkUser);