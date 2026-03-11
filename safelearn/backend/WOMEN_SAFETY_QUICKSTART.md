# 🛡️ Women Safety Features - Quick Start

**Fast Setup Guide (5 Minutes)**

---

## Step 1: Initialize Emergency Contacts Database

```bash
cd safelearn/backend
python emergency_contacts_seed.py
```

**Expected Output:**
```
🌱 Starting emergency contacts seed process...
✓ Database initialized
  ✓ Added: National Emergency Number (112)
  ✓ Added: Women Helpline (1091)
  ✓ Added: Ambulance Service (108)
  ✓ Added: Police Helpline (100)
  ✓ Added: Childline (1098)
  ✓ Added: Suicide Prevention Hotline
✅ Added 6 emergency contacts
✅ Added 6 safety tips
🎉 Seed process completed successfully!
```

---

## Step 2: Start Backend Server

```bash
python main.py
```

**Output:**
```
✅ SafeLearn Backend Started
📁 Upload directory: uploads
🗄️  Database initialized
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

## Step 3: View API Documentation

Open in browser: **http://localhost:8000/docs**

---

## Step 4: Test Emergency Features

### Get Default Emergency Numbers

```bash
curl http://localhost:8000/default-emergency-contacts
```

### Get All Safety Tips

```bash
curl "http://localhost:8000/safety-tips"
```

### Get Safety Tips for Specific Category

```bash
curl "http://localhost:8000/safety-tips?category=Travel"
```

---

## 📞 Critical Numbers Available

After running the seed script:

| Number | Service | Category |
|--------|---------|----------|
| **112** | National Emergency | Police/Ambulance/Fire |
| **1091** | Women Helpline | Women Support |
| **108** | Ambulance | Medical |
| **100** | Police | Law Enforcement |
| **1098** | Childline | Child Support |
| **9152987821** | Suicide Prevention | Mental Health |

---

## ✅ Verification Checklist

- [ ] `emergency_contacts_seed.py` ran successfully
- [ ] Default contacts added to database (6 contacts)
- [ ] Safety tips added to database (6 tips)
- [ ] Backend running on port 8000
- [ ] API docs accessible at http://localhost:8000/docs
- [ ] GET /default-emergency-contacts returns data
- [ ] GET /safety-tips returns all tips
- [ ] GET /safety-tips?category=Travel returns travel tips

---

## 🎯 Next Steps

1. **For Users**: Check the WOMEN_SAFETY_GUIDE.md for complete feature documentation
2. **For Frontend Developers**: Check API_DOCUMENTATION.md for all endpoints
3. **For Customization**: Edit emergency_contacts_seed.py to add region-specific numbers
4. **For Testing**: Use http://localhost:8000/docs to test endpoints interactively

---

## 🆘 Emergency Feature Endpoints

```
GET  /default-emergency-contacts       → Pre-configured emergency numbers
POST /add-contact                       → Add personal trusted contact
GET  /contacts                          → List all emergency contacts
GET  /contacts/{contact_id}             → View specific contact
DELETE /contacts/{contact_id}           → Remove contact
PUT  /contacts/{contact_id}/favorite    → Mark as favorite
POST /send-sos                          → Send emergency alert
GET  /sos/{sos_id}                      → View alert details
GET  /sos/user/{user_id}                → Emergency alert history
GET  /safety-tips                       → Browse safety tips
GET  /safety-tips/{tip_id}              → View specific tip
```

**Total: 11 Women Safety Endpoints**

---

## 💡 Usage Example

```bash
# Get women helpline and other emergency numbers
curl http://localhost:8000/default-emergency-contacts

# Add trusted person
curl -X POST http://localhost:8000/add-contact \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "name": "Mom", "phone": "9876543210", "category": "personal"}'

# Send SOS
curl -X POST http://localhost:8000/send-sos \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "location": "Campus", "message": "Need help!"}'

# Get safety guidance
curl "http://localhost:8000/safety-tips?category=Personal"
```

---

**Deployment Ready: Women Safety Features Enabled ✅**

