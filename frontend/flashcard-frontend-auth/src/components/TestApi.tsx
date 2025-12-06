import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

const TestApi: React.FC = () => {
    const [result, setResult] = useState<string>('idle');

    useEffect(() => {
        (async () => {
            try {
                const res = await apiClient.get('/health');
                setResult(JSON.stringify(res.data, null, 2));
            } catch (err: any) {
                setResult('error: ' + (err.response?.data || err.message || String(err)));
            }
        })();
    }, []);

    return (
        <div style={{whiteSpace: 'pre-wrap', fontFamily: 'monospace'}}>
            <h3>API test</h3>
            <pre>{result}</pre>
        </div>
    );
};

export default TestApi;