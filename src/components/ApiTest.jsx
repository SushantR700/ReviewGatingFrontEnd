import React, { useState } from 'react';
import api from '../services/api';

const ApiTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const runTest = async (testName, url) => {
    try {
      console.log(`Testing ${testName}: ${url}`);
      const response = await api.get(url);
      return {
        name: testName,
        url: url,
        status: 'SUCCESS',
        data: response.data,
        statusCode: response.status
      };
    } catch (error) {
      console.error(`Test ${testName} failed:`, error);
      return {
        name: testName,
        url: url,
        status: 'FAILED',
        error: error.message,
        statusCode: error.response?.status || 'N/A'
      };
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    const tests = [
      { name: 'Health Check', url: '/api/test/health' },
      { name: 'Public Test', url: '/api/test/public' },
      { name: 'Get All Businesses', url: '/api/businesses' },
      { name: 'Auth Status', url: '/api/auth/status' }
    ];

    const results = [];
    for (const test of tests) {
      const result = await runTest(test.name, test.url);
      results.push(result);
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">API Connection Test</h3>
      
      <button
        onClick={runAllTests}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Testing...' : 'Run API Tests'}
      </button>

      {testResults.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold mb-3">Test Results:</h4>
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  result.status === 'SUCCESS'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{result.name}</span>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      result.status === 'SUCCESS'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {result.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <p>{result.url} - Status: {result.statusCode}</p>
                  {result.status === 'FAILED' && (
                    <p className="text-red-600">Error: {result.error}</p>
                  )}
                  {result.data && (
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiTest;