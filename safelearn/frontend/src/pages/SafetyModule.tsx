import { useState, useEffect } from 'react'
import { getSafetyTips } from '../services/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldAlert, Heart, AlertCircle, MapPin, Lock, Users } from 'lucide-react'

export default function SafetyModule() {
  const [tips, setTips] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(false)

  const categories = [
    { id: 'all', label: 'All Tips', icon: ShieldAlert },
    { id: 'Personal', label: 'Personal Safety', icon: Heart },
    { id: 'Online', label: 'Online Safety', icon: Lock },
    { id: 'Travel', label: 'Travel Safety', icon: MapPin },
    { id: 'Workplace', label: 'Workplace Safety', icon: Users },
    { id: 'Communication', label: 'Communication', icon: AlertCircle }
  ]

  useEffect(() => {
    loadTips()
  }, [selectedCategory])

  const loadTips = async () => {
    setLoading(true)
    try {
      const response = await getSafetyTips(
        selectedCategory === 'all' ? undefined : selectedCategory
      )
      setTips(response.data)
    } catch (error) {
      console.error('Error loading tips:', error)
    } finally {
      setLoading(false)
    }
  }

  // Sample tips for demo
  const sampleTips = [
    {
      id: 1,
      title: 'Trust Your Intuition',
      content: 'If something feels wrong, it probably is. Your gut instinct is your first line of defense. Remove yourself from the situation if you feel unsafe.',
      category: 'Personal'
    },
    {
      id: 2,
      title: 'Share Your Location',
      content: 'When going out, share your location with trusted friends or family. Keep them updated about your whereabouts and expected return time.',
      category: 'Personal'
    },
    {
      id: 3,
      title: 'Protect Your Personal Information Online',
      content: 'Never share sensitive personal information online. Be careful with what you post on social media - create strong passwords and enable two-factor authentication.',
      category: 'Online'
    },
    {
      id: 4,
      title: 'Know Your Rights at Work',
      content: 'Understand your workplace rights and report any harassment or discrimination. Know the proper channels to report issues confidentially.',
      category: 'Workplace'
    },
    {
      id: 5,
      title: 'Travel in Groups',
      content: 'Try to travel with others when possible. If traveling alone, let someone know your plans and check in regularly. Take well-lit, populated routes.',
      category: 'Travel'
    },
    {
      id: 6,
      title: 'Keep Emergency Contacts Handy',
      content: 'Always have emergency contact numbers memorized or saved. Include local police, hospitals, and trusted contacts.',
      category: 'Personal'
    }
  ]

  const displayTips = tips.length > 0 ? tips : sampleTips

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Personal': 'bg-red-100 border-red-200 text-red-700',
      'Online': 'bg-purple-100 border-purple-200 text-purple-700',
      'Travel': 'bg-blue-100 border-blue-200 text-blue-700',
      'Workplace': 'bg-green-100 border-green-200 text-green-700',
      'Communication': 'bg-yellow-100 border-yellow-200 text-yellow-700',
      'Planning': 'bg-indigo-100 border-indigo-200 text-indigo-700'
    }
    return colors[category] || 'bg-gray-100 border-gray-200 text-gray-700'
  }

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: typeof ShieldAlert } = {
      'Personal': Heart,
      'Online': Lock,
      'Travel': MapPin,
      'Workplace': Users,
      'Communication': AlertCircle,
      'Planning': ShieldAlert
    }
    return icons[category] || ShieldAlert
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Women Safety Module</h1>
        <p className="text-lg text-gray-600 mt-2">Learn practical tips to stay safe and secure</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition ${
                selectedCategory === cat.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayTips.map((tip) => {
          const Icon = getCategoryIcon(tip.category)
          return (
            <Card key={tip.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{tip.title}</CardTitle>
                  </div>
                  <Icon className="h-5 w-5 text-red-600 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 leading-relaxed">{tip.content}</p>
                <div className={`text-xs px-3 py-1 rounded-full font-semibold border ${getCategoryColor(tip.category)} w-fit`}>
                  {tip.category}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {displayTips.length === 0 && !loading && (
        <Card className="text-center py-12 border-dashed">
          <CardContent>
            <p className="text-gray-500 text-lg">No tips found in this category</p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-900">🆘 Emergency Support</CardTitle>
          <CardDescription className="text-red-700">In case of emergency, reach out to these services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-red-200">
              <p className="text-2xl font-bold text-red-600">112</p>
              <p className="text-xs text-gray-600 mt-1">Emergency</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-red-200">
              <p className="text-2xl font-bold text-red-600">1091</p>
              <p className="text-xs text-gray-600 mt-1">Women Helpline</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-red-200">
              <p className="text-2xl font-bold text-red-600">108</p>
              <p className="text-xs text-gray-600 mt-1">Ambulance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
