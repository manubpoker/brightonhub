import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
}

export function ErrorState({
  title = 'Unable to load data',
  message = 'Please try again later.',
}: ErrorStateProps) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-lg font-medium text-gray-600">{title}</p>
        <p className="text-gray-500 mt-1">{message}</p>
      </CardContent>
    </Card>
  );
}
