import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Users, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { statisticsApi } from "@/services/statisticsApi";

const numberColors = [
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-yellow-100 text-yellow-800",
  "bg-purple-100 text-purple-800",
  "bg-pink-100 text-pink-800",
  "bg-indigo-100 text-indigo-800",
  "bg-teal-100 text-teal-800",
];

const AdminDashboard = () => {
  const { isAdmin, isEditor } = useAuth();
  const [userStats, setUserStats] = useState(null);
  const [listingStats, setListingStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (isAdmin) {
          const usersData = await statisticsApi.getStatsUsers();
          setUserStats(usersData);
        }

        if (isAdmin || isEditor) {
          const listingsData = await statisticsApi.getStatsListings();
          setListingStats(listingsData);
        }
      } catch (error) {
        console.error("Failed to fetch statistics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAdmin, isEditor]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">Welcome to the admin panel</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* --- Users Statistics Section --- */}
          {isAdmin && userStats && (
            <div className="space-y-2">
              <h2 className="text-l font-semibold text-muted-foreground">
                Users Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(userStats).map(([key, value], index) => (
                  <Card key={key} className="bg-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </CardTitle>
                      <Users className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`text-2xl font-bold px-4 py-2 rounded-lg inline-block ${
                          numberColors[index % numberColors.length]
                        }`}
                      >
                        {value}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* --- Listings Statistics Section --- */}
          {listingStats && (
            <div className="space-y-2">
              <h2 className="text-l font-semibold text-muted-foreground">
                Listings Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(listingStats).map(([key, value], index) => (
                  <Card key={key} className="bg-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </CardTitle>
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`text-2xl font-bold px-4 py-2 rounded-lg inline-block ${
                          numberColors[index % numberColors.length]
                        }`}
                      >
                        {value}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
