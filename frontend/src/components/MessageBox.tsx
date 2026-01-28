"use client";

import Image from "next/image";

type MessageBoxProps = {
  recipient?: string;
  onSend?: () => void;
};

export default function MessageBox({ recipient = "", onSend }: MessageBoxProps) {
  return (
    <section className="w-full max-w-[56rem] h-[70vh] max-h-[50rem] min-h-[28rem] rounded-[2rem] bg-[#774c3d] p-[0.875rem]">
      <div className="flex h-full flex-col rounded-[1.5rem] bg-white p-6 sm:p-8">
        <input
          type="text"
          placeholder="Recipient"
          defaultValue={recipient}
          className="mb-3 border-b border-gray-400 pb-2 text-base sm:text-lg text-gray-700 outline-none placeholder:text-gray-400"
        />

        <input
          type="text"
          placeholder="Subject"
          className="mb-3 border-b border-gray-400 pb-2 text-base sm:text-xl font-bold text-gray-700 outline-none placeholder:text-gray-400"
        />

        <textarea
          placeholder="Send a message....."
          className="flex-1 resize-none text-base sm:text-lg text-gray-700 outline-none placeholder:text-gray-400"
        />

        <div className="mt-5 flex justify-end">
            <button
                type="button"
                onClick={onSend}
                className="flex items-center gap-2 rounded-full bg-[#6CB7C9] px-6 py-2.5 text-base sm:text-lg font-semibold text-black-700 transition hover:brightness-95"
                >
                <span>Send</span>
                <Image
                    src="/send_icon.svg"
                    alt="Send message"
                    width={20}
                    height={20}
                    className="h-5 w-5"
                    priority
                />
            </button>
        </div>
      </div>
    </section>
  );
}
