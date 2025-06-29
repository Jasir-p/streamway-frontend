import {
  Globe,
  Share2,
  Mail,
  UserPlus,
  Search,
  Facebook,
  Instagram,
  MessageSquare,
  HelpCircle
} from 'lucide-react';

export const getSourceIcon = (source) => {
  switch (source) {
    case 'website':
      return { color: "#3B82F6", icon: Globe };
    case 'whatsapp':
      return { color: "#10B981", icon: MessageSquare };
    case 'facebook':
      return { color: "#1877F2", icon: Facebook };
    case 'instagram':
      return { color: "#E1306C", icon: Instagram };
    case 'referral':
      return { color: "#F59E0B", icon: UserPlus };
    case 'other':
      return { color: "#6B7280", icon: HelpCircle };
    default:
      return { color: "#9CA3AF", icon: Search }; // fallback case
  }
};
