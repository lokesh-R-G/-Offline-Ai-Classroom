import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Dashboard from './pages/Dashboard'
import NotesUpload from './pages/NotesUpload'
import QuizPage from './pages/QuizPage'
import DoubtSolver from './pages/DoubtSolver'
import SafetyModule from './pages/SafetyModule'
import EmergencyContacts from './pages/EmergencyContacts'
import FakeCallSimulator from './pages/FakeCallSimulator'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/notes" element={<NotesUpload />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/doubt-solver" element={<DoubtSolver />} />
            <Route path="/safety" element={<SafetyModule />} />
            <Route path="/emergency-contacts" element={<EmergencyContacts />} />
            <Route path="/fake-call" element={<FakeCallSimulator />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
