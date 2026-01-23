type MessageBoxProps = {
  recipient?: string;
  onSend?: () => void;
};

export default function MessageBox({ recipient = "", onSend }: MessageBoxProps) {
  return (
    <section className="h-[1100px] w-[900px] rounded-[32px] bg-[#774c3d] p-[14px]">
      {/* Inner white box */}
      <div className="flex h-[1070px] flex-col rounded-[24px] bg-white p-[24px]">
        {/* Inputs */}
        <input
          type="text"
          placeholder="Recipient"
          defaultValue={recipient}
          className="mb-[12px] border-b border-gray-400 pb-[8px] text-[20px] text-gray-700 outline-none placeholder:text-gray-400"
        />

        <input
          type="text"
          placeholder="Subject"
          className="mb-[12px] border-b border-gray-400 pb-[8px] text-[20px] text-gray-700 outline-none placeholder:text-gray-400"
        />

        <textarea
          placeholder="Send a message....."
          className="flex-1 resize-none text-[18px] text-gray-700 outline-none placeholder:text-gray-400"
        />

        {/* Footer */}
        <div className="mt-[20px]">
          <button
            type="button"
            onClick={onSend}
            className="rounded-[999px] bg-[#6CB7C9] px-[24px] py-[10px] text-[18px] font-[600] text-white hover:brightness-95 transition"
          >
            Send
          </button>
        </div>
      </div>
    </section>
  );
}
