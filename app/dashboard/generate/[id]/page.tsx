'use client';

import React from "react";

import GeneratePage from '@/app/(main)/google-review-qr-code-generator/page';

const DashboardGeneratePage: React.FC = () => {
    return (
        <>
            <div className="mt-10">
                <GeneratePage />
            </div>
        </>
    );
};

export default DashboardGeneratePage;
