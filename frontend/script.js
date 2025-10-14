const API_BASE = 'http://localhost:8080/api/auth'

const form = document.getElementById('auth-form')
const toggleLink = document.getElementById('toggle-link')
const formTitle = document.getElementById('form-title')
const submitBtn = document.getElementById('submit-btn')
const emailInput = document.getElementById('email')
const logoutBtn = document.getElementById('logout-btn')
const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')
const togglePassword = document.getElementById('toggle-password')
const toggleMessage = document.getElementById('toggle-message')
const usernameError = document.getElementById('username-error')
const emailError = document.getElementById('email-error')
const passwordError = document.getElementById('password-error')

let isLogin = true

// ----------------- Helpers -----------------
function clearErrors() {
    usernameError.textContent = ''
    emailError.textContent = ''
    passwordError.textContent = ''
}

function clearTokens() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
}

function showLogout() {
    form.style.display = 'none'
    toggleLink.parentElement.style.display = 'none'
    logoutBtn.style.display = 'block'
}

function showLoginForm() {
    form.style.display = 'block'
    toggleLink.parentElement.style.display = 'block'
    logoutBtn.style.display = 'none'
}

// ----------------- Validation -----------------
function validateForm() {
    clearErrors()
    let valid = true

    const username = usernameInput.value.trim()
    if (!username) {
        usernameError.textContent = "Username must not be blank"
        valid = false
    } else if (username.length < 3 || username.length > 50) {
        usernameError.textContent = "Username must be between 3 and 50 characters"
        valid = false
    }

    if (!isLogin) {
        const email = emailInput.value.trim()
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email) {
            emailError.textContent = "Email must not be blank"
            valid = false
        } else if (!emailPattern.test(email)) {
            emailError.textContent = "Email must be valid"
            valid = false
        } else if (email.length > 100) {
            emailError.textContent = "Email must not exceed 100 characters"
            valid = false
        }
    }

    const password = passwordInput.value.trim()
    if (!password) {
        passwordError.textContent = "Password must not be blank"
        valid = false
    } else if (password.length < 8) {
        passwordError.textContent = "Password must be at least 8 characters"
        valid = false
    }

    return valid
}

// ----------------- Toggle Login/Register -----------------
toggleLink.addEventListener('click', (e) => {
    e.preventDefault()
    isLogin = !isLogin

    if (isLogin) {
        formTitle.textContent = 'Login'
        submitBtn.textContent = 'Login'
        emailInput.style.display = 'none'
    } else {
        formTitle.textContent = 'Register'
        submitBtn.textContent = 'Register'
        emailInput.style.display = 'block'
    }

    clearErrors()
    updateToggleText()
})

function updateToggleText() {
    if (isLogin) {
        toggleMessage.textContent = "Don't have an account?"
        toggleLink.textContent = "Register"
    } else {
        toggleMessage.textContent = "Already have an account?"
        toggleLink.textContent = "Login"
    }
}

// ----------------- Password show/hide -----------------
togglePassword.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text'
        togglePassword.textContent = '🙈'
    } else {
        passwordInput.type = 'password'
        togglePassword.textContent = '👁️'
    }
})

// ----------------- Form Submit -----------------
form.addEventListener('submit', async (e) => {
    e.preventDefault()
    clearErrors()

    if (!validateForm()) return

    const username = usernameInput.value.trim()
    const password = passwordInput.value.trim()
    let payload = { username, password }
    let url = isLogin ? `${API_BASE}/login` : `${API_BASE}/register`
    if (!isLogin) payload.email = emailInput.value.trim()

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        if (res.ok) {
            if (isLogin) {
                const data = await res.json()
                localStorage.setItem('accessToken', data.accessToken)
                localStorage.setItem('refreshToken', data.refreshToken)
                showLogout()
            } else {
                await res.text() // Registration message
                toggleLink.click()
            }
        } else {
            const errorData = await res.json().catch(() => null)
            passwordError.textContent = errorData?.detail || 'Invalid username or password'
        }
    } catch (err) {
        passwordError.textContent = 'Network error'
        console.error(err)
    }
})

// ----------------- Logout -----------------
logoutBtn.addEventListener('click', () => {
    clearTokens()
    showLoginForm()
})
