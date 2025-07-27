import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomeModalProps {
  onClose: () => void;
}

export default function WelcomeModal({ onClose }: WelcomeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-100001 bg-opacity-40 backdrop-blur-sm flex items-center justify-center px-4 sm:px-6"
        onClick={handleOverlayClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={modalRef}
          className="relative bg-white rounded-xl w-full max-w-5xl shadow-xl grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:p-6 max-h-screen overflow-y-auto"
          initial={{ scale: 0.95, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 text-black font-bold w-14 h-14 sm:w-14 sm:h-14 flex items-center justify-center hover:bg-gray-200 text-lg sm:text-xl"
          >
            ✕
          </button>

          {/* Table Section */}
          <div className="lg:col-span-2 bg-[#EDF8F9] rounded-lg p-4 sm:p-6 overflow-y-auto">
            <table className="w-full text-left border-separate border-spacing-y-1 text-sm sm:text-base">
              <thead>
                <tr className="text-xl sm:text-2xl font-bold text-gray-900">
                  <th className="pb-2 sm:pb-4 text-center">RANK</th>
                  <th className="pb-2 sm:pb-4 text-center">SALES PERSON</th>
                  <th className="pb-2 sm:pb-4 text-center">TOTAL SALES MTD</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(8)].map((_, i) => {
                  const isTop4 = i < 4;
                  const amount = i < 5 ? "$89,000" : "$59,000";
                  const color = isTop4 ? "text-green-700" : "text-red-500";
                  return (
                    <tr
                      key={i}
                      className={`text-base sm:text-xl font-semibold ${color} border-b border-gray-300`}
                    >
                      <td className="py-2 sm:py-3 pl-2 border-b border-black text-center">{i + 1}</td>
                      <td className="py-2 sm:py-3 border-b border-black text-center">Ryan Fridley</td>
                      <td className="py-2 sm:py-3 border-b border-black text-center">{amount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col justify-between gap-2">
            {/* Top Performer Box */}
            <div className="bg-[#EDF8F9] rounded-2xl p-2 sm:p-6 text-center flex flex-col items-center justify-center min-h-[200px]">
              <p className="text-lg sm:text-4xl font-bold mb-2 sm:mb-4">Top Performer</p>
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-white text-4xl sm:text-6xl mb-2 sm:mb-3">
                <img src="./images/profile-picture-icon.png" alt="" />
              </div>
              <p className="text-base sm:text-xl font-semibold">Ryan Fridley</p>
            </div>

            {/* Total Sales Box */}
            <div className="bg-[#EDF8F9] rounded-2xl p-2 sm:p-6 text-center flex flex-col items-center justify-center min-h-[200px]">
              <p className="text-lg sm:text-4xl font-bold mb-2 sm:mb-4">Total Sales</p>
              <div className="w-20 h-20 sm:w-42 sm:h-28 text-4xl sm:text-6xl text-blue-500 flex items-center justify-center mb-2 sm:mb-3">
                <img src="./images/sales-icon.jpeg" className="w-60 h-20" alt="" />
              </div>
              <p className="text-base sm:text-2xl font-semibold">$227,573</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
