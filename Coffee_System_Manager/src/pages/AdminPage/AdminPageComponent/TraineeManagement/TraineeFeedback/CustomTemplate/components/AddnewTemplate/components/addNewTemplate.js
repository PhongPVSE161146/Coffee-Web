import { instance } from "../../Edit_Template/instan";

export const addNewTemplate = (payload) => {
    const token = sessionStorage.getItem('accessToken');
    return instance.post('/v1/feedback-template/create-template', payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  };