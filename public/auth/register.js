// we send the register form to the server

let registerForm = document.getElementById('register-form');
let message = document.getElementById('message');

registerForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  let username = document.getElementById('username').value.trim();
  let password = document.getElementById('password').value;
  let confirm = document.getElementById('confirm').value;

  // check the inputs first
  if (username === '' || password === '') {
    message.textContent = 'Please fill in all fields.';
    message.className = 'msg err';
    return;
  }
  if (password.length < 6) {
    message.textContent = 'Password must be at least 6 characters.';
    message.className = 'msg err';
    return;
  }
  if (password !== confirm) {
    message.textContent = 'Passwords do not match.';
    message.className = 'msg err';
    return;
  }

  try {
    let response = await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, password: password })
    });

    if (response === null) {
      return;
    }

    if (response.status === 201) {
      message.textContent = 'Account created! Going to login...';
      message.className = 'msg ok';
      setTimeout(function () {
        window.location.href = '/auth/login.html';
      }, 1000);
    } else if (response.status === 409) {
      message.textContent = 'This username is already taken.';
      message.className = 'msg err';
    } else {
      message.textContent = 'Something is wrong in the form.';
      message.className = 'msg err';
    }
  } catch (error) {
    message.textContent = 'Error: could not connect to the server.';
    message.className = 'msg err';
  }
});