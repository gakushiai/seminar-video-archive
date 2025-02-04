import { Video } from "@/data/videos";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";

interface VideoCardProps {
  video: Video;
  onDelete?: (video: Video) => void;
  onEdit?: (video: Video) => void;
  isAdmin?: boolean;
}

const VideoCard = ({ video, onDelete, onEdit, isAdmin = false }: VideoCardProps) => {
  const handleClick = () => {
    window.open(video.url, "_blank");
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(video);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(video);
    }
  };

  return (
    <Card
      className="cursor-pointer overflow-hidden transition-all duration-300 hover:animate-card-hover relative"
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="aspect-video relative">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          {isAdmin && (
            <div className="absolute top-2 right-2 z-10 flex gap-2">
              {onEdit && (
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
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