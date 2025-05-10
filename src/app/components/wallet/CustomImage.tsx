import { ImageProps } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import classnames from "classnames";
import React from "react";

export default function CustomImage({ className, ...props }: ImageProps) {
  return (
    <Image
      width={props?.width ?? 0}
      height={props?.height ?? 0}
      sizes="100vw"
      className={classnames("w-[auto] h-[auto]", className)}
      {...props}
      alt=""
    />
  );
}
