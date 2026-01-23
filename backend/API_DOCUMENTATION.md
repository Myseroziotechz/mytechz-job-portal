# Job Portal Backend API Documentation

## Base URL
```
http://127.0.0.1:5010
```

## Authentication
All protected endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### 1. Register Candidate
**POST** `/auth/register`

**Request Body:**
```json
{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "password": "securepassword123",
    "confirm_password": "securepassword123",
    "gender": "male"
}
```

**Response (201):**
```json
{
    "success": true,
    "message": "Registration successful",
    "user": {
        "id": 1,
        "email": "john.doe@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "full_name": "John Doe"
    },
    "tokens": {
        "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    }
}
```

### 2. Login Candidate
**POST** `/auth/login`

**Request Body:**
```json
{
    "email": "john.doe@example.com",
    "password": "securepassword123"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Login successful",
    "user": {
        "id": 1,
        "email": "john.doe@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "full_name": "John Doe"
    },
    "tokens": {
        "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    }
}
```

### 3. Logout Candidate
**POST** `/auth/logout` 🔒

**Request Body:**
```json
{
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Logout successful"
}
```

---

## Profile Endpoints

### 4. Get Profile
**GET** `/auth/profile` 🔒

**Response (200):**
```json
{
    "success": true,
    "user": {
        "id": 1,
        "email": "john.doe@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "full_name": "John Doe",
        "phone": "+1234567890",
        "date_of_birth": "1990-01-01",
        "gender": "male",
        "address": "123 Main St",
        "city": "New York",
        "state": "NY",
        "pincode": "10001",
        "bio": "Software Developer with 5 years experience",
        "skills": "Python, Django, React, JavaScript",
        "skills_list": ["Python", "Django", "React", "JavaScript"],
        "experience": "5 years in web development",
        "education": "Bachelor's in Computer Science",
        "linkedin_url": "https://linkedin.com/in/johndoe",
        "github_url": "https://github.com/johndoe",
        "portfolio_url": "https://johndoe.dev",
        "resume_file_name": "john_doe_resume.pdf",
        "resume_file_path": "/media/resumes/john_doe_resume.pdf",
        "resume_uploaded_at": "2024-01-20T10:30:00Z",
        "created_at": "2024-01-20T09:00:00Z",
        "updated_at": "2024-01-20T10:30:00Z"
    }
}
```

### 5. Update Profile
**PUT** `/auth/profile/update` 🔒

**Request Body:**
```json
{
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "date_of_birth": "1990-01-01",
    "gender": "male",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "pincode": "10001",
    "bio": "Software Developer with 5 years experience",
    "skills": "Python, Django, React, JavaScript",
    "experience": "5 years in web development",
    "education": "Bachelor's in Computer Science",
    "linkedin_url": "https://linkedin.com/in/johndoe",
    "github_url": "https://github.com/johndoe",
    "portfolio_url": "https://johndoe.dev"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Profile updated successfully",
    "user": {
        // Updated user object
    }
}
```

### 6. Upload Resume
**POST** `/auth/profile/upload-resume` 🔒

**Request Body (multipart/form-data):**
```
resume_file: <file> (PDF, DOC, DOCX - max 5MB)
```

**Response (200):**
```json
{
    "success": true,
    "message": "Resume uploaded successfully",
    "resume": {
        "file_name": "john_doe_resume.pdf",
        "file_url": "http://127.0.0.1:5010/media/resumes/john_doe_resume.pdf",
        "uploaded_at": "2024-01-20T10:30:00Z"
    }
}
```

### 7. Get User Stats
**GET** `/auth/profile/stats` 🔒

**Response (200):**
```json
{
    "success": true,
    "stats": {
        "profile_completion": 85.5,
        "resume_uploaded": true,
        "skills_count": 4,
        "social_links_added": 3,
        "member_since": "January 2024"
    }
}
```

---

## Error Responses

### Validation Error (400)
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "email": ["This field is required."],
        "password": ["This field is required."]
    }
}
```

### Authentication Error (401)
```json
{
    "detail": "Given token not valid for any token type",
    "code": "token_not_valid",
    "messages": [
        {
            "token_class": "AccessToken",
            "token_type": "access",
            "message": "Token is invalid or expired"
        }
    ]
}
```

### Not Found (404)
```json
{
    "detail": "Not found."
}
```

---

## Frontend Integration Examples

### JavaScript/Axios Examples

#### Register User
```javascript
const registerUser = async (userData) => {
    try {
        const response = await axios.post('http://127.0.0.1:5010/auth/register', userData);
        
        // Store tokens
        localStorage.setItem('access_token', response.data.tokens.access);
        localStorage.setItem('refresh_token', response.data.tokens.refresh);
        
        return response.data;
    } catch (error) {
        console.error('Registration failed:', error.response.data);
        throw error;
    }
};
```

#### Login User
```javascript
const loginUser = async (email, password) => {
    try {
        const response = await axios.post('http://127.0.0.1:5010/auth/login', {
            email,
            password
        });
        
        // Store tokens
        localStorage.setItem('access_token', response.data.tokens.access);
        localStorage.setItem('refresh_token', response.data.tokens.refresh);
        
        return response.data;
    } catch (error) {
        console.error('Login failed:', error.response.data);
        throw error;
    }
};
```

#### Get Profile (with auth)
```javascript
const getProfile = async () => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://127.0.0.1:5010/auth/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Failed to get profile:', error.response.data);
        throw error;
    }
};
```

#### Upload Resume
```javascript
const uploadResume = async (file) => {
    try {
        const token = localStorage.getItem('access_token');
        const formData = new FormData();
        formData.append('resume_file', file);
        
        const response = await axios.post('http://127.0.0.1:5010/auth/profile/upload-resume', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Resume upload failed:', error.response.data);
        throw error;
    }
};
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(254) UNIQUE NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    phone VARCHAR(15),
    password VARCHAR(128) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    bio TEXT,
    skills TEXT,
    experience TEXT,
    education TEXT,
    linkedin_url VARCHAR(200),
    github_url VARCHAR(200),
    portfolio_url VARCHAR(200),
    resume_file_name VARCHAR(255),
    resume_file_path VARCHAR(100),
    resume_uploaded_at DATETIME,
    is_active BOOLEAN DEFAULT 1,
    is_staff BOOLEAN DEFAULT 0,
    is_superuser BOOLEAN DEFAULT 0,
    last_login DATETIME,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);
```

---

## Admin Panel
Access the Django admin panel at: `http://127.0.0.1:5010/admin/`

**Credentials:**
- Email: `admin@jobportal.com`
- Password: `admin123`