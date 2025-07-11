
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CookiePolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-extrabold">Cookie Policy</CardTitle>
          <CardDescription>Last updated: July 2025</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none">
            <p>This Cookie Policy explains how ContentForge AI uses cookies and similar technologies to improve your experience.</p>

            <h2>1. What Are Cookies?</h2>
            <p>Cookies are small text files stored on your browser when you visit a website. They help us recognize your browser, store preferences, and analyze site usage.</p>

            <h2>2. Types of Cookies We Use</h2>
            <ul>
                <li><strong>Essential Cookies:</strong> Required for basic functionality (e.g., login, user sessions).</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our platform (e.g., Google Analytics).</li>
                <li><strong>Preference Cookies:</strong> Store your settings, like language or theme.</li>
                <li><strong>Third-Party Cookies:</strong> Some services we use (like Firebase, Stripe, Discord OAuth) may place their own cookies.</li>
            </ul>

            <h2>3. How to Manage Cookies</h2>
            <p>You can:</p>
            <ul>
                <li>Adjust your browser settings to refuse some or all cookies</li>
                <li>Use tools like browser extensions or private browsing</li>
            </ul>
            <p>Note: Disabling cookies may limit some features of ContentForge AI.</p>

            <h2>4. Updates</h2>
            <p>We may revise this Cookie Policy from time to time. The last updated date will be posted here.</p>
            
            <hr />

            <p>Questions? Email cookies@contentforge.ai</p>
            <p>© 2025 ContentForge AI. All rights reserved.</p>
        </CardContent>
      </Card>
    </div>
  );
}
