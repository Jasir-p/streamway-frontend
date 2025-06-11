import { useState } from "react";
import { Copy, Check, Link } from "lucide-react";

const LinkCopyComponent = ({ 
  linkUrl = "https://example.com/lead-form", 
  linkTitle = "Lead Form Link"
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(linkUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <Link className="w-5 h-5" />
          {linkTitle}
        </h3>
      </div>

      {/* Link Display Area */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Form URL:
        </label>
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border">
          <input
            type="text"
            value={linkUrl}
            readOnly
            className="flex-1 bg-transparent text-sm text-gray-600 focus:outline-none"
          />
          <button
            onClick={copyToClipboard}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              copied 
                ? 'bg-green-100 text-green-700' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Additional Options */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <span className="text-sm text-gray-700">Share this form</span>
          <button
            onClick={copyToClipboard}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Copy Link
          </button>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <span className="text-sm text-gray-700">Form Status</span>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Active
          </span>
        </div>
      </div>

      {/* Success Message */}
      {copied && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700">
            Link copied to clipboard successfully!
          </p>
        </div>
      )}
    </div>
  );
};

export default LinkCopyComponent;