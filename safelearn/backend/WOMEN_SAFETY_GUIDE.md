# SafeLearn - Women Safety Features Guide

## 🛡️ Overview

SafeLearn includes a comprehensive women safety module designed to help students stay safe through emergency contact management, SOS alerts, and curated safety tips.

---

## 📱 Key Features

### 1. **Emergency Contact Management**
Maintain a personalized list of emergency contacts easily accessible during emergencies.

### 2. **Default Emergency Numbers (Pre-configured)**
Access critical safety helplines:
- **112** - National Emergency Number (Police, Ambulance, Fire)
- **1091** - Women Helpline (24/7 support)
- **108** - Ambulance Service (Medical emergencies)
- **100** - Police Helpline
- **1098** - Childline (for minors)

### 3. **SOS Alert System**
Send emergency alerts to all your trusted contacts with one click.

### 4. **Safety Tips Database**
Access expert-curated safety tips across categories:
- Personal Safety
- Online Safety
- Travel Safety
- Workplace Safety
- Communication Safety
- Emergency Planning

---

## 🔌 API Endpoints

### Get Default Emergency Numbers

**Endpoint:** `GET /default-emergency-contacts`

**Purpose:** Retrieve pre-configured emergency numbers available to all users

**Response:**
```json
{
  "default_contacts": [
    {
      "name": "National Emergency Number",
      "phone": "112",
      "category": "police",
      "region": "India",
      "is_favorite": true
    },
    {
      "name": "Women Helpline",
      "phone": "1091",
      "category": "helpline",
      "region": "India",
      "is_favorite": true
    },
    {
      "name": "Ambulance Service",
      "phone": "108",
      "category": "medical",
      "region": "India",
      "is_favorite": true
    }
  ],
  "total": 6,
  "message": "Default emergency contacts available"
}
```

**Usage Example:**
```bash
curl -X GET "http://localhost:8000/default-emergency-contacts"
```

---

### Add Personal Emergency Contact

**Endpoint:** `POST /add-contact`

**Purpose:** Add a personal trusted contact (family, friend, mentor)

**Request Body:**
```json
{
  "user_id": 1,
  "name": "Mom",
  "phone": "9876543210",
  "email": "mom@example.com",
  "category": "personal",
  "relationship": "Parent"
}
```

**Categories:**
- `police` - Police officer/contact
- `medical` - Hospital/doctor
- `helpline` - Support helpline
- `counseling` - Mental health counselor
- `personal` - Family/friend

**Usage Example:**
```bash
curl -X POST "http://localhost:8000/add-contact" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "name": "Mom",
    "phone": "9876543210",
    "category": "personal",
    "relationship": "Parent"
  }'
```

---

### Get All Emergency Contacts

**Endpoint:** `GET /contacts`

**Purpose:** Retrieve all emergency contacts for a user

**Query Parameters:**
- `user_id` (required): User ID
- `category` (optional): Filter by category

**Response:**
```json
{
  "user_id": 1,
  "total_contacts": 5,
  "contacts": [
    {
      "id": 1,
      "name": "Mom",
      "phone": "9876543210",
      "email": "mom@example.com",
      "category": "personal",
      "relationship": "Parent",
      "is_favorite": true,
      "created_at": "2024-01-15T10:30:00"
    }
  ]
}
```

**Usage Example:**
```bash
# Get all contacts
curl -X GET "http://localhost:8000/contacts?user_id=1"

# Get only medical contacts
curl -X GET "http://localhost:8000/contacts?user_id=1&category=medical"
```

---

### Get Specific Emergency Contact

**Endpoint:** `GET /contacts/{contact_id}`

**Purpose:** Get details of a specific emergency contact

**Usage Example:**
```bash
curl -X GET "http://localhost:8000/contacts/1"
```

---

### Delete Emergency Contact

**Endpoint:** `DELETE /contacts/{contact_id}`

**Purpose:** Remove an emergency contact

**Usage Example:**
```bash
curl -X DELETE "http://localhost:8000/contacts/1"
```

---

### Mark Contact as Favorite

**Endpoint:** `PUT /contacts/{contact_id}/favorite`

**Purpose:** Toggle favorite status (for quick access)

**Request Body:**
```json
{
  "is_favorite": true
}
```

**Usage Example:**
```bash
curl -X PUT "http://localhost:8000/contacts/1/favorite" \
  -H "Content-Type: application/json" \
  -d '{"is_favorite": true}'
```

---

### Send SOS Alert

**Endpoint:** `POST /send-sos`

**Purpose:** Send emergency alert to all emergency contacts

**Request Body:**
```json
{
  "user_id": 1,
  "location": "Main Street, Downtown",
  "message": "Emergency! Need immediate assistance"
}
```

