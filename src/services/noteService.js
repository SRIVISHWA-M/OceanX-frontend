import api from './api';

/**
 * Upload a file note (PDF, Word, Image)
 * @param {FormData} formData 
 */
export const uploadNoteFile = async (formData) => {
    try {
        const response = await api.post('/notes/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to upload file note:', error);
        throw error;
    }
};

/**
 * Create a text note
 * @param {Object} noteData { title, content, type }
 */
export const uploadNoteText = async (noteData) => {
    try {
        const response = await api.post('/notes/text', noteData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to upload text note:', error);
        throw error;
    }
};

/**
 * Fetch all notes for the user
 * @param {string} search 
 */
export const fetchNotes = async (search = '', type = 'all') => {
    try {
        const response = await api.get(`/notes?search=${search}&type=${type}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch notes:', error);
        throw error;
    }
};

/**
 * Fetch a single note by ID
 * @param {string} id 
 */
export const fetchNoteById = async (id) => {
    try {
        const response = await api.get(`/notes/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch note by ID:', error);
        throw error;
    }
};

/**
 * Generate AI summary for a note
 * @param {string} id - Note ID
 */
export const generateAISummary = async (id) => {
    try {
        const response = await api.post(`/notes/${id}/summary`, {}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to generate AI summary:', error);
        throw error;
    }
};

/**
 * Generate AI quiz for a note
 * @param {string} id - Note ID
 */
export const generateAIQuiz = async (id) => {
    try {
        const response = await api.post(`/notes/${id}/quiz`, {}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to generate AI quiz:', error);
        throw error;
    }
};

/**
 * Get AI feedback for a quiz result
 * @param {string} id - Note ID
 * @param {number} score - Correct count
 * @param {number} total - Total questions
 * @param {Array} answers - Detailed answers
 */
export const getQuizFeedback = async (id, score, total, answers = []) => {
    try {
        const response = await api.post(`/notes/${id}/feedback`, { score, total, answers }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to get AI feedback:', error);
        throw error;
    }
};

const noteService = {
    uploadNoteFile,
    uploadNoteText,
    fetchNotes,
    fetchNoteById,
    generateAISummary,
    generateAIQuiz,
    getQuizFeedback,
    performOCR: async (id) => {
        try {
            const response = await api.post(`/notes/${id}/ocr`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to perform OCR:', error);
            throw error;
        }
    },
    toggleCollection: async (id) => {
        try {
            const response = await api.post(`/notes/${id}/collection`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to toggle collection:', error);
            throw error;
        }
    },
    fetchCollectionNotes: async () => {
        try {
            const response = await api.get('/notes/collection', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch collection notes:', error);
            throw error;
        }
    },
    fetchUserStats: async () => {
        try {
            const response = await api.get('/auth/stats', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch user stats:', error);
            throw error;
        }
    },
    fetchQuizHistory: async () => {
        try {
            const response = await api.get('/notes/quiz/history', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch quiz history:', error);
            throw error;
        }
    },
    fetchQuizAttemptById: async (id) => {
        try {
            const response = await api.get(`/notes/quiz/attempt/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch quiz attempt:', error);
            throw error;
        }
    }
};

export default noteService;
