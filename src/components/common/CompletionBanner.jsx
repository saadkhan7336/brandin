// src/components/common/CompletionBanner.jsx
// Shows profile completion progress + list of missing fields
// Used at the top of ProfileSettings page

import React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function CompletionBanner({ completion, onGoToSection }) {
  if (!completion) return null;

  const { isComplete, percent, missing = [], completed, total } = completion;

  if (isComplete) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 flex items-center gap-3">
        <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-green-800">
            Profile complete!
          </p>
          <p className="text-xs text-green-600 mt-0.5">
            Your profile is visible to others and you can use all features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
      {/* Header row */}
      <div className="flex items-start gap-3">
        <AlertCircle
          size={20}
          className="text-amber-500 flex-shrink-0 mt-0.5"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-amber-900">
              Complete your profile to become visible
            </p>
            <span className="text-sm font-bold text-amber-700 flex-shrink-0">
              {percent}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-2 w-full bg-amber-200 rounded-full h-2">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>

          <p className="text-xs text-amber-700 mt-1.5">
            {completed} of {total} sections complete
          </p>
        </div>
      </div>

      {/* Missing fields */}
      {missing.length > 0 && (
        <div className="mt-3 pt-3 border-t border-amber-200">
          <p className="text-xs font-medium text-amber-800 mb-2">
            Still needed:
          </p>
          <ul className="space-y-1">
            {missing.map((field) => (
              <li
                key={field}
                className="flex items-center gap-2 text-xs text-amber-700"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                {field}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
