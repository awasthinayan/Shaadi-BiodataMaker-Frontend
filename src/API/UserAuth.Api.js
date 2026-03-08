import api from "./Api.Config";

export const RegisterUser = async (data) => {
    return api.post('/user/signup', data);
}

export const LoginUser = async (data) => {
    return api.post('/user/login', data);
}

export const SendOTP = async (data) => {
    return api.post('/user/otp', data);
}

export const VerifyOTP = async (data) => {
    return api.post('/user/verifyotp', data);
}

export const ResetPassword = async (data) => {
    return api.post('/user/resetpassword', data);
}