import React from "react";
import {
  Code2,
  Globe,
  MessageSquare,
  Cpu,
  Gamepad2,
  Newspaper,
  Palette,
  Video,
  Headphones,
  CircleDollarSign,
  ShoppingBag,
  Heart,
  Compass,
  Image,
  Rss,
  Search,
  Briefcase,
} from "lucide-react";

interface PlatformIconProps {
  category?: string;
  name: string;
  className?: string;
}

export function PlatformIcon({ category = "misc", name, className = "w-5 h-5" }: PlatformIconProps) {
  const initial = name.charAt(0).toUpperCase();

  const getCategoryIcon = () => {
    switch (category.toLowerCase()) {
      case "coding":
        return <Code2 className={className} />;
      case "social":
        return <MessageSquare className={className} />;
      case "tech":
        return <Cpu className={className} />;
      case "gaming":
        return <Gamepad2 className={className} />;
      case "blog":
        return <Newspaper className={className} />;
      case "art":
        return <Palette className={className} />;
      case "video":
        return <Video className={className} />;
      case "music":
        return <Headphones className={className} />;
      case "finance":
        return <CircleDollarSign className={className} />;
      case "shopping":
        return <ShoppingBag className={className} />;
      case "dating":
        return <Heart className={className} />;
      case "hobby":
        return <Compass className={className} />;
      case "images":
        return <Image className={className} />;
      case "news":
        return <Rss className={className} />;
      case "search":
        return <Search className={className} />;
      case "business":
        return <Briefcase className={className} />;
      default:
        return <Globe className={className} />;
    }
  };

  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold text-xs select-none">
      {getCategoryIcon()}
    </div>
  );
}
