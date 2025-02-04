import { Video } from "@/data/videos";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VideoCardProps {
  video: Video;
}

const VideoCard = ({ video }: VideoCardProps) => {
  const handleClick = () => {
    window.open(video.url, "_blank");
  };

  return (
    <Card
      className="cursor-pointer overflow-hidden transition-all duration-300 hover:animate-card-hover"
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="aspect-video relative">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg truncate">{video.title}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{video.description}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {video.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">{video.category}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;