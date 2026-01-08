import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { TitlesApi } from '../api/titles.api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/feedback/LoadingSpinner';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FileText } from 'lucide-react';
import { DataTable } from '@/components/data-table/data-table';
import { createTitleColumns } from './title-columns';

interface TitleListProps {
  organizationId: string;
}

export const TitleList: React.FC<TitleListProps> = ({ organizationId }) => {
  const { data: titles, isLoading, error } = useQuery({
    queryKey: ['titles', organizationId],
    queryFn: () => TitlesApi.getTitles(organizationId),
    enabled: !!organizationId,
  });

  const handleApprove = (id: string) => {
    // TODO: Implement approve logic
    console.log('Approve clicked for ID:', id);
  };

  const handleReject = (id: string) => {
    // TODO: Implement reject logic
    console.log('Reject clicked for ID:', id);
  };

  const columns = React.useMemo(
    () => createTitleColumns(handleApprove, handleReject),
    []
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <EmptyState
            title="Error loading titles"
            description="There was a problem loading the titles. Please try again."
            icon={FileText}
          />
        </CardContent>
      </Card>
    );
  }

  if (!titles || titles.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <EmptyState
            title="No titles yet"
            description="Generate your first batch of titles to get started."
            icon={FileText}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Titles</CardTitle>
        <CardDescription>
          {titles.length} {titles.length === 1 ? 'title' : 'titles'} available
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable 
          columns={columns} 
          data={titles}
        />
      </CardContent>
    </Card>
  );
};
