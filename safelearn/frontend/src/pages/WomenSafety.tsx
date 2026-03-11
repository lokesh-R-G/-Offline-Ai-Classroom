import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertTriangle, Phone, Plus, Trash2, Heart, Clock, HelpCircle, CheckCircle2 } from 'lucide-react'

interface Contact {
  id: number
  name: string
  phone: string
  category: string
  region?: string
  isDefault?: boolean
}

interface SafetyTip {
  id: number
  title: string
  content: string
  category: string
}

const EMERGENCY_NUMBERS = [
  { name: 'Police', number: '112', color: 'red' },
  { name: 'Women Helpline', number: '1091', color: 'pink' },
  { name: 'Ambulance', number: '108', color: 'orange' },
  { name: 'Fire', number: '100', color: 'red' },
  { name: 'Women in Crisis', number: '1098', color: 'purple' },
  { name: 'Cyber Crime', number: '1930', color: 'blue' }
]

const SAFETY_TIPS: SafetyTip[] = [
  {
    id: 1,
    title: 'Trust Your Instincts',
    content: 'If something feels wrong, it probably is. Your gut feelings exist for a reason. Don\'t ignore warning signs.',
    category: 'Personal Safety'
  },
  {
    id: 2,
    title: 'Share Your Location',
    content: 'Always let a trusted friend know where you\'re going and when you expect to return. Use location sharing apps.',
    category: 'Travel Safety'
  },
  {
    id: 3,
    title: 'Use the Buddy System',
    content: 'Never go out alone at night. Travel with a trusted friend or group whenever possible.',
    category: 'General Safety'
  },
  {
    id: 4,
    title: 'Keep Your Phone Charged',
    content: 'Always carry your phone with full battery. It\'s your lifeline in emergencies.',
    category: 'Emergency Preparedness'
  },
  {
    id: 5,
    title: 'Document Everything',
    content: 'Keep records of harassment, threats, or abuse. Take screenshots and save messages as evidence.',
    category: 'Legal Protection'
  },
  {
    id: 6,
    title: 'Avoid Isolated Areas',
    content: 'Stay in well-lit, populated areas. Avoid dark alleys, deserted streets, and isolated locations.',
    category: 'Travel Safety'
  }
]

