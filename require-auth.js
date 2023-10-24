document.addEventListener('DOMContentLoaded', () => silentAuthenticateToken());
document.getElementById('logout-button').addEventListener('click', () => logout());

// TODO currently requires main. Add import or remove dependency
