'use client';

import React, { useState } from 'react';
import { X, CreditCard, Calendar, Plus } from 'lucide-react';
import { QRCode, useUpdateQRCodeMutation } from '@/store/api/qrApi';

interface AgencyBillingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  qr: QRCode;
}

const AgencyBillingDialog: React.FC<AgencyBillingDialogProps> = ({ isOpen, onClose, qr }) => {
  const [updateQR, { isLoading }] = useUpdateQRCodeMutation();

  const currentBilling = qr.agencyBilling || { planType: 'none', price: 0, nextPaymentDate: null, history: [] };
  const [planType, setPlanType] = useState<'monthly' | 'yearly' | 'none'>(currentBilling.planType || 'none');
  const [price, setPrice] = useState<number>(currentBilling.price || 0);
  const [nextPaymentDate, setNextPaymentDate] = useState<string>(
    currentBilling.nextPaymentDate ? new Date(currentBilling.nextPaymentDate).toISOString().split('T')[0] : ''
  );
  
  // Payment history form
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentNotes, setPaymentNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleUpdatePlan = async () => {
    try {
      await updateQR({
        id: qr.id,
        data: {
          agencyBilling: {
            ...currentBilling,
            planType,
            price: Number(price),
            nextPaymentDate: nextPaymentDate ? new Date(nextPaymentDate).toISOString() : null
          }
        }
      }).unwrap();
      alert('Plan updated successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to update plan');
    }
  };

  const handleRecordPayment = async () => {
    if (!paymentAmount) return alert('Enter payment amount');
    try {
      const newPayment = {
        amount: Number(paymentAmount),
        date: new Date().toISOString(),
        notes: paymentNotes
      };
      
      const newHistory = [newPayment, ...(currentBilling.history || [])];
      
      await updateQR({
        id: qr.id,
        data: {
          agencyBilling: {
            ...currentBilling,
            history: newHistory
          }
        }
      }).unwrap();
      
      setPaymentAmount('');
      setPaymentNotes('');
      alert('Payment recorded!');
    } catch (error) {
      console.error(error);
      alert('Failed to record payment');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Agency Billing & Payments</h2>
            <p className="text-sm text-gray-500 mt-1">Manage subscription for {qr.businessName}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plan Settings */}
          <div>
            <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-4">
              <CreditCard size={16} className="text-[#1A6B45]" />
              Plan Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Plan Type</label>
                <select
                  value={planType}
                  onChange={(e) => setPlanType(e.target.value as any)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#1A6B45]/20 focus:border-[#1A6B45] outline-none"
                >
                  <option value="none">None</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#1A6B45]/20 focus:border-[#1A6B45] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Next Payment Date</label>
                <input
                  type="date"
                  value={nextPaymentDate}
                  onChange={(e) => setNextPaymentDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#1A6B45]/20 focus:border-[#1A6B45] outline-none"
                />
              </div>
              <button
                onClick={handleUpdatePlan}
                disabled={isLoading}
                className="w-full bg-[#1A6B45] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#165a3a] transition-colors"
              >
                {isLoading ? 'Saving...' : 'Save Plan Settings'}
              </button>
            </div>
          </div>

          {/* Record Payment */}
          <div>
            <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-4">
              <Plus size={16} className="text-[#1A6B45]" />
              Record New Payment
            </h3>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3 mb-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-[#1A6B45]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="e.g. Paid in cash"
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-[#1A6B45]"
                />
              </div>
              <button
                onClick={handleRecordPayment}
                disabled={isLoading || !paymentAmount}
                className="w-full bg-gray-800 text-white rounded-lg py-2 text-sm font-medium hover:bg-black transition-colors disabled:opacity-50"
              >
                Record Payment
              </button>
            </div>

            <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
              <Calendar size={16} className="text-gray-400" />
              Payment History
            </h3>
            <div className="space-y-3 max-h-[200px] overflow-y-auto">
              {(currentBilling.history || []).length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No payments recorded yet.</p>
              ) : (
                (currentBilling.history || []).map((payment: any, i: number) => (
                  <div key={i} className="flex justify-between items-center bg-white p-3 border border-gray-100 rounded-lg">
                    <div>
                      <p className="font-medium text-sm text-gray-800">₹{payment.amount}</p>
                      <p className="text-xs text-gray-400">{new Date(payment.date).toLocaleDateString()}</p>
                    </div>
                    {payment.notes && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                        {payment.notes}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyBillingDialog;
