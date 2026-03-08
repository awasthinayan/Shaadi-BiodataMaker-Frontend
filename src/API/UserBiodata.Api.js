import api from "./Api.Config";

const buildFormData = (data) => {
  const formData = new FormData();

  const photoFile = data?.personal?.profilePhoto instanceof File
    ? data.personal.profilePhoto
    : null;

  // Deep clone via JSON to strip File objects (they serialize to {})
  // Then explicitly set profilePhoto to existing URL string or empty string
  const jsonData = JSON.parse(JSON.stringify({
    ...data,
    personal: {
      ...data?.personal,
      profilePhoto: photoFile
        ? ''                                          // new file → cleared, multer sets URL
        : (typeof data?.personal?.profilePhoto === 'string'
            ? data.personal.profilePhoto              // existing Cloudinary URL → keep
            : ''),                                    // anything else (File/object) → clear
    },
  }));

  formData.append('biodataData', JSON.stringify(jsonData));

  if (photoFile) {
    formData.append('profilePhoto', photoFile);
  }

  return formData;
};

export const Biodata = {

  CreateBiodata: async (data) => {
    return api.post('/biodata', buildFormData(data));
  },

  GetAllBiodata: async () => {
    return api.get('/biodata');
  },

  GetBiodataById: async (id) => {
    return api.get(`/biodata/${id}`);
  },

  UpdateBiodata: async ({ id, data }) => {
    return api.put(`/biodata/${id}`, buildFormData(data));
  },

  DeleteBiodata: async (id) => {
    return api.delete(`/biodata/${id}`);
  },

  UpdateTemplateBiodata: async ({ id, data }) => {
    return api.patch(`/biodata/${id}/template`, data);
  },

};