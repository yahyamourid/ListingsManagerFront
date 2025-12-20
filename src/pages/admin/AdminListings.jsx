import React, { useState } from 'react';
import { useListings } from '@/hooks/useListings';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Search, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ListingFormModal } from '@/components/listings/ListingFormModal';
import { DeleteConfirmModal } from '@/components/listings/DeleteConfirmModal';

const AdminListings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    listings,
    loading,
    searchTerm,
    setSearchTerm,
    createListing,
    updateListing,
    deleteListing,
  } = useListings();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [deletingListing, setDeletingListing] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreateModal = () => {
    setEditingListing(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (listing) => {
    setEditingListing(listing);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (listing) => {
    setDeletingListing(listing);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (editingListing) {
        await updateListing(editingListing.id, data);
        toast({ title: 'Listing updated successfully' });
      } else {
        await createListing(data);
        toast({ title: 'Listing created successfully' });
      }
      setIsFormModalOpen(false);
      setEditingListing(null);
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingListing) return;
    setIsSubmitting(true);
    try {
      await deleteListing(deletingListing.id);
      toast({ title: 'Listing deleted successfully' });
      setIsDeleteModalOpen(false);
      setDeletingListing(null);
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Listings Management</h1>
          <p className="text-muted-foreground">Manage all property listings</p>
        </div>
        <Button onClick={handleOpenCreateModal} className="btn-gradient">
          <Plus className="w-4 h-4 mr-2" />
          Add Listing
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Beds</TableHead>
                  <TableHead>Baths</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {listing.address}
                    </TableCell>
                    <TableCell>{formatPrice(listing.asking_price || listing.sold_price || 0)}</TableCell>
                    <TableCell>{listing.bedrooms}</TableCell>
                    <TableCell>{listing.bathrooms}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          listing.is_sold
                            ? 'bg-success/20 text-success'
                            : 'bg-accent/20 text-accent'
                        }`}
                      >
                        {listing.is_sold ? 'Sold' : 'Available'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/details/${listing.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEditModal(listing)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDeleteModal(listing)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ListingFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingListing(null);
        }}
        onSubmit={handleFormSubmit}
        listing={editingListing}
        isLoading={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingListing(null);
        }}
        onConfirm={handleDeleteConfirm}
        listing={deletingListing}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default AdminListings;
