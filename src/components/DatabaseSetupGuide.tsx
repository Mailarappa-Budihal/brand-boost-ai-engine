
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, ExternalLink, CheckCircle } from 'lucide-react';

export function DatabaseSetupGuide() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <Database className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl">Database Setup Required</CardTitle>
        <CardDescription>
          To use all features of PortfolioAI, you'll need to set up the required database tables in Supabase.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Required Tables:</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">profiles - User profile information</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">job_alerts - Job search preferences</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">portfolios - Portfolio content and settings</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Quick Setup:</h4>
          <ol className="text-sm space-y-1 list-decimal list-inside text-gray-600">
            <li>Go to your Supabase project dashboard</li>
            <li>Navigate to the SQL Editor</li>
            <li>Run the database migration scripts</li>
            <li>Enable Row Level Security (RLS) for all tables</li>
          </ol>
        </div>

        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <a 
              href="https://supabase.com/dashboard" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Supabase Dashboard
            </a>
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Check Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
