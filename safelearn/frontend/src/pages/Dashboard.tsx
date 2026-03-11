import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-safety-blue to-safety-purple rounded-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to SafeLearn</h1>
        <p className="text-lg mb-6 opacity-90">
          Your offline AI academic assistant with a dedicated women safety module
        </p>
        <div className="flex gap-4">
          <Link
            to="/notes"
            className="bg-white text-safety-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Upload Notes
          </Link>
          <Link
            to="/safety"
            className="bg-safety-red px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Safety Tips
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Academic Features */}
          <FeatureCard
            icon="📝"
            title="Notes Analysis"
            description="Upload your study notes and get AI-powered summaries and key concept extraction"
            href="/notes"
          />
          <FeatureCard
            icon="❓"
            title="Quiz Generator"
            description="Generate practice quizzes from your notes with multiple difficulty levels"
            href="/quiz"
          />
          <FeatureCard
            icon="💬"
            title="Doubt Solver"
            description="Ask any academic question and get instant AI-powered explanations"
            href="/doubt-solver"
          />

          {/* Safety Features */}
          <FeatureCard
            icon="🛡️"
            title="Safety Tips"
            description="Learn important women safety tips and personal security guidelines"
            href="/safety"
          />
          <FeatureCard
            icon="📞"
            title="Emergency Contacts"
            description="Quick access to emergency numbers and support services"
            href="/emergency-contacts"
          />
          <FeatureCard
            icon="📱"
            title="Fake Call Simulator"
            description="Practice responding to suspicious calls in a safe environment"
            href="/fake-call"
          />
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold mb-6">Your Progress</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Notes Uploaded" value="0" />
          <StatCard label="Quizzes Generated" value="0" />
          <StatCard label="Doubts Solved" value="0" />
          <StatCard label="Safety Moments" value="0" />
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  href
}: {
  icon: string
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      to={href}
      className="bg-white rounded-lg shadow p-6 hover:shadow-lg hover:-translate-y-1 transition"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Link>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 text-center">
      <div className="text-3xl font-bold text-safety-blue mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  )
}
