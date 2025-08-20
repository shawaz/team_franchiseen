"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DocumentFile {
  file: File | null;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  uploadedAt?: Date;
  verifiedAt?: Date;
  rejectionReason?: string;
}

interface CountryDocument {
  panCard: DocumentFile;
  registrationCertificate: DocumentFile;
  franchiseCertificate: DocumentFile;
}

interface CountryDocumentsTableProps {
  countries: string[];
  countryDocuments: { [countryCode: string]: CountryDocument };
  onDocumentChange: (countryCode: string, documentType: 'panCard' | 'registrationCertificate' | 'franchiseCertificate', file: File | null) => void;
  readonly?: boolean;
}

const countryNames: { [key: string]: string } = {
  'US': 'United States',
  'GB': 'United Kingdom',
  'CA': 'Canada',
  'AU': 'Australia',
  'DE': 'Germany',
  'FR': 'France',
  'IT': 'Italy',
  'ES': 'Spain',
  'NL': 'Netherlands',
  'BE': 'Belgium',
  'CH': 'Switzerland',
  'AT': 'Austria',
  'SE': 'Sweden',
  'NO': 'Norway',
  'DK': 'Denmark',
  'FI': 'Finland',
  'IE': 'Ireland',
  'PT': 'Portugal',
  'GR': 'Greece',
  'PL': 'Poland',
  'CZ': 'Czech Republic',
  'HU': 'Hungary',
  'SK': 'Slovakia',
  'SI': 'Slovenia',
  'HR': 'Croatia',
  'BG': 'Bulgaria',
  'RO': 'Romania',
  'LT': 'Lithuania',
  'LV': 'Latvia',
  'EE': 'Estonia',
  'MT': 'Malta',
  'CY': 'Cyprus',
  'LU': 'Luxembourg',
  'AE': 'United Arab Emirates',
  'SA': 'Saudi Arabia',
  'QA': 'Qatar',
  'KW': 'Kuwait',
  'BH': 'Bahrain',
  'OM': 'Oman',
  'JO': 'Jordan',
  'LB': 'Lebanon',
  'EG': 'Egypt',
  'MA': 'Morocco',
  'TN': 'Tunisia',
  'DZ': 'Algeria',
  'IN': 'India',
  'CN': 'China',
  'JP': 'Japan',
  'KR': 'South Korea',
  'SG': 'Singapore',
  'MY': 'Malaysia',
  'TH': 'Thailand',
  'ID': 'Indonesia',
  'PH': 'Philippines',
  'VN': 'Vietnam',
  'TW': 'Taiwan',
  'HK': 'Hong Kong',
  'MO': 'Macau',
  'BR': 'Brazil',
  'MX': 'Mexico',
  'AR': 'Argentina',
  'CL': 'Chile',
  'CO': 'Colombia',
  'PE': 'Peru',
  'VE': 'Venezuela',
  'UY': 'Uruguay',
  'PY': 'Paraguay',
  'BO': 'Bolivia',
  'EC': 'Ecuador',
  'ZA': 'South Africa',
  'NG': 'Nigeria',
  'KE': 'Kenya',
  'GH': 'Ghana',
  'EH': 'Egypt',
  'TZ': 'Tanzania',
  'UG': 'Uganda',
  'ZW': 'Zimbabwe',
  'ZM': 'Zambia',
  'MW': 'Malawi',
  'MZ': 'Mozambique',
  'BW': 'Botswana',
  'NA': 'Namibia',
  'SZ': 'Eswatini',
  'LS': 'Lesotho',
};

// Get country flag emoji
const getCountryFlag = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export default function CountryDocumentsTable({
  countries,
  countryDocuments,
  onDocumentChange,
  readonly = false
}: CountryDocumentsTableProps) {
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string }>({});

  const handleFileChange = (countryCode: string, documentType: 'panCard' | 'registrationCertificate' | 'franchiseCertificate', file: File | null) => {
    if (readonly) return;

    if (file && file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    if (file && !file.type.includes('pdf') && !file.type.includes('image')) {
      toast.error('Please upload PDF or image files only');
      return;
    }

    // Create preview URL for images
    const previewKey = `${countryCode}-${documentType}`;
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => ({ ...prev, [previewKey]: url }));
    } else {
      // Clean up old preview URL
      if (previewUrls[previewKey]) {
        URL.revokeObjectURL(previewUrls[previewKey]);
        setPreviewUrls(prev => {
          const newUrls = { ...prev };
          delete newUrls[previewKey];
          return newUrls;
        });
      }
    }

    onDocumentChange(countryCode, documentType, file);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'uploaded':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'uploaded':
        return 'Uploaded';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending';
    }
  };

  const documentTypes = [
    { key: 'panCard' as const, label: 'PAN Card' },
    { key: 'registrationCertificate' as const, label: 'Registration Certificate' },
    { key: 'franchiseCertificate' as const, label: 'Franchise Certificate' },
  ];

  return (
    <div className="space-y-6">
      {countries.map((countryCode) => {
        const countryDoc = countryDocuments[countryCode];
        const countryName = countryNames[countryCode] || countryCode;
        const flag = getCountryFlag(countryCode);

        return (
          <div key={countryCode} className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            {/* Country Header */}
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{flag}</span>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{countryName}</h3>
              </div>
            </div>

            {/* Documents Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Document Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Upload
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Preview
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {documentTypes.map((docType) => {
                    const doc = countryDoc?.[docType.key];
                    const previewKey = `${countryCode}-${docType.key}`;
                    const previewUrl = previewUrls[previewKey];

                    return (
                      <tr key={docType.key}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          {docType.label}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {!readonly ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null;
                                  handleFileChange(countryCode, docType.key, file);
                                }}
                                className="hidden"
                                id={`${countryCode}-${docType.key}`}
                              />
                              <label
                                htmlFor={`${countryCode}-${docType.key}`}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                              >
                                {doc?.file ? 'Replace' : 'Upload'}
                              </label>
                              {doc?.file && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleFileChange(countryCode, docType.key, null)}
                                  className="text-red-500 hover:text-red-700 px-2 py-1 h-auto"
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500 text-xs">
                              {doc?.file ? `${doc.file.name} (${(doc.file.size / 1024 / 1024).toFixed(2)} MB)` : 'No file'}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {doc?.file ? (
                            <div className="flex items-center gap-2">
                              {doc.file.type.startsWith('image/') && previewUrl ? (
                                <img
                                  src={previewUrl}
                                  alt={`${docType.label} preview`}
                                  className="w-12 h-12 object-cover rounded border border-gray-300 dark:border-gray-600"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                                  <FileText className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                              <div className="text-xs text-gray-500">
                                <div>{doc.file.name}</div>
                                <div>({(doc.file.size / 1024 / 1024).toFixed(2)} MB)</div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">No preview</span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc?.status || 'pending')}`}>
                            {getStatusText(doc?.status || 'pending')}
                          </span>
                          {doc?.status === 'rejected' && doc.rejectionReason && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                              {doc.rejectionReason}
                            </p>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
