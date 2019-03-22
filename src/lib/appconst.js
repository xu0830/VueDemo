var url = '';
process.env.NODE_ENV === 'development' ?  url = "http://localhost:63661"
    : url = "http://47.107.143.99:8085";

const AppConsts = {
    authorization:{
        encrptedAuthTokenName: 'enc_auth_token'
    },
    appBaseUrl: "http://47.107.143.99:80",
    remoteServiceBaseUrl: url,

    rsaPublicKey: "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCKdCeiDDVVRZNMOk0zZzK4v4CjoxhLmoWXuVhhKoRUUoQ/bRRAUdT+PKOMOFzPyALg6OM9dRo7e6VIWjJlgzJ3dy5ASdiXSyc1Ptl0Xvy8/BJPDlLpjLUFvcj2prdAxZtnKbVGNwPCTJ+exULXgw5ZTAucZOY37cDavaL5tiebTQIDAQAB"
};
export default AppConsts;