import { useState, useEffect } from 'react'

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [newContact, setNewContact] = useState({ name: '', phone: '', category: '', region: '' })
  const [showForm, setShowForm] = useState(false)

  const categories = [
    { id: 'all', label: 'All Contacts' },
    { id: 'police', label: 'Police' },
    { id: 'medical', label: 'Medical' },
    { id: 'helpline', label: 'Helpline' },
    { id: 'counseling', label: 'Counseling' }
  ]

  // Sample contacts for demo
  const sampleContacts = [
    {
      id: 1,
      name: 'Emergency Police',
      phone: '100',
      category: 'police',
      region: 'India-wide'
    },
    {
      id: 2,
      name: 'Women Helpline',
      phone: '1091',
      category: 'helpline',
      region: 'India-wide'
    },
    {
      id: 3,
      name: 'Mental Health Helpline',
      phone: '9152987821',
      category: 'counseling',
      region: 'India-wide'
    },
    {
      id: 4,
      name: 'Emergency Medical',
      phone: '102',
      category: 'medical',
      region: 'India-wide'
    },
    {
      id: 5,
      name: 'Domestic Violence Helpline',
      phone: '181',
      category: 'helpline',
      region: 'India-wide'
    },
    {
      id: 6,
      name: 'Cyber Crime Helpline',
      phone: '1930',
      category: 'helpline',
      region: 'India-wide'
    }
  ]

  useEffect(() => {
    // Load contacts from API
    setContacts(sampleContacts)
  }, [])

  const handleAddContact = () => {
    if (newContact.name && newContact.phone && newContact.category) {
      setContacts([
        ...contacts,
        {
          id: Date.now(),
          ...newContact
        }
      ])
      setNewContact({ name: '', phone: '', category: '', region: '' })
      setShowForm(false)
    }
  }

  const displayContacts =
    selectedCategory === 'all'
      ? contacts
      : contacts.filter((c) => c.category === selectedCategory)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Emergency Contacts</h1>
          <p className="text-gray-600">Quick access to emergency services and support numbers</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-safety-red text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          {showForm ? 'Cancel' : 'Add Contact'}
        </button>
      </div>

      {/* Add Contact Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 className="text-lg font-bold">Add Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Contact Name"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-safety-red"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-safety-red"
            />
            <select
              value={newContact.category}
              onChange={(e) => setNewContact({ ...newContact, category: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-safety-red"
            >
              <option value="">Select Category</option>
              <option value="police">Police</option>
              <option value="medical">Medical</option>
              <option value="helpline">Helpline</option>
              <option value="counseling">Counseling</option>
            </select>
            <input
              type="text"
              placeholder="Region (Optional)"
              value={newContact.region}
              onChange={(e) => setNewContact({ ...newContact, region: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-safety-red"
            />
          </div>
          <button
            onClick={handleAddContact}
            className="w-full bg-safety-red text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Add Contact
          </button>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              selectedCategory === cat.id
                ? 'bg-safety-red text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayContacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-white rounded-lg shadow p-6 border-l-4 border-safety-red hover:shadow-lg transition"
          >
            <h3 className="text-lg font-bold mb-4 text-gray-900">{contact.name}</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone</p>
                <a
                  href={`tel:${contact.phone}`}
                  className="text-safety-red font-bold text-lg hover:underline"
                >
                  {contact.phone}
                </a>
              </div>
              <div className="flex gap-2">
                <span className="text-xs bg-red-100 text-safety-red px-2 py-1 rounded capitalize">
                  {contact.category}
                </span>
                {contact.region && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {contact.region}
                  </span>
                )}
              </div>
            </div>
            <button className="w-full mt-4 bg-safety-red text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition">
              Call Now
            </button>
          </div>
        ))}
      </div>

      {displayContacts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No contacts found in this category</p>
        </div>
      )}
    </div>
  )
}
