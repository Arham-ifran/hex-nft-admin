var CryptoJS = require("crypto-js");
var dataEncryptionKey = 'mAeUgGaKaDdDaKuGEnC123';
module.exports = {
    ENV: {
        appName: process.env.REACT_APP_NAME,
        url: process.env.REACT_APP_BASE_URL,
        nftContractAddress: process.env.REACT_APP_NFT_CONTRACT_ADDRESS,
        assetUrl: process.env.REACT_APP_BASE_URL,
        currency: process.env.REACT_APP_CURRENCY,
        adminUrl: process.env.REACT_ADMIN_URL,
        requiredChainName: process.env.REACT_APP_REQUIRED_CHAIN_NAME,
        requiredChainId: parseInt(process.env.REACT_APP_REQUIRED_CHAIN),

        // Headers
        Authorization: `Bearer ${process.env.REACT_APP_AUTHORIZATION}`,
        x_auth_token: process.env.REACT_APP_X_AUTH_TOKEN,

        web3ProviderAddress: process.env.REACT_APP_WEB3_PROVIDER_ADDRESS,

        uploadedImgPath: `${process.env.REACT_APP_ASSETS_BASE_URL}images/`,

        siteUrl: process.env.REACT_APP_ASSETS_BASE_URL,

        secretKey: process.env.REACT_APP_SECRET_KEY,

        //set user in local storage
        encryptUserData: function (data) {
            data = JSON.stringify(data);
            var encryptedUser = CryptoJS.AES.encrypt(data, dataEncryptionKey).toString();
            localStorage.setItem('encuse', encryptedUser);
            return true;
        },

        //set active user type in local storage
        encryptActiveUserType: function (data) {
            data = JSON.stringify(data);
            var encryptedUser = CryptoJS.AES.encrypt(data, dataEncryptionKey).toString();
            localStorage.setItem('aut', encryptedUser);
            return true;
        },

        getRoleId: function () {
            let roleEncrypted = localStorage.getItem('role');
            if (roleEncrypted) {
                let role = '';
                let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, ENV.secretKey).toString(CryptoJS.enc.Utf8);
                if (roleDecrypted && roleDecrypted.trim() !== "") {
                    role = JSON.parse(roleDecrypted);
                }
                return role !== '' ? role._id : null;
            }
            return null;
        },

        //get active user type from local storage
        getActiveUserType: function () {
            let userTypeData = localStorage.getItem('aut');
            if (userTypeData) {
                var bytes = CryptoJS.AES.decrypt(userTypeData, dataEncryptionKey);
                var userType = bytes.toString(CryptoJS.enc.Utf8);
                return parseInt(userType);
            }
            return 0;
        },

        //decode passed data
        decodePassedData: function (data) {
            var bytes = CryptoJS.AES.decrypt(data, dataEncryptionKey);
            var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
            return decryptedData;
        },

        //return required keys
        getUserKeys: function (keys = null) {
            let userData = localStorage.getItem('encuse');
            if (userData) {
                var bytes = CryptoJS.AES.decrypt(userData, dataEncryptionKey);
                var originalData = bytes.toString(CryptoJS.enc.Utf8);
                originalData = JSON.parse(originalData);
                let user = {};
                if (keys) {
                    keys = keys.split(" ");
                    for (let key in keys) {
                        let keyV = keys[key];
                        user[keyV] = originalData[keyV];
                    }
                }
                else {
                    user = originalData;
                }
                return user;
            } else {
                return {};
            }

        },

        //clear everything from localstorage
        clearStorage: function () {
            localStorage.removeItem('encuse');
            localStorage.removeItem('aut');
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('userID');
            localStorage.removeItem('accessToken');
        },

        objectToQueryString: function (body) {
            const qs = Object.keys(body).map(key => `${key}=${body[key]}`).join('&');
            return qs;
        },

        // strong password regex
        strongPassword: new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"),
        strongPasswordMsg: 'Password must contain Upper Case, Lower Case , a Special Character , a Number and must be at least 8 characters in length.',

        // strong password regex for student
        stdStrongPassword: new RegExp('^.{8,}$'),
        stdStrongPasswordMsg: 'Password must be of at least 8 characters.',

        // cdn base url
        cdnBaseUrl: 'https://d206oo7zkzq77l.cloudfront.net',

        isValidImageType: function (file) {
            if (file && file.type) {
                const acceptableTypes = ['image/png', 'image/x-png', 'image/jpeg', 'image/jpg']
                return (acceptableTypes.includes(file.type.toLowerCase()))
            }
        },

        integerNumberValidator: function (e) {
            // Allow: backspace, delete, tab, escape, enter and .
            const specialKeys = [46, 8, 9, 27, 13, 110]

            // Allow: Ctrl+A,Ctrl+C,Ctrl+V, Command+A
            if (specialKeys.includes(e.keyCode) ||
                // Allow: Ctrl+A,Ctrl+C,Ctrl+Z,Ctrl+X Command+A
                ((e.keyCode === 65 || e.keyCode === 67 || e.keyCode === 90 || e.keyCode === 88) && (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: home, end, left, right, down, up
                (e.keyCode >= 35 && e.keyCode <= 40)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        },

        truncTextareaLength: (val, maxlength = 150) => {
            // maxlength = 150

            if (val.length > maxlength) {
                val = (val.substring(0, maxlength)).concat('...')
            } else if ((val.match(/\n/g) || []).length) {
                let values = val.split('\n')

                if (values && values.length && values[0] !== '\n')
                    val = values[0].concat('...')
            }

            return val
        },
        nftFileTypes: [
            {
                mediaType: 1,
                supportedExtensions: ['bmp', 'gif', 'ico', 'jpeg', 'jpg', 'png', 'ps', 'svg', 'tif', 'tiff'],
                btnText: '',
            },
            {
                mediaType: 2,
                supportedExtensions: ['aif', 'aiff', 'cda', 'mid', 'midi', 'mp3', 'mpa', 'ogg', 'wav', 'wma', 'wpl'],
                btnText: '',
            },
            {
                mediaType: 3,
                supportedExtensions: ['arj', '7z', 'deb', 'pkg', 'rar', 'rpm', 'tar.gz', 'tar', 'z', 'zip'],
                btnText: 'Download Compressed File',
            },
            {
                mediaType: 4,
                supportedExtensions: ['bin', 'dmg', 'iso', 'toast', 'vcd'],
                btnText: 'View Disc Image File',
            },
            {
                mediaType: 5,
                supportedExtensions: ['csv', 'dat', 'db', 'dbf', 'log', 'mdb', 'sav', 'sql', 'xml'],
                btnText: 'View Database File',
            },
            ,
            {
                mediaType: 6,
                supportedExtensions: ['email', 'eml', 'emlx', 'msg', 'oft', 'ost', 'pst', 'vcf'],
                btnText: 'View Email',
            },
            {
                mediaType: 7,
                supportedExtensions: ['apk', 'bat', 'cgi', 'pl', 'com', 'exe', 'gadget', 'jar', 'wsf'],
                btnText: 'View Executable File',
            },
            ,
            {
                mediaType: 8,
                supportedExtensions: ['asp', 'aspx', 'cer', 'crt', 'cfm', 'css', 'html', 'htm', 'jsp', 'part', 'rss', 'xhtml'],
                btnText: 'View Web File',
            },
            {
                mediaType: 9,
                supportedExtensions: ['key', 'odp', 'db', 'pps', 'ppt', 'pptx'],
                btnText: 'View Presentation',
            },
            ,
            {
                mediaType: 10,
                supportedExtensions: ['fnt', 'fon', 'otf', 'ttf'],
                btnText: 'View Font File',
            },
            {
                mediaType: 11,
                supportedExtensions: ['c', 'cgi', 'pl', 'class', 'cpp', 'cs', 'h', 'java', 'php', 'py', 'sh', 'swift', 'vb', 'js'],
                btnText: 'View Programming File',
            },
            ,
            {
                mediaType: 12,
                supportedExtensions: ['ods', 'xls', 'xlsm', 'xlsx'],
                btnText: 'View SpreadSheet',
            },
            {
                mediaType: 13,
                supportedExtensions: ['bak', 'cab', 'cfg', 'cpl', 'cur', 'dll', 'dmp', 'drv', 'icns', 'ini', 'lnk', 'msi', 'sys', 'tmp'],
                btnText: 'View System File',
            },
            {
                mediaType: 14,
                supportedExtensions: ['3g2', '3gp', 'avi', 'flv', 'h264', 'm4v', 'mkv', 'mov', 'mp4', 'mpg', 'mpeg', 'rm', 'swf', 'vob', 'wmv'],
                btnText: '',
            },
            {
                mediaType: 15,
                supportedExtensions: ['doc', 'docx', 'odt', 'pdf', 'rtf', 'tex', 'txt', 'wpd'],
                btnText: 'View Text File',
            },
            {
                mediaType: 16,
                supportedExtensions: ['psd', 'ai'],
                btnText: 'Download File',
            },

        ]
    }
}