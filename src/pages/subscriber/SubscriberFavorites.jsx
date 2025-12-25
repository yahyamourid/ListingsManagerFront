import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/listings/Pagination";
import { useFavorites } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ListingCardFavorite } from "@/components/listings/ListingCardFavorite";

import {
  Building2,
  List,
  LayoutGrid,
  LogOut,
  LayoutDashboard,
  Heart,
  User,
} from "lucide-react";
const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

const SubscriberFavorites = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isEditor, isAdmin, isSubscriber, canAccessDashboard, logout } =
    useAuth();

  const getRoleBadge = () => {
    if (isAdmin)
      return {
        label: "Admin",
        className: "bg-destructive/20 text-destructive",
      };
    if (isEditor)
      return { label: "Editor", className: "bg-accent/20 text-accent" };
    return { label: "Subscriber", className: "bg-primary/20 text-primary" };
  };

  const roleBadge = getRoleBadge();

  const {
    favorites,
    loading,
    removeFavorite,
    refetch,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
  } = useFavorites();

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await removeFavorite(favoriteId);
      toast({
        title: "Removed",
        description: "Listing removed from favorites",
      });
      refetch();
    } catch {
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-display text-foreground">
                  Listings Manager
                </h1>
                <p className="text-sm text-muted-foreground">BonMLS</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* User Info */}
              <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isAdmin
                      ? "bg-destructive"
                      : isEditor
                      ? "bg-accent"
                      : "bg-primary"
                  }`}
                />
                <span className="text-sm font-medium text-foreground">
                  {user?.name}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${roleBadge.className}`}
                >
                  {roleBadge.label}
                </span>
              </div>

              {/* Subscriber Actions */}
              {isSubscriber && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate("/favorites")}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate("/profile")}
                  >
                    <User className="w-4 h-4" />
                  </Button>
                </>
              )}

              {/* Editor/Admin Actions */}
              {(isEditor || isAdmin) && (
                <>
                  {/* <Button
                    onClick={handleOpenCreateModal}
                    className="btn-gradient"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Listing
                  </Button> */}
                  <Button
                    variant="outline"
                    onClick={() => navigate(isAdmin ? "/admin" : "/editor")}
                    className="flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate("/")}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>

              <Button variant="outline" size="icon" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto">
        <div className="flex items-center gap-4 mt-4 mx-10">
          <h1 className="text-lg font-bold flex items-center gap-2 text-red-500 bg-red-200 pl-4 pr-28 py-2 rounded-r-3xl">
            <Heart className="h-6 w-6 text-destructive" />
            My Favorites
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : favorites.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
              <p className="text-muted-foreground mb-4 text-center">
                Start adding listings to your favorites.
              </p>
              <Button onClick={() => navigate("/")}>Browse Listings</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 py-5">
              {favorites.map((item, index) => (
               <div
                    key={item.favorite_id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                 <ListingCardFavorite
                  listing={item.listing}
                  onDelete={handleRemoveFavorite}
                />
               </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(value) => {
                setItemsPerPage(value);
                setCurrentPage(1);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriberFavorites;
