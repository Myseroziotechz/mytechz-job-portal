# 🚀 MytechZ Job Portal - Complete Backend System

## ✅ SYSTEM OVERVIEW

**Complete Django REST API Backend for Job Portal (Candidate Side)**

### 🛠️ Technology Stack
- **Django 4.2.7** - Web framework
- **Django REST Framework 3.14.0** - API framework
- **JWT Authentication** - Token-based auth
- **SQLite Database** - Local development database
- **CORS Headers** - Frontend integration
- **Custom User Model** - Extended user functionality

---

## 📁 PROJECT STRUCTURE

```
backend/
├── job_portal/                 # Django project
│   ├── settings.py            # Configuration
│   ├── urls.py                # Main URL routing
│   └── wsgi.py                # WSGI application
├── authentication/            # User management app
│   ├── models.py              # Custom User model
│   ├── serializers.py         # API serializers
│   ├── views.py               # API endpoints
│   ├── urls.py                # App URL routing
│   └── admin.py               # Admin configuration
├── media/                     # User uploads (resumes)
├── db.sqlite3                 # SQLite database
├── requirements.txt           # Python dependencies
├── .env                       # Environment variables
├── start_server.bat           # Backend startup script
└── API_DOCUMENTATION.md       # Complete API docs
```

---

## 🗄️ DATABASE SCHEMA

### Users Table (Complete)
```sql
- id (Primary Key)
- email (unique) 
- first_name, last_name
- phone
- password_hash
- is_active, created_at, updated_at

PERSONAL INFO:
- date_of_birth, gender
- address, city, state, pincode
- bio

PROFESSIONAL INFO:
- skills, experience, education

SOCIAL LINKS:
- linkedin_url, github_url, portfolio_url

RESUME:
- resume_file_name, resume_file_path
- resume_uploaded_at
```

---

## 🔗 API ENDPOINTS

### Authentication
- `POST /auth/register` - Register candidate
- `POST /auth/login` - Login candidate  
- `POST /auth/logout` - Logout candidate

### Profile Management
- `GET /auth/profile` - Get profile
- `PUT /auth/profile/update` - Update profile
- `POST /auth/profile/upload-resume` - Upload resume
- `GET /auth/profile/stats` - Get user statistics

### Admin Panel
- `/admin/` - Django admin interface

---

## 🚀 QUICK START

### 1. Start Backend Only
```bash
cd backend
start_server.bat
```

### 2. Start Full Stack Application
```bash
start_full_app.bat
```

### 3. Access Points
- **Backend API**: http://127.0.0.1:5010/
- **Frontend**: http://localhost:5173/
- **Admin Panel**: http://127.0.0.1:5010/admin/

### 4. Admin Credentials
- **Email**: admin@jobportal.com
- **Password**: admin123

---

## 🔐 SECURITY FEATURES

✅ **JWT Authentication** - Secure token-based auth  
✅ **Password Hashing** - Django's built-in bcrypt  
✅ **CORS Protection** - Configured for frontend  
✅ **Input Validation** - Comprehensive validation  
✅ **File Upload Security** - Resume upload restrictions  
✅ **Token Blacklisting** - Secure logout  

---

## 📋 FRONTEND INTEGRATION

### API Base URL
```javascript
const API_BASE_URL = 'http://127.0.0.1:5010';
```

### Authentication Headers
```javascript
headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
}
```

### Example API Calls
```javascript
// Register
POST /auth/register
{
    "first_name": "John",
    "last_name": "Doe", 
    "email": "john@example.com",
    "phone": "+1234567890",
    "password": "secure123",
    "confirm_password": "secure123",
    "gender": "male"
}

// Login
POST /auth/login
{
    "email": "john@example.com",
    "password": "secure123"
}

// Get Profile (with JWT token)
GET /auth/profile
Authorization: Bearer <access_token>

// Update Profile
PUT /auth/profile/update
{
    "bio": "Software Developer",
    "skills": "Python, Django, React",
    "linkedin_url": "https://linkedin.com/in/johndoe"
}

// Upload Resume
POST /auth/profile/upload-resume
Content-Type: multipart/form-data
resume_file: <file>
```

---

## 🎯 FEATURES IMPLEMENTED

### ✅ Authentication System
- Email-based registration/login
- JWT token generation
- Secure password hashing
- Token refresh & blacklisting

### ✅ Profile Management
- Complete user profile CRUD
- Personal information management
- Professional details
- Social links integration

### ✅ Resume Upload
- File upload with validation
- Supported formats: PDF, DOC, DOCX
- File size limit: 5MB
- Secure file storage

### ✅ API Integration
- RESTful API design
- JSON responses
- Error handling
- CORS configuration

### ✅ Admin Interface
- Django admin panel
- User management
- Data visualization
- Search and filtering

---

## 🔧 DEVELOPMENT

### Environment Variables (.env)
```
SECRET_KEY=django-insecure-job-portal-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Create Superuser
```bash
python create_superuser.py
```

---

## 📊 TESTING

### Test Registration
```bash
curl -X POST http://127.0.0.1:5010/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "password": "testpass123",
    "confirm_password": "testpass123"
  }'
```

### Test Login
```bash
curl -X POST http://127.0.0.1:5010/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

---

## 🎉 SUCCESS METRICS

✅ **Complete Backend System** - Fully functional Django API  
✅ **JWT Authentication** - Secure token-based auth  
✅ **Custom User Model** - Extended with all required fields  
✅ **File Upload System** - Resume upload functionality  
✅ **Admin Interface** - Full admin panel access  
✅ **API Documentation** - Complete endpoint documentation  
✅ **Frontend Integration** - Ready for React frontend  
✅ **Production Ready** - Scalable architecture  

---

## 📞 SUPPORT

For any issues or questions:
1. Check `API_DOCUMENTATION.md` for detailed API specs
2. Review Django admin panel for data management
3. Check server logs for debugging
4. Verify CORS settings for frontend integration

**Backend is now fully operational and ready for frontend integration!** 🚀