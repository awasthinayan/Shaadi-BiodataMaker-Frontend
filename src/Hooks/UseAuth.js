import { useMutation } from "@tanstack/react-query";
import * as AuthUser from "../API/UserAuth.Api.js";

export const useRegister = () => {
    return useMutation({
        mutationFn: AuthUser.RegisterUser,
        onSuccess: () => {
            console.log("Register User Success");
        },
        onError: (error) => {
            console.log("Register User Error", error);
        },
    });
}

export const useLogin = () => {
    return useMutation({
        mutationFn: AuthUser.LoginUser,
        onSuccess: (response) => {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data)); 
            console.log("Login User Success");
        },
        onError: (error) => {
            console.log("Login User Error", error);
        },
    });
}

export const useSendOTP = () => {
    return useMutation({
        mutationFn: AuthUser.sendOTP,
        onSuccess: () => {
            console.log("send OTP Success");
        },
        onError: (error) => {
            console.log("send OTP Error", error);
        },
    });
}

export const useVerifyOTP = () => {
    return useMutation({
        mutationFn: AuthUser.VerifyOTP,
        onSuccess: () => {
            console.log("Verify OTP Success");
        },
        onError: (error) => {
            console.log("Verify OTP Error", error);
        },
    });
}

export const useResetPassword = () => {
    return useMutation({
        mutationFn: AuthUser.resetPassword,
        onSuccess: () => {
            console.log("Reset Password Success");
        },
        onError: (error) => {
            console.log("Reset Password Error", error);
        },
    });
}