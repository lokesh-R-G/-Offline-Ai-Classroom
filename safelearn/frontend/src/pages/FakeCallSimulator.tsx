import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Phone, Pause, CheckCircle2 } from 'lucide-react'

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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Fake Call Simulator</h1>
        <p className="text-lg text-gray-600 mt-2">Practice responding to suspicious calls in a safe environment</p>
      </div>

      {!isCallActive ? (
        // Scenario Selection
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Select a Scenario
            </CardTitle>
            <CardDescription>Choose a call scenario to practice your response</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Scenario Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario.id)}
                  className={`p-4 rounded-lg text-left transition border-2 ${
                    selectedScenario === scenario.id
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">{scenario.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                </button>
              ))}
            </div>

            {/* Script Preview */}
            {selectedScenarioObj && (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Caller Script</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 italic">"{selectedScenarioObj.script}"</p>
                </CardContent>
              </Card>
            )}

            {/* Start Button */}
            <Button
              onClick={startCall}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              size="lg"
            >
              <Phone className="mr-2 h-4 w-4" />
              Start Practice Call
            </Button>
          </CardContent>
        </Card>
      ) : (
        // Call Simulation
        <div className="space-y-6">
          {/* Call Timer Card */}
          <Card className="border-2 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse"></div>
                  <span className="text-lg font-semibold text-red-600">Call in Progress</span>
                </div>
                <div className="text-5xl font-bold text-gray-900 font-mono">
                  {Math.floor(callTime / 60)}:{(callTime % 60).toString().padStart(2, '0')}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Incoming Call Display */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">{selectedScenarioObj?.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-gray-600 mb-4">Incoming Call:</p>
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <p className="text-gray-700 italic text-lg">"{selectedScenarioObj?.script}"</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Response Options */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Response</CardTitle>
              <CardDescription>Select an appropriate action for this situation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {responses.map((response, idx) => (
                  <Button
                    key={idx}
                    onClick={() => handleResponseSelect(response)}
                    variant="outline"
                    className="h-auto py-3 px-4 text-left justify-start hover:bg-blue-50 hover:border-blue-300"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                    {response}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Feedback Card */}
          {feedback && (
            <Alert variant="success" className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="ml-2 text-green-800">{feedback}</AlertDescription>
            </Alert>
          )}

          {/* End Call Button */}
          <Button
            onClick={endCall}
            className="w-full"
            variant="outline"
            size="lg"
          >
            <Pause className="mr-2 h-4 w-4" />
            End Call & Try Another Scenario
          </Button>
        </div>
      )}

      {/* Safety Tips Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">💡 Safety Tips for Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {[
              'Never share personal information with unknown callers',
              'Hang up if you feel uncomfortable',
              'Verify caller identity through official channels',
              'Report suspicious calls to authorities',
              'Trust your gut feeling - if something seems off, it probably is'
            ].map((tip, idx) => (
              <li key={idx} className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
