import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// User APIs
export const createUser = (name: string, email: string) =>
  api.post('/users/', { name, email })

export const getUser = (userId: number) =>
  api.get(`/users/${userId}`)

// Study Notes APIs
export const createNote = (userId: number, title: string, content: string) =>
  api.post('/notes/', { title, content }, { params: { user_id: userId } })

export const getNote = (noteId: number) =>
  api.get(`/notes/${noteId}`)

export const getUserNotes = (userId: number) =>
  api.get(`/notes/user/${userId}`)

export const analyzeNotes = (title: string, content: string) =>
  api.post('/analyze/', { title, content })

// Quiz APIs
export const generateQuiz = (noteId: number, numQuestions: number = 5, difficulty: string = 'medium') =>
  api.post('/quiz/generate/', null, {
    params: { note_id: noteId, num_questions: numQuestions, difficulty }
  })

export const getQuiz = (quizId: number) =>
  api.get(`/quiz/${quizId}`)

// Doubt Solver APIs
export const solveDoubt = (doubt: string, context?: string) =>
  api.post('/doubt/solve/', { doubt, context })

export const getSimilarDoubts = (doubt: string) =>
  api.get('/doubt/similar/', { params: { doubt } })

// Safety Module - Emergency Contacts APIs
export const createEmergencyContact = (name: string, phone: string, category: string, region?: string) =>
  api.post('/safety/emergency-contacts/', { name, phone, category, region })

export const getEmergencyContacts = (category?: string) =>
  api.get('/safety/emergency-contacts/', { params: { category } })

export const getEmergencyContact = (contactId: number) =>
  api.get(`/safety/emergency-contacts/${contactId}`)

// Safety Module - Safety Tips APIs
export const createSafetyTip = (title: string, content: string, category: string) =>
  api.post('/safety/tips/', { title, content, category })

export const getSafetyTips = (category?: string) =>
  api.get('/safety/tips/', { params: { category } })

export const getSafetyTip = (tipId: number) =>
  api.get(`/safety/tips/${tipId}`)

// Fake Call Simulation API
export const simulateFakeCall = () =>
  api.post('/safety/fake-call/')

export default api
