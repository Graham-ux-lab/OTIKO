import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ScannerPage() {
  const [ticketCode, setTicketCode] = useState('');
  const [validationResult, setValidationResult] = useState<any>(null);

  const validateTicket = () => {
    // Demo validation
    if (ticketCode === 'VALID-TICKET-123') {
      setValidationResult({
        status: 'VALID',
        message: 'VALID TICKET',
        subMessage: 'Welcome to the event!',
        ticket: {
          event: 'Kenya Music Festival 2026',
          customer: 'John Doe',
          type: 'VIP',
          ticketId: 'TKT-001',
        }
      });
    } else if (ticketCode === 'USED-TICKET-456') {
      setValidationResult({
        status: 'USED',
        message: 'TICKET ALREADY USED',
        subMessage: 'This ticket has already been scanned',
      });
    } else {
      setValidationResult({
        status: 'INVALID',
        message: 'INVALID TICKET',
        subMessage: 'This ticket does not exist or is invalid',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">OTIKO</Link>
          <div className="flex gap-4">
            <Link to="/organizer" className="text-gray-700">Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Ticket Scanner</h1>
          
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Ticket Code or Scan QR
            </label>
            <input
              type="text"
              placeholder="e.g., VALID-TICKET-123"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value)}
            />
            <button
              onClick={validateTicket}
              className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Validate Ticket
            </button>
          </div>

          {validationResult && (
            <div className={`rounded-lg p-6 ${validationResult.status === 'VALID' ? 'bg-green-100 text-green-800' : validationResult.status === 'USED' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold">
                  {validationResult.message}
                </div>
                <p className="text-gray-600">{validationResult.subMessage}</p>
                
                {validationResult.ticket && (
                  <div className="mt-4 p-4 bg-white rounded-lg">
                    <h3 className="font-bold text-lg">{validationResult.ticket.event}</h3>
                    <p className="text-gray-600">Customer: {validationResult.ticket.customer}</p>
                    <p className="text-gray-600">Ticket Type: {validationResult.ticket.type}</p>
                    <p className="text-gray-600">Ticket ID: {validationResult.ticket.ticketId}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Test Codes:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>[✓] Valid: VALID-TICKET-123</li>
              <li>[!] Used: USED-TICKET-456</li>
              <li>[✗] Invalid: Any other code</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
