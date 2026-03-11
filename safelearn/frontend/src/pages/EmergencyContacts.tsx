import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Phone, AlertCircle, Heart, Trash2, MapPin } from 'lucide-react'

interface Contact {
  id: number
  name: string
  phone: string
  category: string
  region: string
  isDefault: boolean
}

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [newContact, setNewContact] = useState({ name: '', phone: '', category: 'personal', region: '' })
  const [favorites, setFavorites] = useState<number[]>([])

  const categories = [
    { id: 'all', label: 'All Contacts', color: 'gray' },
    { id: 'personal', label: 'Personal', color: 'blue' },
    { id: 'police', label: 'Police', color: 'red' },
    { id: 'medical', label: 'Medical', color: 'green' },
    { id: 'helpline', label: 'Helpline', color: 'purple' },
    { id: 'counseling', label: 'Counseling', color: 'orange' }
  ]

  const sampleContacts: Contact[] = [
    { id: 1, name: 'National Emergency Number', phone: '112', category: 'police', region: 'India-wide', isDefault: true },
    { id: 2, name: 'Women Helpline', phone: '1091', category: 'helpline', region: 'India-wide', isDefault: true },
    { id: 3, name: 'Ambulance Service', phone: '108', category: 'medical', region: 'India-wide', isDefault: true },
    { id: 4, name: 'Police Helpline', phone: '100', category: 'police', region: 'India-wide', isDefault: true },
    { id: 5, name: 'Childline', phone: '1098', category: 'helpline', region: 'India-wide', isDefault: true },
    { id: 6, name: 'Mental Health Helpline', phone: '9152987821', category: 'counseling', region: 'India-wide', isDefault: true },
  ]

  useEffect(() => {
    setContacts(sampleContacts)
  }, [])

  const handleAddContact = () => {
    if (newContact.name && newContact.phone && newContact.category) {
      setContacts([
        ...contacts,
        {
          id: Date.now(),
          ...newContact,
          isDefault: false
        }
      ])
      setNewContact({ name: '', phone: '', category: 'personal', region: '' })
    }
  }

  const handleDeleteContact = (id: number) => {
    setContacts(contacts.filter(c => c.id !== id))
    setFavorites(favorites.filter(fav => fav !== id))
  }

  const toggleFavorite = (id: number) => {
    setFavorites(favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id])
  }

  const displayContacts = selectedCategory === 'all'
    ? contacts
    : contacts.filter((c) => c.category === selectedCategory)

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      personal: 'bg-blue-100 border-blue-300 text-blue-700',
      police: 'bg-red-100 border-red-300 text-red-700',
      medical: 'bg-green-100 border-green-300 text-green-700',
      helpline: 'bg-purple-100 border-purple-300 text-purple-700',
      counseling: 'bg-orange-100 border-orange-300 text-orange-700'
    }
    return colors[category] || 'bg-gray-100 border-gray-300 text-gray-700'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Emergency Contacts</h1>
          <p className="text-lg text-gray-600 mt-2">Quick access to emergency services and support numbers</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Emergency Contact</DialogTitle>
              <DialogDescription>Add a new trusted contact for emergencies</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Contact Name</Label>
                <Input
                  id="contact-name"
                  placeholder="e.g., Mom"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Phone Number</Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  placeholder="e.g., 9876543210"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-category">Category</Label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white">
                  <option value="personal">Personal</option>
                  <option value="police">Police</option>
                  <option value="medical">Medical</option>
                  <option value="helpline">Helpline</option>
                  <option value="counseling">Counseling</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-region">Region (Optional)</Label>
                <Input
                  id="contact-region"
                  placeholder="e.g., New Delhi"
                  value={newContact.region}
                  onChange={(e) => setNewContact({ ...newContact, region: e.target.value })}
                />
              </div>
              <Button onClick={handleAddContact} className="w-full bg-red-600 hover:bg-red-700">
                Add Contact
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Alert variant="warning" className="border-2">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">Need immediate help?</p>
              <p className="text-sm mt-1">Send an SOS alert to all your contacts with your location</p>
            </div>
            <Button className="ml-4 bg-red-600 hover:bg-red-700 text-white">Send SOS</Button>
          </div>
        </AlertDescription>
      </Alert>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              selectedCategory === cat.id
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayContacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {contact.name}
                    {favorites.includes(contact.id) && (
                      <Heart className="h-4 w-4 fill-red-600 text-red-600" />
                    )}
                  </CardTitle>
                  {!contact.isDefault && contact.region && (
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {contact.region}
                    </CardDescription>
                  )}
                </div>
                {!contact.isDefault && (
                  <button
                    onClick={() => handleDeleteContact(contact.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone</p>
                <a
                  href={`tel:${contact.phone}`}
                  className="text-xl font-bold text-red-600 hover:underline block"
                >
                  {contact.phone}
                </a>
              </div>
              <div className="flex gap-2">
                <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${getCategoryColor(contact.category)} capitalize`}>
                  {contact.category}
                </span>
                {contact.isDefault && (
                  <span className="text-xs bg-yellow-100 border border-yellow-300 text-yellow-700 px-3 py-1 rounded-full font-semibold">
                    Default
                  </span>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => window.location.href = `tel:${contact.phone}`}
                  className="flex-1 gap-2 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
                <button
                  onClick={() => toggleFavorite(contact.id)}
                  className={`flex-1 px-4 py-2 rounded-md border-2 transition ${
                    favorites.includes(contact.id)
                      ? 'bg-red-50 border-red-300 text-red-600'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-red-200'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${favorites.includes(contact.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {displayContacts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-gray-500 text-lg">No contacts found in this category</p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">💡 Safety Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800 space-y-2">
          <p>• Keep your emergency contacts updated and accessible</p>
          <p>• Practice dialing emergency numbers so you can do it under stress</p>
          <p>• Mark contacts as favorites for quick access</p>
          <p>• Always inform someone about your location when going out</p>
        </CardContent>
      </Card>
    </div>
  )
}
