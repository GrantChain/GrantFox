'use client';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';


interface Application {
  id: string;
  applicantName: string;
  type: 'loan' | 'mortgage' | 'credit' | 'business';
  status: 'approved' | 'rejected' | 'pending';
  submittedDate: string;
  amount: number;
}

interface CompletedItem {
  id: string;
  title: string;
  type: 'escrow' | 'application' | 'verification';
  completedDate: string;
  completedBy: string;
  finalAmount: number;
}


const mockApplications: Application[] = [
  {
    id: 'APP-2024-001',
    applicantName: 'John Smith',
    type: 'mortgage',
    status: 'approved',
    submittedDate: '2024-01-15',
    amount: 450000,
  },
  {
    id: 'APP-2024-002',
    applicantName: 'Sarah Johnson',
    type: 'loan',
    status: 'pending',
    submittedDate: '2024-01-18',
    amount: 25000,
  },
  {
    id: 'APP-2024-003',
    applicantName: 'Michael Brown',
    type: 'business',
    status: 'rejected',
    submittedDate: '2024-01-20',
    amount: 75000,
  },
  {
    id: 'APP-2024-004',
    applicantName: 'Emily Davis',
    type: 'credit',
    status: 'approved',
    submittedDate: '2024-01-22',
    amount: 15000,
  },
  {
    id: 'APP-2024-005',
    applicantName: 'David Wilson',
    type: 'mortgage',
    status: 'pending',
    submittedDate: '2024-01-25',
    amount: 320000,
  },
  {
    id: 'APP-2024-006',
    applicantName: 'Lisa Anderson',
    type: 'loan',
    status: 'approved',
    submittedDate: '2024-01-28',
    amount: 40000,
  },
  {
    id: 'APP-2024-007',
    applicantName: 'Robert Taylor',
    type: 'business',
    status: 'approved',
    submittedDate: '2024-01-30',
    amount: 120000,
  },
];

const mockCompletedItems: CompletedItem[] = [
  {
    id: 'ESC-2024-001',
    title: 'Property Purchase - 123 Main St',
    type: 'escrow',
    completedDate: '2024-01-10',
    completedBy: 'Agent Smith',
    finalAmount: 485000,
  },
  {
    id: 'APP-2023-145',
    title: 'Personal Loan Application',
    type: 'application',
    completedDate: '2024-01-12',
    completedBy: 'Loan Officer Jones',
    finalAmount: 28500,
  },
  {
    id: 'VER-2024-003',
    title: 'Income Verification - J. Williams',
    type: 'verification',
    completedDate: '2024-01-14',
    completedBy: 'Verification Team',
    finalAmount: 0,
  },
  {
    id: 'ESC-2024-002',
    title: 'Commercial Property Sale',
    type: 'escrow',
    completedDate: '2024-01-16',
    completedBy: 'Agent Davis',
    finalAmount: 750000,
  },
  {
    id: 'APP-2023-167',
    title: 'Business Expansion Loan',
    type: 'application',
    completedDate: '2024-01-19',
    completedBy: 'Business Advisor Brown',
    finalAmount: 95000,
  },
  {
    id: 'ESC-2024-003',
    title: 'Residential Refinance',
    type: 'escrow',
    completedDate: '2024-01-21',
    completedBy: 'Agent Wilson',
    finalAmount: 380000,
  },
];


