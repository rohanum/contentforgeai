
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-extrabold">Privacy Policy</CardTitle>
          <CardDescription>Last updated: July 2025</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none">
          <p>Your privacy matters to us. This Privacy Policy explains how ContentForge AI collects, uses, and protects your information.</p>

          <h2>1. What We Collect</h2>
          <p>We may collect:</p>
          <ul>
            <li>Your name, email, and login credentials</li>
            <li>IP address, device type, browser</li>
            <li>Content you generate, upload, or save in the platform</li>
            <li>Usage logs and analytics data</li>
          </ul>

          <h2>2. How We Use It</h2>
          <p>We use your data to:</p>
          <ul>
            <li>Provide and improve our services</li>
            <li>Offer personalized AI experiences</li>
            <li>Communicate updates and support</li>
            <li>Detect misuse or abuse</li>
          </ul>
          <p>We do <strong>not sell your data</strong> to third parties.</p>

          <h2>3. Third-Party Services</h2>
          <p>We use third-party services (e.g., Discord, Stripe, Firebase, Google Analytics) to operate the platform. These services may have their own privacy policies.</p>

          <h2>4. Cookies & Tracking</h2>
          <p>We use cookies to remember you, analyze traffic, and improve the experience. You can opt out via your browser settings.</p>

          <h2>5. Data Retention</h2>
          <p>We keep your data as long as your account is active. You can request deletion by contacting us.</p>

          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your data</li>
            <li>Correct or delete data</li>
            <li>Request that we stop using your data</li>
          </ul>
          <p>Email us at privacy@contentforge.ai to exercise your rights.</p>

          <h2>7. Security</h2>
          <p>We use encryption, secure storage, and best practices to protect your data.</p>

          <h2>8. Children</h2>
          <p>Our platform is not intended for users under 13. If we learn someone under 13 is using our services, we will remove their data.</p>
          
          <h2>9. Updates</h2>
          <p>We may update this policy from time to time. We'll notify you of significant changes.</p>

          <hr />

          <p>© 2025 ContentForge AI. All rights reserved.</p>
        </CardContent>
      </Card>
    </div>
  );
}
