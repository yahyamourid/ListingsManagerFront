import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { 
  Calendar, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Filter, 
  Search,
  Plus,
  Edit,
  DollarSign,
  Tag,
  RefreshCw
} from 'lucide-react';
import { historyApi } from '@/services/historyApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const CHANGE_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'create', label: 'Create' },
  { value: 'update', label: 'Update' },
  { value: 'status', label: 'Status' },
  { value: 'price', label: 'Price' },
];

const PAGE_SIZES = [10, 20, 50, 100];

const getChangeTypeIcon = (type) => {
  switch (type) {
    case 'create':
      return <Plus className="w-4 h-4" />;
    case 'update':
      return <Edit className="w-4 h-4" />;
    case 'status':
      return <Tag className="w-4 h-4" />;
    case 'price':
      return <DollarSign className="w-4 h-4" />;
    default:
      return <Edit className="w-4 h-4" />;
  }
};

const getChangeTypeBadgeVariant = (type) => {
  switch (type) {
    case 'create':
      return 'default';
    case 'update':
      return 'secondary';
    case 'status':
      return 'outline';
    case 'price':
      return 'destructive';
    default:
      return 'secondary';
  }
};

export default function AdminHistory() {
  const { toast } = useToast();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc');
  const [changeType, setChangeType] = useState('all');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await historyApi.getHistory({
        page,
        pageSize,
        sortOrder,
        changeType: changeType === 'all' ? null : changeType,
        startDate: startDate ? format(startDate, 'yyyy-MM-dd') : null,
        endDate: endDate ? format(endDate, 'yyyy-MM-dd') : null,
      });
      
      const data = response.data || response;
      setHistory(data.items || []);
      setTotalPages(data.pages || 1);
      setTotalItems(data.total || 0);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load history data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortOrder, changeType, startDate, endDate, toast]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    setPage(1);
  };

  const handleChangeTypeFilter = (value) => {
    setChangeType(value);
    setPage(1);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(parseInt(value));
    setPage(1);
  };

  const handleClearFilters = () => {
    setChangeType('all');
    setStartDate(null);
    setEndDate(null);
    setSortOrder('desc');
    setPage(1);
  };

  const hasActiveFilters = changeType !== 'all' || startDate || endDate;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Listing History</h1>
          <p className="text-muted-foreground mt-1">
            Track all changes made to listings
          </p>
        </div>
        <Button onClick={fetchHistory} variant="outline" size="sm">
          <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            {/* Change Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Change Type</label>
              <Select value={changeType} onValueChange={handleChangeTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  {CHANGE_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range - Start */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">From Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[160px] justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date);
                      setPage(1);
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date Range - End */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">To Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[160px] justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date);
                      setPage(1);
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Sort Order</label>
              <Button
                variant="outline"
                onClick={handleSortToggle}
                className="w-[140px]"
              >
                {sortOrder === 'desc' ? (
                  <>
                    <ArrowDown className="w-4 h-4 mr-2" />
                    Newest First
                  </>
                ) : (
                  <>
                    <ArrowUp className="w-4 h-4 mr-2" />
                    Oldest First
                  </>
                )}
              </Button>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={handleClearFilters}
                className="text-muted-foreground"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {history.length} of {totalItems} results
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Per page:</span>
          <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map(size => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* History Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">
                  <button
                    onClick={handleSortToggle}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Date/Time
                    {sortOrder === 'desc' ? (
                      <ArrowDown className="w-4 h-4" />
                    ) : (
                      <ArrowUp className="w-4 h-4" />
                    )}
                  </button>
                </TableHead>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead>Listing</TableHead>
                <TableHead>Field</TableHead>
                <TableHead>Old Value</TableHead>
                <TableHead>New Value</TableHead>
                <TableHead>Editor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
                      <span className="text-muted-foreground">Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <p className="text-muted-foreground">No history records found</p>
                  </TableCell>
                </TableRow>
              ) : (
                history.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-mono text-sm">
                      {format(new Date(entry.timestamp), 'MMM dd, yyyy')}
                      <br />
                      <span className="text-muted-foreground">
                        {format(new Date(entry.timestamp), 'HH:mm:ss')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getChangeTypeBadgeVariant(entry.change_type)} className="gap-1">
                        {getChangeTypeIcon(entry.change_type)}
                        {entry.change_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate" title={entry.listing_address}>
                        {entry.listing_address || `Listing #${entry.listing_id}`}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">
                        {entry.field || '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">
                        {entry.old_value || '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {entry.new_value || '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{entry.editor_name}</div>
                        <div className="text-muted-foreground text-xs">{entry.editor_email}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            
            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    className="w-9"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              Last
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
