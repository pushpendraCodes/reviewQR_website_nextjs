'use client';

import React from "react";

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsRow from '@/components/dashboard/StatsRow';
import ScanActivityChart from '@/components/dashboard/ScanActivityChart';
import GoogleRatingPanel from '@/components/dashboard/GoogleRatingPanel';
import ReviewFunnel from '@/components/dashboard/ReviewFunnel';
import RecentReviews from '@/components/dashboard/RecentReviews';
import QRStandeesList from '@/components/dashboard/QRStandeesList';
import PlanGate from '@/components/dashboard/PlanGate';
import PlanInfoBanner from '@/components/dashboard/PlanInfoBanner';

const DashboardPage: React.FC = () => {
    return (
        <>
            <PlanGate requiredPlan="pro" featureName="Dashboard Analytics">
                {/* Page Header */}
                <DashboardHeader />

                <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 flex flex-col gap-4 sm:gap-5">
                    {/* Plan Info Banner for free users */}
                    <PlanInfoBanner />

                    {/* Stats Row */}
                    <StatsRow />

                    {/* Middle Row: Chart + Google Rating */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2">
                            <ScanActivityChart />
                        </div>
                        <div className="lg:col-span-1">
                            <GoogleRatingPanel />
                        </div>
                    </div>

                    {/* Bottom Middle Row: Review Funnel + Recent Reviews */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2">
                            <ReviewFunnel />
                        </div>
                        <div className="lg:col-span-1">
                            <RecentReviews />
                        </div>
                    </div>

                    {/* QR Standees */}
                    <QRStandeesList />
                </div>
            </PlanGate>
        </>
    );
};


export default DashboardPage;