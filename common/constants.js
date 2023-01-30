module.exports.FLEXI_API_BASE_URL = "https://console-staging.flexiloans.com";
module.exports.FLEXI_AUTH_URL = "https://auth.flexiloans.com/oauth2/token";

module.exports.FLEXI_AUTH = Object.freeze({
    Grant_Type: 'client_credentials',
    URL: this.FLEXI_AUTH_URL,
    Authorization_Key: "Basic",
    Authorization_Token: "MjEzdGwxYThucGtnc2VhMDdlcnF1ZHRmZm86aTFhdW1wYjM1dWNncTRqanJsazUxbWxlcGpjbGE3aW8zZWtpdWtrZG1uZGNsbWpiMXNm",
    Content_Type: 'application/x-www-form-urlencoded',
    Client_Id: '213tl1a8npkgsea07erqudtffo',
    Client_Secret: 'i1aumpb35ucgq4jjrlk51mlepjcla7io3ekiukkdmndclmjb1sf'
})

module.exports.FLEXI_API = Object.freeze({
    ADD_RETAILER_URL: this.FLEXI_API_BASE_URL + '/unified/lead',
    UPDATE_RETAILER_URL: this.FLEXI_API_BASE_URL + '/unified/lead/',
    UPLOAD_RETAILER_DOC_URL: this.FLEXI_API_BASE_URL + '/documentservice',
    FETCH_AGREEMENT: this.FLEXI_API_BASE_URL + '/c2w/v2/document/fetch?loanCode=',
    INITIATE_AGREEMENT: this.FLEXI_API_BASE_URL + '/c2w/v2/document/sign/init',
    SIGN_AGREEMENT: this.FLEXI_API_BASE_URL + '/c2w/v2/document/sign',
    DOWNLOAD_AGREEMENT: this.FLEXI_API_BASE_URL + '/c2w/v2/document/download/',
    CONTENT_TYPE: 'application/json',
    HTTP_VERB_GET: 'get',
    HTTP_VERB_POST: 'post',
    HTTP_VERB_PUT: 'put'
})


module.exports.RETAILER_STATUS = Object.freeze({
    DETAILS: "details",
    CONFIRMED: "confirm-details",
    OFFER_CALCULATING: "calculating",
    OFFER_ACCEPTED: 4,
    ADDED_DOCUMENTS: 5,
    ADDED_PHOTO: 6
})

module.exports.ImageValue = Object.freeze({
    PENDING: "pending",
    UPDATED: "updated"
})

module.exports.dashboardUserType = Object.freeze({
    SUPER_ADMIN: 1,
    NORMAL_USER: 99
})
