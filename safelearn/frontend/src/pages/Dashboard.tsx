import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Upload, BookOpen, BarChart3, HelpCircle, ShieldAlert, Phone } from 'lucide-react'

export default function Dashboard() {
  const features = [
    {
      title: 'Upload Notes',
      description: 'Upload PDF, DOCX, or TXT files for analysis',
      icon: Upload,
      href: '/notes',
      color: 'bg-blue-500'
    },
    {
      title: 'Smart Summary',
      description: 'Get AI-powered summaries of your notes',
      icon: BookOpen,
      href: '/notes',
      color: 'bg-green-500'
    },
    {
      title: 'Quiz Generator',
      description: 'Generate practice questions from your notes',
      icon: BarChart3,
      href: '/quiz',
      color: 'bg-purple-500'
    },
    {
      title: 'Ask a Doubt',
      description: 'Get answers to your academic questions',
      icon: HelpCircle,
      href: '/doubt-solver',
      color: 'bg-orange-500'
    },
    {
      title: 'Safety Tips',
      description: 'Access curated safety guidance',
      icon: ShieldAlert,
      href: '/safety',
      color: 'bg-red-500'
    },
    {
      title: 'Emergency Contacts',
      description: 'Manage emergency contacts and send SOS',
      icon: Phone,
      href: '/emergency-contacts',
      color: 'bg-pink-500'
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Welcome to SafeLearn</h1>
        <p className="text-lg text-gray-600 mt-2">
          Your offline AI assistant for learning and safety
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Notes Uploaded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Quizzes Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Doubts Solved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={feature.href}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Getting Started</CardTitle>
          <CardDescription className="text-blue-700">
            Start by uploading your study notes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/notes">
            <Button className="bg-blue-600 hover:bg-blue-700">Upload Notes Now</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
