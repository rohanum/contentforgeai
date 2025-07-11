
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-extrabold">Terms of Service</CardTitle>
          <CardDescription>Last updated: July 2025</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none">
          <p>Welcome to ContentForge AI! By using our platform, tools, or community, you agree to these Terms of Service (“Terms”). Please read them carefully.</p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using ContentForge AI, you confirm that you are at least 13 years old and agree to be bound by these Terms and our Privacy Policy.</p>
          
          <h2>2. Services</h2>
          <p>ContentForge AI provides AI-powered content generation tools, including script generators, video planning tools, and creative assets. Features may change or evolve without prior notice.</p>
          
          <h2>3. User Conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use our services for illegal, harmful, or abusive content</li>
            <li>Attempt to reverse-engineer or misuse the platform</li>
            <li>Upload or share copyrighted or offensive material</li>
          </ul>
          <p>We reserve the right to suspend accounts that violate these rules.</p>
          
          <h2>4. Intellectual Property</h2>
          <p>All ContentForge-generated assets are yours to use. However, you grant us a license to showcase public work for portfolio or promotional purposes unless you opt out.</p>
          
          <h2>5. Community Guidelines</h2>
          <p>By joining our Discord or community spaces, you agree to:</p>
          <ul>
            <li>Be respectful</li>
            <li>Not spam or harass</li>
            <li>Follow all community-specific rules</li>
          </ul>
          <p>Violation may result in bans or account suspension.</p>
          
          <h2>6. Account Termination</h2>
          <p>We may suspend or terminate accounts that breach these Terms or pose risk to our users or system.</p>
          
          <h2>7. Limitation of Liability</h2>
          <p>We do not guarantee results, uptime, or compatibility. Use ContentForge AI “as-is” and at your own risk. We are not liable for any loss or damages.</p>
          
          <h2>8. Changes to Terms</h2>
          <p>We may update these Terms from time to time. Continued use of the service means you accept the revised terms.</p>
          
          <h2>9. Contact</h2>
          <p>Questions? Email us at support@contentforge.ai</p>
          
          <hr />
          
          <p>© 2025 ContentForge AI. All rights reserved.</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Add basic prose styling to globals.css if not already present,
// or use Tailwind typography plugin for better styling.
// For now, we'll rely on default browser styles and component styles.
// A more robust solution would be to add this to globals.css:
/*
.prose h2 { @apply text-2xl font-bold mt-8 mb-4; }
.prose p, .prose ul { @apply mb-4 text-muted-foreground; }
.prose ul { @apply list-disc pl-5; }
.prose hr { @apply my-8 border-border; }
*/
