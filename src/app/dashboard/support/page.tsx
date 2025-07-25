import { SupportHeader } from "@/components/modules/support/support-header";
import { TicketForm } from "@/components/modules/support/ticket-form";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        <SupportHeader />

        <div className="mx-auto w-full max-w-3xl">
          <TicketForm />
        </div>

        {/* Additional resources section */}
        <div className="mx-auto w-full max-w-4xl">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="mb-3 font-semibold">📖 Popular Help Topics</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="cursor-pointer hover:text-foreground transition-colors">
                  • How to reset your password
                </li>
                <li className="cursor-pointer hover:text-foreground transition-colors">
                  • Billing and subscription questions
                </li>
                <li className="cursor-pointer hover:text-foreground transition-colors">
                  • Account security settings
                </li>
                <li className="cursor-pointer hover:text-foreground transition-colors">
                  • API documentation and examples
                </li>
              </ul>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="mb-3 font-semibold">🚀 Feature Requests</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Help us improve by suggesting new features or enhancements.
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Community votes: 247</span>
                <span className="text-blue-600 dark:text-blue-400">
                  View all →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