export default function WomenSafety() {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: 'Mom', phone: '9876543210', category: 'Family', isDefault: true },
    { id: 2, name: 'Best Friend', phone: '9123456789', category: 'Friend', isDefault: false }
  ])

  const [newContact, setNewContact] = useState({ name: '', phone: '', category: 'Family', region: '' })
  const [sosLoading, setSosLoading] = useState(false)
  const [sosMessage, setSosMessage] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [addContactOpen, setAddContactOpen] = useState(false)
  const [fakeCallOpen, setFakeCallOpen] = useState(false)
  const [callTimer, setCallTimer] = useState(0)

  const CATEGORIES = ['All', 'Family', 'Friend', 'Police', 'Medical', 'Counselor', 'Legal']

  const handleSOS = async () => {
    setSosLoading(true)
    setSosMessage('')

    try {
      // Simulate API call to backend /send-sos endpoint
      // In production, replace with actual API call
      const response = await fetch('http://localhost:8000/safety/send-sos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contacts: contacts.filter(c => c.isDefault) })
      })

      if (response.ok) {
        setSosMessage('✅ Emergency alert sent successfully!')
        // Auto-clear message after 5 seconds
        setTimeout(() => setSosMessage(''), 5000)
      } else {
        setSosMessage('⚠️ Alert: Unable to send SOS. Please call 112 directly.')
      }
    } catch (error) {
      console.error('SOS Error:', error)
      setSosMessage('⚠️ Alert: Unable to send SOS. Please call 112 directly.')
    } finally {
      setSosLoading(false)
    }
  }

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      alert('Please fill in name and phone number')
      return
    }

    const contact: Contact = {
      id: Math.max(...contacts.map(c => c.id), 0) + 1,
      ...newContact
    }
    setContacts([...contacts, contact])
    setNewContact({ name: '', phone: '', category: 'Family', region: '' })
    setAddContactOpen(false)
  }

  const handleDeleteContact = (id: number) => {
    setContacts(contacts.filter(c => c.id !== id))
  }

  const handleToggleFavorite = (id: number) => {
    setContacts(contacts.map(c =>
      c.id === id ? { ...c, isDefault: !c.isDefault } : c
    ))
  }

  const handleCall = (phone: string) => {
    // In production, this would trigger actual calling via Twilio or similar
    window.location.href = `tel:${phone}`
  }

  const filteredContacts = selectedCategory === 'All'
    ? contacts
    : contacts.filter(c => c.category === selectedCategory)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Women Safety Zone</h1>
        <p className="text-lg text-gray-600 mt-2">Your safety, security, and support in one place</p>
      </div>

      {/* SOS Alert Message */}
      {sosMessage && (
        <Alert variant={sosMessage.includes('✅') ? 'default' : 'destructive'}>
          <AlertDescription>{sosMessage}</AlertDescription>
        </Alert>
      )}

      {/* Large SOS Button */}
      <Card className="border-4 border-red-500 bg-red-50">
        <CardContent className="pt-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-2xl font-bold text-red-900 mb-2">Emergency SOS Alert</h2>
              <p className="text-red-800">Send an emergency alert to all your saved contacts instantly</p>
            </div>
            <div className="flex justify-center md:justify-end">
              <button
                onClick={handleSOS}
                disabled={sosLoading}
                className="w-32 h-32 rounded-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 flex items-center justify-center text-white font-bold shadow-2xl transform transition hover:scale-110 active:scale-95"
              >
                <div className="text-center">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
                  <span className="text-sm">{sosLoading ? 'Sending...' : 'SOS'}</span>
                </div>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Emergency Numbers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-red-600" />
            Emergency Hotlines
          </CardTitle>
          <CardDescription>Keep these numbers handy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {EMERGENCY_NUMBERS.map((emergency) => (
              <button
                key={emergency.number}
                onClick={() => handleCall(emergency.number)}
                className={`p-4 rounded-lg border-2 hover:shadow-lg transition text-white font-semibold text-center bg-${emergency.color}-600`}
              >
                <div className="text-2xl font-bold mb-1">{emergency.number}</div>
                <div className="text-xs">{emergency.name}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Contact Dialog */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Contact
            </CardTitle>
            <CardDescription>Create trusted contact for emergencies</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={addContactOpen} onOpenChange={setAddContactOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Contact
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Emergency Contact</DialogTitle>
                  <DialogDescription>Add a trusted person to contact in emergencies</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      placeholder="e.g., Mom, Sister, Friend"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                      placeholder="Enter 10-digit phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={newContact.category}
                      onChange={(e) => setNewContact({ ...newContact, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md"
                    >
                      {CATEGORIES.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Region (Optional)</Label>
                    <Input
                      id="region"
                      value={newContact.region}
                      onChange={(e) => setNewContact({ ...newContact, region: e.target.value })}
                      placeholder="e.g., North Delhi"
                    />
                  </div>
                  <Button onClick={handleAddContact} className="w-full bg-green-600 hover:bg-green-700">
                    Save Contact
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Saved Contacts List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Saved Contacts ({filteredContacts.length})</CardTitle>
              <CardDescription>Manage your emergency contacts</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Category Filter */}
              <div className="mb-4 flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Contacts List */}
              <div className="space-y-3">
                {filteredContacts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No contacts in this category</p>
                ) : (
                  filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-lg hover:border-blue-200 hover:bg-blue-50 transition"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{contact.name}</p>
                        <p className="text-sm text-gray-600">{contact.phone}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                            {contact.category}
                          </span>
                          {contact.isDefault && (
                            <span className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                              Default SOS
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCall(contact.phone)}
                          className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 transition"
                          title="Call"
                        >
                          <Phone className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleToggleFavorite(contact.id)}
                          className={`p-2 rounded-lg transition ${
                            contact.isDefault
                              ? 'bg-red-100 text-red-600 hover:bg-red-200'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                          title="Mark as default SOS contact"
                        >
                          <Heart className="w-5 h-5" fill="currentColor" />
                        </button>
                        <button
                          onClick={() => handleDeleteContact(contact.id)}
                          className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Safety Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            Safety Tips & Guidelines
          </CardTitle>
          <CardDescription>Learn essential safety practices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SAFETY_TIPS.map((tip) => (
              <Card key={tip.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="text-base flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    {tip.title}
                  </CardTitle>
                  <CardDescription>{tip.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{tip.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fake Call Simulator */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-700" />
            Fake Call Simulator
          </CardTitle>
          <CardDescription>Practice responding to suspicious or uncomfortable calls</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={fakeCallOpen} onOpenChange={setFakeCallOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Clock className="mr-2 h-4 w-4" />
                Start Fake Call Simulation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Incoming Call Simulation</DialogTitle>
                <DialogDescription>An uncomfortable caller - how will you respond?</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <Phone className="w-12 h-12 mx-auto text-blue-600 mb-3 animate-bounce" />
                  <p className="font-semibold text-lg">Unknown Number</p>
                  <p className="text-sm text-gray-600">+91 XXXX XXX XXX</p>
                </div>

                {callTimer === 0 ? (
                  <div className="space-y-3">
                    <p className="text-center font-semibold">How would you respond?</p>
                    <div className="space-y-2">
                      <Button
                        onClick={() => {
                          setCallTimer(1)
                        }}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        ✓ Answer Call
                      </Button>
                      <Button
                        onClick={() => {
                          setCallTimer(2)
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        ✗ Decline Call
                      </Button>
                      <Button
                        onClick={() => {
                          setCallTimer(3)
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        🔕 Block Number
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      {callTimer === 1 && "Good! Stay alert and don't share personal information. Hang up if uncomfortable."}
                      {callTimer === 2 && "Smart choice! Declining unknown calls protects your privacy and safety."}
                      {callTimer === 3 && "Excellent! Blocking suspicious numbers prevents future harassment."}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <Button
                onClick={() => {
                  setFakeCallOpen(false)
                  setCallTimer(0)
                }}
                className="w-full"
                variant="outline"
              >
                Close
              </Button>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Important Resources */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Remember:</strong> In case of immediate danger, always call 112 (Police) or your local emergency services. Your safety is our priority.
        </AlertDescription>
      </Alert>
    </div>
  )
}
