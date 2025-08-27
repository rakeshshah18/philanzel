import axios from 'axios';

const API_URL = '/api/sections';

export const createSection = async (sectionData) => {
    const res = await axios.post(API_URL, sectionData);
    return res.data;
};

export const getAllSections = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};

export const getSectionById = async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
};

export const updateSection = async (id, sectionData) => {
    const res = await axios.put(`${API_URL}/${id}`, sectionData);
    return res.data;
};

export const deleteSection = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
};