const ApplicationsTable: React.FC = () => {
  const columnHelper = createColumnHelper<Application>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'Application ID',
        cell: (info) => (
          <span className="font-mono text-sm text-muted-foreground">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('applicantName', {
        header: 'Applicant Name',
        cell: (info) => <div className="font-medium">{info.getValue()}</div>,
      }),
      columnHelper.accessor('type', {
        header: 'Type',
        cell: (info) => (
          <Badge variant="outline" className="capitalize">
            {info.getValue()}
          </Badge>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const status = info.getValue();
          const getVariant = (status: string) => {
            switch (status) {
              case 'approved':
                return 'default';
              case 'pending':
                return 'secondary';
              case 'rejected':
                return 'destructive';
              default:
                return 'outline';
            }
          };
          return (
            <Badge variant={getVariant(status)} className="capitalize">
              {status}
            </Badge>
          );
        },
      }),
      columnHelper.accessor('submittedDate', {
        header: 'Submitted Date',
        cell: (info) => (
          <span className="text-sm text-muted-foreground">
            {new Date(info.getValue()).toLocaleDateString('en-US')}
          </span>
        ),
      }),
      columnHelper.accessor('amount', {
        header: 'Amount',
        cell: (info) => (
          <div className="text-right font-medium">
            ${info.getValue().toLocaleString('en-US')}
          </div>
        ),
      }),
    ],
    [columnHelper],
  );

  const table = useReactTable({
    data: mockApplications,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full overflow-auto">
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left font-semibold"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <svg
                      className="h-8 w-8 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <title>No applications document icon</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-muted-foreground">
                      No applications found.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const DoneTable: React.FC = () => {
  const columnHelper = createColumnHelper<CompletedItem>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'Item ID',
        cell: (info) => (
          <span className="font-mono text-sm text-muted-foreground">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('title', {
        header: 'Title',
        cell: (info) => (
          <div
            className="font-medium max-w-[200px] truncate"
            title={info.getValue()}
          >
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('type', {
        header: 'Type',
        cell: (info) => (
          <Badge variant="outline" className="capitalize">
            {info.getValue()}
          </Badge>
        ),
      }),
      columnHelper.accessor('completedDate', {
        header: 'Completed Date',
        cell: (info) => (
          <span className="text-sm text-muted-foreground">
            {new Date(info.getValue()).toLocaleDateString('en-US')}
          </span>
        ),
      }),
      columnHelper.accessor('completedBy', {
        header: 'Completed By',
        cell: (info) => <div className="text-sm">{info.getValue()}</div>,
      }),
      columnHelper.accessor('finalAmount', {
        header: 'Final Amount',
        cell: (info) => (
          <div className="text-right font-medium">
            {info.getValue() === 0
              ? '-'
              : `$${info.getValue().toLocaleString('en-US')}`}
          </div>
        ),
      }),
    ],
    [columnHelper],
  );

  const table = useReactTable({
    data: mockCompletedItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full overflow-auto">
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left font-semibold"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <svg
                      className="h-8 w-8 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <title>No completed items checkmark icon</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-muted-foreground">
                      No completed items found.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const HistoricView: React.FC = () => {
  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <svg
              className="h-5 w-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <title>Clock icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Historic Data</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          View historical applications and completed items
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Applications
              </p>
              <p className="text-3xl font-bold text-primary mt-1">
                {mockApplications.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>Application document icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <div className="flex space-x-4 text-sm mt-4">
            <span className="text-green-600">
              {
                mockApplications.filter((app) => app.status === 'approved')
                  .length
              }{' '}
              Approved
            </span>
            <span className="text-yellow-600">
              {
                mockApplications.filter((app) => app.status === 'pending')
                  .length
              }{' '}
              Pending
            </span>
            <span className="text-red-600">
              {
                mockApplications.filter((app) => app.status === 'rejected')
                  .length
              }{' '}
              Rejected
            </span>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Completed Items
              </p>
              <p className="text-3xl font-bold text-primary mt-1">
                {mockCompletedItems.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>Completed items checkmark icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="flex space-x-4 text-sm mt-4">
            <span className="text-blue-600">
              {
                mockCompletedItems.filter((item) => item.type === 'escrow')
                  .length
              }{' '}
              Escrows
            </span>
            <span className="text-purple-600">
              {
                mockCompletedItems.filter((item) => item.type === 'application')
                  .length
              }{' '}
              Applications
            </span>
            <span className="text-orange-600">
              {
                mockCompletedItems.filter(
                  (item) => item.type === 'verification',
                ).length
              }{' '}
              Verifications
            </span>
          </div>
        </div>
      </div>
      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger
            value="applications"
            className="flex items-center space-x-2"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <title>Applications tab icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Applications</span>
          </TabsTrigger>
          <TabsTrigger value="done" className="flex items-center space-x-2">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <title>Done tab icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Done</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Historical Applications</h3>
            <Badge variant="secondary">{mockApplications.length} total</Badge>
          </div>
          <ApplicationsTable />
        </TabsContent>

        <TabsContent value="done" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Completed Items</h3>
            <Badge variant="secondary">{mockCompletedItems.length} total</Badge>
          </div>
          <DoneTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HistoricView;
