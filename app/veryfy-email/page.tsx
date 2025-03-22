"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";

//
// http://localhost:4000/api/v1/users/verify?token=${token}

import "react-toastify/dist/ReactToastify.css";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const VerifyToken = () => {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("loading");
  const navigation = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      const verifyAccount = async () => {
        try {
          const response = await fetch(
            `https://stock-backend-4.onrender.com/api/v1/users/verify?token=${token}`,
            {
              method: "PATCH",
            }
          );

          if (response.ok) {
            const data = await response.json();
            setStatus("verified");

            toast.success(data.message, {
              autoClose: 3000,
              hideProgressBar: true,
              position: "top-right",
            });

            setTimeout(() => {
              navigation.push("/auth/login");
            }, 3000);
          }
        } catch (error: any) {
          setStatus("expired");
          toast.error(error.message, {
            autoClose: 3000,
            hideProgressBar: true,
            position: "top-right",
          });
        }
      };

      verifyAccount();
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center flex-col justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-md p-8 w-full max-w-md">
        {status === "loading" && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: "3px",
            }}
          >
            <p>Verifying your account</p>
            <CircularProgress className="my-3" />
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={100}
              height={100}
              style={{ width: 200, height: "auto" }}
            />
          </div>
        )}
        {status === "verified" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CheckCircleOutlineIcon
              sx={{ fontSize: 100, color: "success.main" }}
            />
            <Typography variant="h5" color="success.main">
              Account Verified
            </Typography>
          </div>
        )}
        {status === "expired" && (
          <Typography variant="h5" color="error.main" className="text-center">
            Token Expired
          </Typography>
        )}
      </div>
      <p className="mt-6 text-center text-gray-600 text-sm">
        Copyright © 2024 DreamPOS. All rights reserved
      </p>
    </div>
  );
};

export default VerifyToken;
