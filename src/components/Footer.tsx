import { AlertTriangle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <span className="text-center">
            <strong>Demo only — not medical advice.</strong> In emergencies, call local medical services.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;