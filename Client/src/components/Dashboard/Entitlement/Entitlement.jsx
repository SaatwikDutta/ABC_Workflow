import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const ENTITLEMENT_TYPES = [
  { key: "sampling",         label: "Sampling"          },
  { key: "mobile-internet",  label: "Mobile / Internet"  },
];

export default function Entitlement() {
  const { divisionName } = useParams();
  const navigate         = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white p-10">
      <h1 className="text-4xl font-bold text-center mb-2 text-purple-700 drop-shadow-md">
        Entitlements
      </h1>
      <p className="text-center text-gray-500 mb-10">{divisionName}</p>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ENTITLEMENT_TYPES.map((type) => (
          <Card
            key={type.key}
            onClick={() => navigate(`/${divisionName}/entitlement/${type.key}`)}
            className="shadow-lg rounded-2xl hover:scale-[1.02] transition-all cursor-pointer border border-purple-200"
          >
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold text-purple-700">{type.label}</h2>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end max-w-4xl mx-auto mt-8">
        <button
          onClick={() => navigate(`/${divisionName}`)}
          className="bg-purple-500 rounded px-5 py-3 font-bold text-white hover:-translate-y-1 transition-all duration-200"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}