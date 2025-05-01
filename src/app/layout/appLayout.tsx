import React, { ReactNode } from "react";

type Props = {
	children: ReactNode;
};

const AppLayout = ({ children }: Props) => {
	return <section className="">{children}</section>;
};
export default AppLayout;