**Response:**
```json
{
  "sos_id": 1,
  "status": "sent",
  "location": "Main Street, Downtown",
  "message": "Emergency! Need immediate assistance",
  "contacts_notified": 5,
  "notification_details": [
    {"name": "Mom", "phone": "9876543210", "category": "personal"},
    {"name": "Women Helpline", "phone": "1091", "category": "helpline"}
  ],
  "timestamp": "2024-01-15T14:30:00",
  "alert_message": "SOS alert sent successfully. Emergency contacts have been notified. Stay safe!"
}
```

**Usage Example:**
```bash
curl -X POST "http://localhost:8000/send-sos" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "location": "Campus Library",
    "message": "Need urgent help"
  }'
```

---

### Get SOS Alert Details

**Endpoint:** `GET /sos/{sos_id}`

**Purpose:** Retrieve details of a specific SOS alert

**Usage Example:**
```bash
curl -X GET "http://localhost:8000/sos/1"
```

---

### Get User SOS History

**Endpoint:** `GET /sos/user/{user_id}`

**Purpose:** View all SOS alerts sent by a user

**Response:**
```json
{
  "user_id": 1,
  "total_alerts": 2,
  "alerts": [
    {
      "id": 1,
      "status": "sent",
      "location": "Campus Library",
      "created_at": "2024-01-15T14:30:00"
    }
  ]
}
```

**Usage Example:**
```bash
curl -X GET "http://localhost:8000/sos/user/1"
```

---

### Get Safety Tips

**Endpoint:** `GET /safety-tips`

**Purpose:** Retrieve curated safety tips

**Query Parameters:**
- `category` (optional): Personal, Online, Travel, Workplace, Communication, Planning

**Response:**
```json
{
  "total_tips": 4,
  "category": "Personal",
  "tips": [
    {
      "id": 1,
      "title": "Personal Safety Basics",
      "content": "Always stay aware of your surroundings...",
      "category": "Personal",
      "created_at": "2024-01-01T00:00:00"
    }
  ]
}
```

**Usage Example:**
```bash
# Get all tips
curl -X GET "http://localhost:8000/safety-tips"

# Get travel safety tips
curl -X GET "http://localhost:8000/safety-tips?category=Travel"
```

---

### Get Specific Safety Tip

**Endpoint:** `GET /safety-tips/{tip_id}`

**Purpose:** Get detailed safety tip content

**Usage Example:**
```bash
curl -X GET "http://localhost:8000/safety-tips/1"
```

---

## 🚀 Setup Instructions

### 1. Initialize Database with Emergency Numbers

Run the seed script to populate default emergency contacts:

```bash
cd safelearn/backend
python emergency_contacts_seed.py
```

**Output:**
```
🌱 Starting emergency contacts seed process...
✓ Database initialized
  ✓ Added: National Emergency Number (112)
  ✓ Added: Women Helpline (1091)
  ✓ Added: Ambulance Service (108)
  ...
✅ Added 6 emergency contacts
✅ Added 6 safety tips

🎉 Seed process completed successfully!

📞 Emergency Contacts Summary:
============================================================
⭐ National Emergency Number    | 112      | police
⭐ Women Helpline              | 1091     | helpline
⭐ Ambulance Service           | 108      | medical
   Police Helpline              | 100      | police
   Childline                    | 1098     | helpline
   Suicide Prevention Hotline   | 9152.... | helpline
```

### 2. Start Backend Server

```bash
python main.py
```

### 3. Test Endpoints

Access interactive API docs at: http://localhost:8000/docs

---

## 📋 Complete Workflow Example

### Step 1: Get Default Emergency Numbers

```bash
curl -X GET "http://localhost:8000/default-emergency-contacts"
```

### Step 2: Add Personal Trusted Contacts

```bash
# Add Mom
curl -X POST "http://localhost:8000/add-contact" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "name": "Mom",
    "phone": "9876543210",
    "category": "personal",
    "relationship": "Parent"
  }'

# Add best friend
curl -X POST "http://localhost:8000/add-contact" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "name": "Sarah",
    "phone": "9988776655",
    "category": "personal",
    "relationship": "Friend"
  }'
```

### Step 3: Mark Important Contacts as Favorites

```bash
curl -X PUT "http://localhost:8000/contacts/1/favorite" \
  -H "Content-Type: application/json" \
  -d '{"is_favorite": true}'
```

### Step 4: View All Emergency Contacts

```bash
curl -X GET "http://localhost:8000/contacts?user_id=1"
```

### Step 5: Read Safety Tips

```bash
# Get all tips
curl -X GET "http://localhost:8000/safety-tips"

# Get travel safety tips
curl -X GET "http://localhost:8000/safety-tips?category=Travel"
```

### Step 6: Send SOS Alert (Emergency)

