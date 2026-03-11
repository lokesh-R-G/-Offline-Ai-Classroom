import { useState } from 'react'
import { analyzeNotes } from '../services/api'

export default function NotesUpload() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!title || !content) {
      alert('Please fill in both title and content')
      return
    }

    setLoading(true)
    try {
      const response = await analyzeNotes(title, content)
      setAnalysis(response.data)
    } catch (error) {
      console.error('Error analyzing notes:', error)
      alert('Failed to analyze notes')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Upload Study Notes</h1>
        <p className="text-gray-600">Upload your notes and get AI-powered analysis</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Note Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Chapter 5: Photosynthesis"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-safety-blue"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Note Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste or type your study notes here..."
            rows={10}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-safety-blue"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-safety-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? 'Analyzing...' : 'Analyze Notes'}
        </button>
      </div>

      {analysis && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-2xl font-bold">Analysis Results</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-safety-blue">
                {analysis.analysis?.word_count}
              </div>
              <div className="text-sm text-gray-600">Words</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-safety-blue">
                {analysis.analysis?.estimated_read_time} min
              </div>
              <div className="text-sm text-gray-600">Read Time</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-safety-blue">
                {analysis.analysis?.key_concepts?.length}
              </div>
              <div className="text-sm text-gray-600">Concepts</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-safety-blue">
                {(analysis.analysis?.complexity_score * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Complexity</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Key Concepts</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.analysis?.key_concepts?.map((concept: string, idx: number) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-safety-blue px-3 py-1 rounded-full text-sm"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Summary</h3>
            <p className="text-gray-700">{analysis.analysis?.summary}</p>
          </div>
        </div>
      )}
    </div>
  )
}
