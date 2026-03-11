"""
SafeLearn - Emergency Contacts Seed Data
Initializes database with default emergency contact numbers

This script populates the database with essential emergency contact numbers:
- 112: National Emergency Number
- 1091: Women Helpline
- 108: Ambulance Service

Usage:
    python emergency_contacts_seed.py
"""

from database import SessionLocal, init_db, EmergencyContact, SafetyTip
from datetime import datetime

# Default emergency contacts (can be customized per region)
DEFAULT_EMERGENCY_CONTACTS = [
    {
        "name": "National Emergency Number",
        "phone": "112",
        "email": None,
        "category": "police",
        "relationship": None,
        "region": "India",
        "description": "All-purpose emergency number for police, ambulance, fire"
    },
    {
        "name": "Women Helpline",
        "phone": "1091",
        "email": None,
        "category": "helpline",
        "relationship": None,
        "region": "India",
        "description": "24/7 helpline for women's safety and support"
    },
    {
        "name": "Ambulance Service",
        "phone": "108",
        "email": None,
        "category": "medical",
        "relationship": None,
        "region": "India",
        "description": "Emergency ambulance and medical assistance service"
    },
    {
        "name": "Police Helpline",
        "phone": "100",
        "email": None,
        "category": "police",
        "relationship": None,
        "region": "India",
        "description": "Police assistance and emergency response"
    },
    {
        "name": "Childline",
        "phone": "1098",
        "email": None,
        "category": "helpline",
        "relationship": None,
        "region": "India",
        "description": "24/7 helpline for children in distress"
    },
    {
        "name": "Suicide Prevention Hotline",
        "phone": "9152987821",
        "email": None,
        "category": "helpline",
        "relationship": None,
        "region": "India",
        "description": "Mental health support and suicide prevention"
    }
]

# Default safety tips
DEFAULT_SAFETY_TIPS = [
    {
        "title": "Personal Safety Basics",
        "content": "Always stay aware of your surroundings. Trust your instincts. Share your location with trusted friends and family. Keep your phone charged.",
        "category": "Personal"
    },
    {
        "title": "Online Safety",
        "content": "Never share personal information online. Use strong passwords. Verify identities before sharing details. Report suspicious activity.",
        "category": "Online"
    },
    {
        "title": "Travel Safety",
        "content": "Use licensed transportation. Share your trip details. Avoid isolated areas. Keep emergency contacts handy.",
        "category": "Travel"
    },
    {
        "title": "Workplace Safety",
        "content": "Know your workplace exits. Report harassment immediately. Use buddy system. Keep emergency numbers visible.",
        "category": "Workplace"
    },
    {
        "title": "How to Respond to Suspicious Calls",
        "content": "Never confirm personal information. Don't click links. Hang up and call official numbers directly. Report to authorities if threatened.",
        "category": "Communication"
    },
    {
        "title": "Emergency Response Plan",
        "content": "Know your safe places. Identify trusted people. Have an emergency plan. Practice responses. Update contacts regularly.",
        "category": "Planning"
    }
]


def seed_emergency_contacts():
    """Seed database with default emergency contacts"""
    print("🌱 Starting emergency contacts seed process...")

    # Initialize database
    init_db()
    print("✓ Database initialized")

    db = SessionLocal()

    try:
        # Create a default user for system emergency contacts (user_id = 0 for system-wide contacts)
        # First, check if any emergency contacts already exist
        existing_count = db.query(EmergencyContact).count()

        if existing_count > 0:
            print(f"⚠️  Database already has {existing_count} emergency contacts")
            response = input("Do you want to clear and reseed? (yes/no): ").strip().lower()
            if response != "yes":
                print("❌ Seeding cancelled")
                return
            # Clear existing contacts
            db.query(EmergencyContact).delete()
            db.commit()
            print("✓ Cleared existing emergency contacts")

        # Add default emergency contacts
        added_count = 0
        for contact_data in DEFAULT_EMERGENCY_CONTACTS:
            contact = EmergencyContact(
                user_id=0,  # System-wide default contact (not tied to specific user)
                name=contact_data["name"],
                phone=contact_data["phone"],
                email=contact_data["email"],
                category=contact_data["category"],
                relationship=contact_data["relationship"],
                region=contact_data["region"],
                is_favorite=(contact_data["phone"] in ["112", "1091", "108"])  # Mark priority contacts
            )
            db.add(contact)
            added_count += 1
            print(f"  ✓ Added: {contact_data['name']} ({contact_data['phone']})")

        db.commit()
        print(f"\n✅ Added {added_count} emergency contacts")

        # Add safety tips if not already present
        existing_tips = db.query(SafetyTip).count()
        if existing_tips == 0:
            for tip_data in DEFAULT_SAFETY_TIPS:
                tip = SafetyTip(
                    title=tip_data["title"],
                    content=tip_data["content"],
                    category=tip_data["category"]
                )
                db.add(tip)

            db.commit()
            print(f"✅ Added {len(DEFAULT_SAFETY_TIPS)} safety tips")
        else:
            print(f"ℹ️  Safety tips already exist ({existing_tips} found)")

    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        db.rollback()
        raise
    finally:
        db.close()
        print("\n🎉 Seed process completed successfully!")
        print("\n📞 Emergency Contacts Summary:")
        print("="*60)

        # Display summary
        db = SessionLocal()
        try:
            contacts = db.query(EmergencyContact).filter(EmergencyContact.user_id == 0).all()
            for contact in contacts:
                favorite_icon = "⭐" if contact.is_favorite else "  "
                print(f"{favorite_icon} {contact.name:30} | {contact.phone:12} | {contact.category}")
        finally:
            db.close()


if __name__ == "__main__":
    seed_emergency_contacts()
