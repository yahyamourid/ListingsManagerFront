import React, { useState, useEffect } from "react";
import { listingsApi } from "@/services/listingsAPI";
import { Button } from "@/components/ui/button";
import { X, History} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import formatDate from "../../utils/formateDate";

const CHANGE_STYLE = {
  create: {
    bg: "bg-green-100",
    text: "text-green-700",
    label: "First Creation",
  },
  update: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    label: "Updated",
  },
};

export function ListingHistoryModal({ isOpen, onClose, listingId }) {
  const [loading, setLoading] = useState(false);
  const [changes, setChanges] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChanges = async () => {
      setLoading(true);
      try {
        const data = await listingsApi.getListingHistory(listingId);
        console.log(data);
        
        setChanges(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchChanges()
  }, []);

  if (!isOpen) return null;

  if (error) {
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <p className="text-muted-foreground">{error}</p>
    </div>;
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold font-display text-foreground">
            Listing Tracking Change
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <CardContent className="space-y-4">
                      {changes.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground">
                          <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          No history available
                        </div>
                      ) : (
                        changes.map((h) => {
                          const style = CHANGE_STYLE[h.change_type];
                          const isCron = h.editor_full_name === "cron-job";

                          return (
                            <div
                              key={h.id}
                              className={`border rounded-xl p-4 space-y-3
                                ${
                                  isCron
                                    ? "border-accent/30 bg-yellow-50/40"
                                    : "border-violet-600/30 bg-violet-50/30"
                                }`}
                            >
                              {/* ---- HISTORY HEADER ---- */}
                              <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-2">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-semibold ${style.bg} ${style.text}`}
                                  >
                                    {style.label}
                                  </span>

                                  <span
                                    className={`text-xs font-bold uppercase ${
                                      isCron
                                        ? "text-accent"
                                        : "text-violet-600"
                                    }`}
                                  >
                                    By {h.editor_full_name}
                                  </span>
                                </div>

                                <span className="text-xs text-muted-foreground">
                                  {formatDate(h.changed_at)}
                                </span>
                              </div>

                              {/* ---- CREATE ---- */}
                              {h.change_type === "create" && (
                                <p className="text-sm text-muted-foreground italic">
                                  Listing created by {h.editor_full_name}
                                </p>
                              )}

                              {/* ---- UPDATE (ONLY THIS SCROLLS) ---- */}
                              {h.change_type === "update" &&
                                h.changes?.length > 0 && (
                                  <div className="w-full max-w-full overflow-hidden">
                                    <div
                                      className="
                                        flex gap-3
                                        overflow-x-auto
                                        max-w-full
                                        pb-2
                                        scrollbar-thin
                                        scrollbar-thumb-muted-foreground/30
                                      "
                                    >
                                      {h.changes.map((c, idx) => (
                                        <div
                                          key={idx}
                                          className="
                                            flex-shrink-0
                                            w-[220px]
                                            max-w-[220px]
                                            border
                                            rounded-lg
                                            p-3
                                            bg-muted/30
                                            overflow-hidden
                                          "
                                        >
                                          <p className="text-xs text-muted-foreground mb-1 truncate">
                                            {c.attribute}
                                          </p>

                                          <p className="text-sm font-medium break-words">
                                            <span className="line-through text-red-500 break-words">
                                              {String(c.old_value)}
                                            </span>
                                            <span className="mx-1">→</span>
                                            <span className="text-green-600 break-words">
                                              {String(c.new_value)}
                                            </span>
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                            </div>
                          );
                        })
                      )}
                    </CardContent>
          </div>
        )}
      </div>
    </div>
  );
}
