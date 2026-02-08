# 🔄 Quick Guide: Switch Render to New GitHub

## ⚡ Fast Method (5 Minutes)

### Step 1: Open Render Dashboard
```
https://dashboard.render.com
```

### Step 2: Select Your Service
- Click on your backend service (mytechz-job-portal)

### Step 3: Go to Settings
- Click "Settings" tab at the top

### Step 4: Disconnect Old Repository
1. Scroll to "Repository" section
2. Click **"Disconnect Repository"**
3. Confirm

### Step 5: Connect New Repository
1. Click **"Connect Repository"**
2. GitHub login will open
3. Login with: **myseroziotechz@gmail.com**
4. Click "Authorize Render"
5. Select: **Myseroziotechz/mytechz-job-portal**
6. Click "Connect"

### Step 6: Verify Settings
Check these are correct:
- ✅ Branch: `main`
- ✅ Root Directory: `backend`
- ✅ Build Command: `pip install -r requirements.txt`
- ✅ Start Command: `gunicorn job_portal.wsgi:application`

### Step 7: Deploy
1. Click "Save Changes"
2. Go to "Manual Deploy"
3. Click "Deploy latest commit"
4. Wait 5-10 minutes

### ✅ Done!

---

## 🎯 Visual Flow

```
Old Setup:
GitHub (siva-dataworker) → Render → Backend URL
              ❌

New Setup:
GitHub (Myseroziotechz) → Render → Backend URL
              ✅
```

---

## 🔐 If GitHub Login Issues

### Option 1: Revoke Access
1. Go to: https://github.com/settings/applications
2. Find "Render"
3. Click "Revoke"
4. Try connecting again

### Option 2: Use Incognito
1. Open incognito/private window
2. Go to Render
3. Connect repository
4. Login with new account

---

## 📱 Also Update Netlify

Same process for frontend:

1. Go to: https://app.netlify.com
2. Select your site
3. Site settings → Build & deploy
4. Link to different repository
5. Select: Myseroziotechz/mytechz-job-portal
6. Base directory: `client`
7. Build command: `npm run build`
8. Publish directory: `client/dist`
9. Save and deploy

---

## ✅ Verification

After switching, check:

**Render:**
- [ ] Shows new repository name
- [ ] Latest commit visible
- [ ] Deployment successful
- [ ] Backend URL works

**Netlify:**
- [ ] Shows new repository
- [ ] Latest deploy successful
- [ ] Frontend loads
- [ ] Can connect to backend

---

## 🆘 Common Issues

### Issue: Can't see new repository
**Fix:** Make sure you're logged into GitHub with myseroziotechz@gmail.com

### Issue: Deployment fails
**Fix:** Check environment variables are still set

### Issue: Old account still showing
**Fix:** Clear browser cookies, logout, login again

---

## 📞 Need Help?

The process is simple:
1. **Disconnect** old repo
2. **Connect** new repo  
3. **Deploy**
4. **Test**

That's it! 🎉

---

## 🌐 Your New URLs

**GitHub:**
```
https://github.com/Myseroziotechz/mytechz-job-portal
```

**Render Backend:**
```
https://your-service.onrender.com
(URL stays the same)
```

**Netlify Frontend:**
```
https://cheery-malasada-331cc2.netlify.app
```

---

**Time Required:** 5-10 minutes
**Difficulty:** Easy
**Risk:** Low (can always reconnect old repo)

Good luck! 🚀
