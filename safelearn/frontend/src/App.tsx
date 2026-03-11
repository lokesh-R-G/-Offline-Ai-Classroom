import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import NotesUpload from './pages/NotesUpload'
import QuizPage from './pages/QuizPage'
import DoubtSolver from './pages/DoubtSolver'
import WomenSafety from './pages/WomenSafety'
import SafetyModule from './pages/SafetyModule'
import EmergencyContacts from './pages/EmergencyContacts'
import FakeCallSimulator from './pages/FakeCallSimulator'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <main className="md:ml-64 mt-16 md:mt-0 p-4 md:p-8 min-h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/notes" element={<NotesUpload />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/doubt-solver" element={<DoubtSolver />} />
            <Route path="/women-safety" element={<WomenSafety />} />
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
