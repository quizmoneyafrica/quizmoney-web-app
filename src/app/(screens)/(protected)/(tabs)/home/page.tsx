"use client";
import { useAppSelector } from "@/app/hooks/useAuth";
import { decryptData } from "@/app/utils/crypto";
import { capitalizeFirstLetter } from "@/app/utils/utils";
import React from "react";

function HomeTab() {
	const encrypted = useAppSelector((s) => s.auth.userEncryptedData);
	const user = encrypted ? decryptData(encrypted) : null;

	console.log("USER: ", user);

	return <div>{capitalizeFirstLetter(user.firstName)}</div>;
}

export default HomeTab;
