'use client';

import { useListQRCodesQuery } from "../../store/api/qrApi";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';;
import QRStandeeCard from "./QRStandeeCard";

const QRStandeesList: React.FC = () => {
    const navigate = useRouter();
    const { data, isLoading } = useListQRCodesQuery();
    const standees = data?.qrCodes || [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-[#1A6B45] animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700">Your QR standees</h2>
                <button
                    onClick={() => navigate.push("/dashboard/generate-qr")}
                    className="text-xs text-[#1A6B45] font-medium hover:underline flex items-center gap-1"
                >
                    <Plus size={13} />
                    Create new
                </button>
            </div>
            {/* 1 col on mobile, 2 on sm, 3 on lg */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {standees.length === 0 ? (
                    <div className="col-span-full py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
                        <p className="text-sm text-gray-400">No standees created yet.</p>
                        <button
                            onClick={() => navigate.push("/dashboard/generate-qr")}
                            className="mt-2 text-xs font-semibold text-[#1A6B45] hover:underline"
                        >
                            Generate your first QR standee
                        </button>
                    </div>
                ) : (
                    standees.map((standee) => (
                        <QRStandeeCard key={standee.id} standee={standee} />
                    ))
                )}
            </div>
        </div>
    );
};

export default QRStandeesList;