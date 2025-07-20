import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MarginDisclaimer = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="h-16 w-16 border-4 border-gray-700 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle className="text-xl">High Risk Trading</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Margins trading involves substantial risk and is not suitable for all investors. Please ensure you fully understand the risks involved.
          </p>
          <button
            onClick={() => navigate("/margin-dashboard")}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            I Understand, Continue to Margins
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarginDisclaimer;
