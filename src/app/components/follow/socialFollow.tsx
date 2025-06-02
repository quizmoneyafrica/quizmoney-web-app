import { IconButton } from "@/app/(screens)/(preAuthScreen)/login/loginForm";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  XIcon,
  YoutubeIcon,
} from "@/app/icons/icons";
import { Flex } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";

function SocialFollow() {
  return (
    <div className="space-y-6">
      <p className="text-center text-[#6E7286]">Stay Connected</p>
      <Flex align="center" justify="center" wrap="wrap" gap="6">
        <Link
          href="https://www.facebook.com/share/1FhtNRrsdN/?mibextid=wwXIfr"
          target="_blank"
        >
          <IconButton>
            <FacebookIcon />
          </IconButton>
        </Link>
        <Link
          href="https://www.instagram.com/quizmoneyng?igsh=eGQ5Mnhxb2hmeDZz"
          target="_blank"
        >
          <IconButton>
            <InstagramIcon />
          </IconButton>
        </Link>
        <Link href="https://x.com/quizmoney_ng?s=21" target="_blank">
          <IconButton>
            <XIcon />
          </IconButton>
        </Link>
        <Link
          href="https://www.tiktok.com/@quizmoneyng?_t=ZM-8wmRuGpAuFa&_r=1"
          target="_blank"
        >
          <IconButton>
            <TikTokIcon />
          </IconButton>
        </Link>
        <Link
          href="https://youtube.com/@quizmoney_ng?si=9VwHSl44Coct_EC3"
          target="_blank"
        >
          <IconButton>
            <YoutubeIcon />
          </IconButton>
        </Link>
        <Link
          href="https://www.linkedin.com/in/quiz-moneyng-b1904a363?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
          target="_blank"
        >
          <IconButton>
            <LinkedInIcon />
          </IconButton>
        </Link>
      </Flex>
    </div>
  );
}

export default SocialFollow;
