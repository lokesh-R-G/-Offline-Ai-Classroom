import { Link } from 'react-router-dom'

export default function Navigation() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-safety-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">SL</span>
            </div>
            <span className="font-bold text-lg text-gray-900">SafeLearn</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-safety-blue transition">
              Dashboard
            </Link>
            <Link to="/notes" className="text-gray-700 hover:text-safety-blue transition">
              Notes
            </Link>
            <Link to="/quiz" className="text-gray-700 hover:text-safety-blue transition">
              Quiz
            </Link>
            <Link to="/doubt-solver" className="text-gray-700 hover:text-safety-blue transition">
              Doubt Solver
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-safety-red transition flex items-center space-x-1">
                <span>Safety</span>
                <span>▼</span>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition">
                <Link to="/safety" className="block px-4 py-2 text-gray-700 hover:bg-red-50 first:rounded-t-lg">
                  Safety Tips
                </Link>
                <Link to="/emergency-contacts" className="block px-4 py-2 text-gray-700 hover:bg-red-50">
                  Emergency Contacts
                </Link>
                <Link to="/fake-call" className="block px-4 py-2 text-gray-700 hover:bg-red-50 last:rounded-b-lg">
                  Fake Call Simulator
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
