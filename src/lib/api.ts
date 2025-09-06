// API utility functions for SymptoScan
// These are placeholder functions that simulate backend API calls

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8000';

export interface UploadResponse {
  id: string;
  filename: string;
  status: 'processing' | 'completed' | 'error';
  message?: string;
}

export interface SummarizeResponse {
  id: string;
  summary: string;
  patientInfo: {
    name: string;
    age: number;
    gender: string;
    dateOfBirth: string;
  };
  labResults: Array<{
    test: string;
    result: string;
    reference: string;
    status: 'normal' | 'high' | 'low' | 'critical';
  }>;
}

export interface SymptomChatResponse {
  response: string;
  conditions?: string[];
  urgency?: 'low' | 'medium' | 'high';
  recommendations?: string[];
}

export interface HistoryRecord {
  id: string;
  filename: string;
  uploadDate: string;
  status: 'processed' | 'processing' | 'error';
  summary: string;
}

// Upload medical report
export async function uploadReport(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/upload-report`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

// Summarize medical report
export async function summarizeReport(reportId: string): Promise<SummarizeResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/summarize-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ report_id: reportId }),
    });

    if (!response.ok) {
      throw new Error(`Summarization failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Summarization error:', error);
    throw error;
  }
}

// Symptom chat
export async function symptomChat(message: string): Promise<SymptomChatResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/symptom-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Chat failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Chat error:', error);
    throw error;
  }
}

// Get user history
export async function getHistory(userId: string): Promise<HistoryRecord[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/history/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch history: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('History fetch error:', error);
    throw error;
  }
}

// Text-to-speech
export async function generateTTS(text: string): Promise<Blob> {
  try {
    const response = await fetch(`${API_BASE_URL}/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`TTS failed: ${response.statusText}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('TTS error:', error);
    throw error;
  }
}

// Export summary as PDF
export async function exportSummaryPDF(summaryId: string): Promise<Blob> {
  try {
    const response = await fetch(`${API_BASE_URL}/export-summary/${summaryId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`PDF export failed: ${response.statusText}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('PDF export error:', error);
    throw error;
  }
}