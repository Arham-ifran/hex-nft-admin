import { toast } from 'react-toastify';
import axios from "axios";
import placeholderImg from '../assets/img/placeholder.png'
let baseUrl = process.env.REACT_APP_BASE_URL;

export const axiosUpsertData = (url, body, isMultipart = false, method = 'post') => {
  return new Promise((resolve, reject) => {
    const config = {
      headers: {
        'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
      },
    };

    url = baseUrl + url;

    axios[method](url, body, config).then(
      (res) => {
        const { data } = res
        if (data.success)
          toast.success(data.message)
        else
          toast.error(data.message)

        resolve(res.data)
      },
      (error) => {
        if (error.response && error.response.data) {
          const { data } = error.response
          if (data.message)
            toast.error(data.message)
        }
        resolve(error)
      },
    );
  });
};

export const axiosGetData = (url, qs = '') => {
  return new Promise((resolve, reject) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    url = baseUrl + url;

    // if (qs)
    // url += `?${qs}`

    axios.get(url, config).then(
      (res) => {
        const { data } = res
        if (data.success)
          toast.success(data.message)
        else
          toast.error(data.message)

        resolve(data.data)
      },
      (error) => {
        if (error.response && error.response.data) {
          const { data } = error.response
          if (data.message)
            toast.error(data.message)
        }

        resolve(error)
      },
    );
  });
};

export const axiosDeleteData = (url) => {
  return new Promise((resolve, reject) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    url = baseUrl + url;

    axios.delete(url, config).then(
      (res) => {
        const { data } = res
        if (data.success)
          toast.success(data.message)
        else
          toast.error(data.message)

        resolve(data)
      },
      (error) => {
        if (error.response && error.response.data) {
          const { data } = error.response
          if (data.message)
            toast.error(data.message)
        }

        resolve(error)
      },
    );
  });
};

export const ipfsToUrl = (str) => {
  if (!!str && typeof (str) === 'object') {
    return str
  }
  if (!str || str?.trim() === '') {
    return placeholderImg
  }
  if (str.includes('ipfs://')) {
    str = str.replace('ipfs://', '')
    return `https://ipfs.io/ipfs/${str}`
  }
  return str
}
export const permissionsForComponents = [
  /**  system permissions **/

  // dashboard
  { role: 'viewDashboard', component: 'Dashboard' },

  // staff's records
  { role: 'viewStaff', component: 'Staff' },

  // users records
  { role: 'viewUsers', component: 'Users' },

  // categories
  { role: 'viewCategory', component: 'Categories' },

  // collections
  { role: 'viewCollection', component: 'Collections' },

  // NFTs
  { role: 'viewNft', component: 'NFTs' },

  // NFTs reportings
  { role: 'viewReports', component: 'NFTs Reporting' },

  // permissions
  { role: 'viewRole', component: 'Permissions' },

  // FAQs / articles
  { role: 'addFaq', component: 'Add Faq' },
  { role: 'editFaq', component: 'Edit Faq' },
  { role: 'viewFaqs', component: 'FAQS' },

  // contact
  { role: 'viewContact', component: 'Contacts' },


  // activity
  { role: 'viewActivity', component: 'Activities' },

  // settings
  { role: 'viewSetting', component: 'Settings' },

  // email-templates
  { role: 'viewEmails', component: 'Email Templates' },

  // content
  { role: 'viewContent', component: 'Content Management' },
  { role: 'addContent', component: 'Add Content' },
  { role: 'editContent', component: 'Edit Content' },

  // newsletter
  { role: 'viewNewsLetter', component: 'NewsLetter' },
]