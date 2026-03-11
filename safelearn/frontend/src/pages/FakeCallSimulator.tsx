import { useState } from 'react'

export default function FakeCallSimulator() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [callTime, setCallTime] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [selectedScenario, setSelectedScenario] = useState('unknown-caller')

  const scenarios = [
    {
      id: 'unknown-caller',
      title: 'Unknown Caller',
      description: 'A call from an unknown number with unclear intentions',
      script: 'Hi, is this [Your Name]? I have some important information for you...'
    },
    {
      id: 'scam-call',
      title: 'Tech Support Scam',
      description: 'Someone claiming to be from tech support',
      script: 'Hello, this is calling from Microsoft. Your computer has a virus...'
    },
    {
      id: 'impersonator',
      title: 'Authority Impersonation',
      description: 'Someone pretending to be from police or government',
      script: 'This is the police department. We need you to verify some information...'
    },
    {
      id: 'persistent-caller',
      title: 'Persistent Caller',
      description: 'Someone who keeps calling and making you uncomfortable',
      script: 'I know where you live. You need to send me money or...'
    }
  ]

  const responses = [
    'Hang up and block the number',
    'Ask for proper identification',
    'Do not provide personal information',
    'Transfer to trusted person',
    'Record the call (if legal)',
    'Report to authorities'
  ]

  const selectedScenarioObj = scenarios.find((s) => s.id === selectedScenario)

  const startCall = () => {
    setIsCallActive(true)
    setCallTime(0)
    setFeedback('')
    const interval = setInterval(() => {
      setCallTime((prev) => {
        if (prev >= 60) {
          clearInterval(interval)
          return 60
        }
        return prev + 1
      })
    }, 1000)
  }

  const endCall = () => {
    setIsCallActive(false)
  }

  const handleResponseSelect = (response: string) => {
    setFeedback(
      `Good choice! "${response}" is an appropriate response. ` +
      'Remember: Never panic, stay calm, and prioritize your safety. ' +
      'Trust your instincts and always inform trusted contacts about suspicious calls.'
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Fake Call Simulator</h1>
        <p className="text-gray-600">Practice responding to suspicious calls in a safe environment</p>
      </div>

      {!isCallActive ? (
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Select a Scenario</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario.id)}
                  className={`p-4 rounded-lg text-left transition border-2 ${
                    selectedScenario === scenario.id
                      ? 'border-safety-red bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">{scenario.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                </button>
              ))}
            </div>

            {selectedScenarioObj && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 border-l-4 border-safety-blue">
                <h3 className="font-semibold text-gray-900 mb-2">Caller Script:</h3>
                <p className="text-gray-700 italic">"{selectedScenarioObj.script}"</p>
              </div>
            )}
          </div>

          <button
            onClick={startCall}
            className="w-full bg-safety-red text-white py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition"
          >
            Start Practice Call
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          {/* Call Active Indicator */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-4 h-4 bg-safety-red rounded-full animate-pulse"></div>
              <span className="text-lg font-semibold text-safety-red">Call in Progress</span>
            </div>
            <div className="text-4xl font-bold text-gray-900">
              {Math.floor(callTime / 60)}:{(callTime % 60).toString().padStart(2, '0')}
            </div>
          </div>

          {/* Scenario Display */}
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedScenarioObj?.title}</h2>
            <p className="text-gray-600 mb-4">Incoming Call:</p>
            <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300">
              <p className="text-gray-700 italic">"{selectedScenarioObj?.script}"</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Choose Your Response:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {responses.map((response, idx) => (
                <button
                  key={idx}
                  onClick={() => handleResponseSelect(response)}
                  className="p-3 bg-blue-50 hover:bg-blue-100 border border-safety-blue text-safety-blue rounded-lg font-semibold transition text-left"
                >
                  {response}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Feedback</h3>
              <p className="text-gray-700">{feedback}</p>
            </div>
          )}

          {/* End Call Button */}
          <button
            onClick={endCall}
            className="w-full bg-gray-300 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
          >
            End Call & Try Another Scenario
          </button>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-blue-50 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Safety Tips for Calls:</h2>
        <ul className="space-y-2">
          <li className="flex gap-3">
            <span className="text-safety-blue font-bold">✓</span>
            <span className="text-gray-700">Never share personal information with unknown callers</span>
          </li>
          <li className="flex gap-3">
            <span className="text-safety-blue font-bold">✓</span>
            <span className="text-gray-700">Hang up if you feel uncomfortable</span>
          </li>
          <li className="flex gap-3">
            <span className="text-safety-blue font-bold">✓</span>
            <span className="text-gray-700">Verify caller identity through official channels</span>
          </li>
          <li className="flex gap-3">
            <span className="text-safety-blue font-bold">✓</span>
            <span className="text-gray-700">Report suspicious calls to authorities</span>
          </li>
          <li className="flex gap-3">
            <span className="text-safety-blue font-bold">✓</span>
            <span className="text-gray-700">Trust your gut feeling - if something seems off, it probably is</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
