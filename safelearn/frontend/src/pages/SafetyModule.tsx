import { useState, useEffect } from 'react'
import { getSafetyTips } from '../services/api'

export default function SafetyModule() {
  const [tips, setTips] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(false)

  const categories = [
    { id: 'all', label: 'All Tips' },
    { id: 'personal-safety', label: 'Personal Safety' },
    { id: 'online-safety', label: 'Online Safety' },
    { id: 'workplace-safety', label: 'Workplace Safety' },
    { id: 'travel-safety', label: 'Travel Safety' }
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
      category: 'personal-safety'
    },
    {
      id: 2,
      title: 'Share Your Location',
      content: 'When going out, share your location with trusted friends or family. Keep them updated about your whereabouts and expected return time.',
      category: 'personal-safety'
    },
    {
      id: 3,
      title: 'Protect Your Personal Information Online',
      content: 'Never share sensitive personal information online. Be careful with what you post on social media - create strong passwords and enable two-factor authentication.',
      category: 'online-safety'
    },
    {
      id: 4,
      title: 'Know Your Rights at Work',
      content: 'Understand your workplace rights and report any harassment or discrimination. Know the proper channels to report issues confidentially.',
      category: 'workplace-safety'
    },
    {
      id: 5,
      title: 'Travel in Groups',
      content: 'Try to travel with others when possible. If traveling alone, let someone know your plans and check in regularly. Take well-lit, populated routes.',
      category: 'travel-safety'
    },
    {
      id: 6,
      title: 'Keep Emergency Contacts Handy',
      content: 'Always have emergency contact numbers memorized or saved. Include local police, hospitals, and trusted contacts.',
      category: 'personal-safety'
    }
  ]

  const displayTips = tips.length > 0 ? tips : sampleTips

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Women Safety Module</h1>
        <p className="text-gray-600">Learn practical tips to stay safe and secure</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              selectedCategory === cat.id
                ? 'bg-safety-blue text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayTips.map((tip) => (
          <div key={tip.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-bold mb-3 text-safety-red">{tip.title}</h3>
            <p className="text-gray-600 leading-relaxed mb-4">{tip.content}</p>
            <span className="text-xs bg-blue-100 text-safety-blue px-2 py-1 rounded-full capitalize">
              {tip.category?.replace('-', ' ')}
            </span>
          </div>
        ))}
      </div>

      {displayTips.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tips found in this category</p>
        </div>
      )}
    </div>
  )
}
