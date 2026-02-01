const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getTest = async () => {
  try {
    const response = await fetch(`${API_URL}/test`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching test:', error);
    throw error;
  }
};

export const updateTest = async (testData) => {
  try {
    const response = await fetch(`${API_URL}/test`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating test:', error);
    throw error;
  }
};