```bash
curl -X POST "http://localhost:8000/send-sos" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "location": "Unknown location",
    "message": "Emergency! Immediate assistance needed!"
  }'
```

---

## 🔒 Security Best Practices

### For Users:
1. **Keep Contacts Updated** - Regularly update emergency contact information
2. **Share Location Wisely** - Only with trusted people
3. **Test the System** - Familiarize yourself before an emergency
4. **Use Strong Passwords** - Protect your account
5. **Regular Backups** - Export contact list periodically

### For Developers:
1. **Enable HTTPS** - Use SSL/TLS in production
2. **Validate Input** - Sanitize all user inputs
3. **Rate Limiting** - Prevent abuse of SOS endpoint
4. **Audit Logs** - Track emergency alert sends
5. **Data Encryption** - Encrypt sensitive location data

---

## 📊 Emergency Contact Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| **police** | Police/Law enforcement | Police officer, Station, Patrol |
| **medical** | Healthcare providers | Hospital, Doctor, Clinic |
| **helpline** | Support hotlines | Women's helpline, Childline |
| **counseling** | Mental health support | Counselor, Therapist, NGO |
| **personal** | Trusted individuals | Family, Friends, Mentors |

---

## 🆘 Emergency Numbers Reference

### India (Multi-region)

| Service | Number | Category | Available 24/7 |
|---------|--------|----------|-----------------|
| National Emergency | **112** | All | ✅ Yes |
| Women Helpline | **1091** | Helpline | ✅ Yes |
| Ambulance Service | **108** | Medical | ✅ Yes |
| Police | **100** | Police | ✅ Yes |
| Childline | **1098** | Assistance | ✅ Yes |
| Fire | **101** | Emergency | ✅ Yes |

---

## 🎯 Feature Highlights

✅ **One-Click SOS** - Send emergency alerts instantly
✅ **Default Helplines** - Pre-configured critical numbers
✅ **Contact Management** - Organize trusted contacts
✅ **Favorite Marking** - Quick access to priority contacts
✅ **Alert History** - Track emergency alerts sent
✅ **Safety Tips** - Expert-curated guidance
✅ **Category Filtering** - Search tips by topic
✅ **Offline Ready** - Works with local database

---

## 🐛 Troubleshooting

### Issue: SOS not sending to contacts
**Solution:** Ensure contacts are added with valid phone numbers

### Issue: Default emergency numbers not showing
**Solution:** Run `python emergency_contacts_seed.py` to populate database

### Issue: Can't update contact
**Solution:** Verify contact ID and user permissions

### Issue: Safety tips not loading
**Solution:** Check if seed script completed successfully

---

## 📞 Contact Categories for Workflow

### Personal Emergency Plan
1. **Immediate Response** (Mom, Dad, Best Friend)
2. **Professional Help** (Police, Hospital)
3. **Support Services** (Helpline, Counselor)

### Adding & Organizing

```
Start → Get Defaults → Add Personal → Mark Favorites
   ↓
   Query Contacts → Emergency? → Send SOS
```

---

## 🎓 Educational Use

Use SafeLearn's safety features to:
- Create awareness campaigns
- Demonstrate emergency response systems
- Practice safety planning
- Teach emergency preparedness

---

## 🌍 Customization

To add region-specific emergency numbers, modify `emergency_contacts_seed.py`:

```python
DEFAULT_EMERGENCY_CONTACTS = [
    {
        "name": "Your Service",
        "phone": "XXXX",
        "category": "category",
        "region": "Your Region"
    }
]
```

Then run the seed script again.

---

## 📚 Related Documentation

- `README.md` - Project overview
- `API_DOCUMENTATION.md` - Complete API reference
- `BACKEND_IMPLEMENTATION_GUIDE.md` - Architecture details

---

## ✅ Deployment Checklist

- [ ] Run emergency_contacts_seed.py to populate database
- [ ] Verify default emergency numbers are in database
- [ ] Test POST /send-sos endpoint
- [ ] Test GET /default-emergency-contacts endpoint
- [ ] Verify safety tips are loading
- [ ] Test contact management endpoints
- [ ] Enable HTTPS in production
- [ ] Set up logging for SOS alerts
- [ ] Brief users on safety features
- [ ] Regular backup of emergency contacts

---

## 🙏 Special Note

This women safety module is built with the well-being of students in mind. It provides tools for:
- **Prevention** - Educational safe practices
- **Preparedness** - Planning ahead
- **Response** - Quick emergency communication
- **Support** - Access to helplines and resources

**Remember:** This system supplements but does not replace official emergency services. Always contact local emergency authorities for immediate assistance.

---

**SafeLearn Women Safety Module v2.0**
**Stay Safe. Learn Better. Together.** 🛡️💪

