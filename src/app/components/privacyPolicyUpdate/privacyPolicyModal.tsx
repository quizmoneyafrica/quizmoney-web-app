"use client";
import { useRef, useState } from "react";
import QmDrawer from "../drawer/drawer";

export default function PrivacyPolicyModal({
  onAccept,
  onDecline,
}: {
  onAccept: () => void;
  onDecline: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);

  const handleScroll = () => {
    const el = contentRef.current;
    if (el && el.scrollHeight - el.scrollTop === el.clientHeight) {
      setHasScrolledToEnd(true);
    }
  };

  return (
    <>
      <QmDrawer
        open
        dismissible={false}
        hideCloseBtn
        title="Updated Privacy Policy"
      >
        <div>
          <div className="bg-primary-50 p-4 rounded-lg overflow-y-scroll max-h-[80%]">
            <p>Privacy Policy</p>
            <hr />
            <div
              ref={contentRef}
              onScroll={handleScroll}
              className="h-[50dvh] overflow-y-auto p-4 bg-primary-50 rounded-lg text-sm text-[#0f0f1a] space-y-4"
            >
              <section>
                <h3 className="font-semibold mb-1">Terms of Service</h3>
                <p>
                  <strong>• Acceptance of Terms:</strong> By accessing or using
                  our services, you agree to be bound by these terms.
                </p>
                <p>
                  <strong>• Intellectual Property:</strong> All content is owned
                  by Cryplife or licensors. You may not reproduce or distribute
                  without permission.
                </p>
                <p>
                  <strong>• Limitation of Liability:</strong> Twinz is not
                  liable for indirect or consequential damages.
                </p>
              </section>
              <section>
                <h3 className="font-semibold mt-4 mb-1">Privacy Policy</h3>
                <p>
                  <strong>• Data Security:</strong> We implement
                  industry-standard measures to secure your info, but nothing is
                  100% secure.
                </p>
                <p>
                  <strong>• Your Rights:</strong> You have the right to access,
                  update, or delete your personal data.
                </p>
                <p>
                  <strong>• User Claims of Ignorance:</strong> Even with a
                  scrollable modal, a user might claim they didn’t read or
                  understand the terms.
                </p>
              </section>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button
              className="px-4 py-2 rounded-lg text-white border border-gray-400 hover:bg-gray-700"
              onClick={onDecline}
            >
              Decline
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-white ${
                hasScrolledToEnd
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
              onClick={onAccept}
              disabled={!hasScrolledToEnd}
            >
              Accept Terms
            </button>
          </div>
        </div>
      </QmDrawer>
      {/* <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center">
        <div className="bg-primary-900 rounded-xl shadow-lg w-[90%] max-w-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Terms of Service & Privacy Policy
          </h2>
          <div
            ref={contentRef}
            onScroll={handleScroll}
            className="h-60 overflow-y-auto p-4 bg-primary-50 rounded-lg text-sm text-[#0f0f1a] space-y-4"
          >
            <section>
              <h3 className="font-semibold mb-1">Terms of Service</h3>
              <p>
                <strong>• Acceptance of Terms:</strong> By accessing or using
                our services, you agree to be bound by these terms.
              </p>
              <p>
                <strong>• Intellectual Property:</strong> All content is owned
                by Cryplife or licensors. You may not reproduce or distribute
                without permission.
              </p>
              <p>
                <strong>• Limitation of Liability:</strong> Twinz is not liable
                for indirect or consequential damages.
              </p>
            </section>
            <section>
              <h3 className="font-semibold mt-4 mb-1">Privacy Policy</h3>
              <p>
                <strong>• Data Security:</strong> We implement industry-standard
                measures to secure your info, but nothing is 100% secure.
              </p>
              <p>
                <strong>• Your Rights:</strong> You have the right to access,
                update, or delete your personal data.
              </p>
              <p>
                <strong>• User Claims of Ignorance:</strong> Even with a
                scrollable modal, a user might claim they didn’t read or
                understand the terms.
              </p>
            </section>
          </div>

          <div className="flex justify-between mt-6">
            <button
              className="px-4 py-2 rounded-lg text-white border border-gray-400 hover:bg-gray-700"
              onClick={onDecline}
            >
              Decline
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-white ${
                hasScrolledToEnd
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
              onClick={onAccept}
              disabled={!hasScrolledToEnd}
            >
              Accept Terms
            </button>
          </div>
        </div>
      </div> */}
    </>
  );
}
