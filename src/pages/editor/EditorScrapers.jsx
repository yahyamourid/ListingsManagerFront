import React, { useEffect, useState } from "react";
import { scrapersApi } from "@/services/scrapersApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar, Database } from "lucide-react";
import formatDate from "../../utils/formateDate";

/* ---------------- HELPERS ---------------- */

const formatDateOnly = (date) => date.toISOString().split("T")[0];

const isToday = (date) => formatDateOnly(date) === formatDateOnly(new Date());

/* ---------------- COMPONENT ---------------- */

const EditorScrapers = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ---------------- FETCH ---------------- */

  const fetchScrapers = async (date) => {
    try {
      setLoading(true);
      setError(null);

      const response = await scrapersApi.getScrapersByDate(
        formatDateOnly(date)
      );

      setData(response || []);
    } catch (err) {
      setError("Failed to load scrapers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScrapers(selectedDate);
  }, [selectedDate]);

  /* ---------------- DATE CONTROLS ---------------- */

  const goPrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d);
  };

  const goNextDay = () => {
    if (isToday(selectedDate)) return;
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d);
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6 px-2 sm:px-4">
      {/* ---------------- HEADER ---------------- */}
      <div className="text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold">Scrapers Monitor</h1>
        <p className="text-sm text-muted-foreground">
          Daily scraping activity & statistics
        </p>
      </div>

      {/* ---------------- DATE CONTROLS ---------------- */}
      <Card>
        <CardContent className="pt-6">
          <div
            className="
            flex flex-col sm:flex-row
            items-center justify-center
            gap-4
          "
          >
            <Button
              variant="outline"
              size="lg"
              onClick={goPrevDay}
              className="rounded-xl px-6 w-full sm:w-auto "
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>

            <div
              className="
              flex items-center gap-3
              px-4 py-2.5
              border rounded-xl
              bg-muted/40 sm:w-auto w-full
            "
            >
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <input
                type="date"
                value={formatDateOnly(selectedDate)}
                max={formatDateOnly(new Date())}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="
                  bg-transparent
                  outline-none
                  text-sm font-medium w-full
                "
              />
            </div>

            <Button
              variant="outline"
              size="lg"
              onClick={goNextDay}
              disabled={isToday(selectedDate)}
              className="rounded-xl px-6 w-full sm:w-auto"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ---------------- LOADING ---------------- */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((scrape) => (
            <Card key={scrape.id} className="border">
              <CardHeader className="pb-2 mb-2">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 text-lg">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-accent" />
                    <span>Scrape run</span>
                  </div>
                  <span className="text-xs sm:text-sm font-normal text-muted-foreground">
                    {formatDate(scrape.date_scraped)}
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div
                  className="
                grid grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-3
                gap-3
              "
                >
                  {scrape.sites.map((site) => (
                    <div
                      key={site.name}
                      className="
                      flex justify-between items-center
                      border rounded-xl p-4
                      bg-muted/30
                      hover:bg-muted/50
                      transition
                    "
                    >
                      <div className="">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-semibold text-sm capitalize">
                            {site.name.replaceAll("_", " ")}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs">
                          <Badge className="bg-green-100 text-green-700">
                            New: {site.new}
                          </Badge>
                          <Badge className="bg-amber-100 text-amber-700">
                            Updated: {site.updated}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-col w-10 h-10 justify-center items-center gap-1 bg-gray-200 rounded-sm">
                          <span className="text-gray-600 font-bold">{site.total_retrived}</span>
                        </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ---------------- ERROR ---------------- */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* ---------------- EMPTY ---------------- */}
      {!loading && data.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No scrapers found for this date
        </div>
      )}
    </div>
  );
};

export default EditorScrapers;
